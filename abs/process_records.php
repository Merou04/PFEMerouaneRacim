<?php
// Inclure la configuration de la base de données
require_once 'config.php';

// Démarrer une transaction
$conn->beginTransaction();

try {
    // Récupérer les enregistrements non traités
    $stmt = $conn->prepare("SELECT * FROM attendancerecordinfo LIMIT 50");
    $stmt->execute();
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $processed_count = 0;

    // Traiter chaque enregistrement
    foreach ($records as $record) {
        // Vérifier que l'étudiant existe
        $stmt = $conn->prepare("SELECT idetu, idgroupe FROM etudiant WHERE idetu = :idetu");
        $stmt->bindParam(':idetu', $record['PersonID']);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $etudiant = $stmt->fetch(PDO::FETCH_ASSOC);
            $idgroupe = $etudiant['idgroupe'];

            // Convertir le timestamp millisecondes en format datetime
            $attendance_timestamp = $record['AttendanceDateTime'] / 1000;
            $attendance_datetime = date('Y-m-d H:i:s', $attendance_timestamp);
            $attendance_date = date('Y-m-d', $attendance_timestamp);
            $attendance_time = date('H:i:s', $attendance_timestamp);

            // Déterminer le jour de la semaine (1=lundi, 7=dimanche)
            $day_of_week = date('N', $attendance_timestamp);
            $days = ['', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
            $jour_semaine = $days[$day_of_week];

            // Obtenir les modules du jour pour ce groupe
            $stmt = $conn->prepare("
                SELECT e.idmodule, e.heure_debut, e.heure_fin, m.nom as nom_module 
                FROM edt e 
                JOIN module m ON e.idmodule = m.idmodule
                WHERE e.idgroupe = :idgroupe 
                AND e.jour_semaine = :jour_semaine
                ORDER BY e.heure_debut ASC
            ");
            $stmt->bindParam(':idgroupe', $idgroupe);
            $stmt->bindParam(':jour_semaine', $jour_semaine);
            $stmt->execute();
            $modules_of_day = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($modules_of_day) > 0) {
                // Déterminer le module correspondant à l'heure d'assiduité
                $current_module = null;
                $previous_module = null;

                foreach ($modules_of_day as $index => $module) {
                    if ($attendance_time >= $module['heure_debut'] && $attendance_time <= $module['heure_fin']) {
                        $current_module = $module;
                        if ($index > 0) {
                            $previous_module = $modules_of_day[$index - 1];
                        }
                        break;
                    } else if ($attendance_time < $module['heure_debut']) {
                        $current_module = $module;
                        if ($index > 0) {
                            $previous_module = $modules_of_day[$index - 1];
                        }
                        break;
                    }
                    $previous_module = $module;
                }

                if (!$current_module && count($modules_of_day) > 0) {
                    $current_module = $modules_of_day[count($modules_of_day) - 1];
                }

                // Déterminer le statut
                $statut = '0'; // Par défaut: présent

                if ($current_module) {
                    // Calculer la période de retard (15 minutes après le début du cours)
                    $heure_debut = strtotime($attendance_date . ' ' . $current_module['heure_debut']);
                    $heure_fin = strtotime($attendance_date . ' ' . $current_module['heure_fin']);
                    $heure_retard = $heure_debut + (15 * 60); // +15 minutes

                    if ($attendance_timestamp >= $heure_debut && $attendance_timestamp <= $heure_retard) {
                        $statut = '1'; // Retard
                    } else if ($attendance_timestamp > $heure_retard && $attendance_timestamp <= $heure_fin) {
                        $statut = '2'; // Absent
                    } else if ($attendance_timestamp < $heure_debut) {
                        $statut = '0'; // Présent
                        if ($previous_module) {
                            $heure_fin_prev = strtotime($attendance_date . ' ' . $previous_module['heure_fin']);
                            if ($attendance_timestamp > $heure_fin_prev) {
                                $statut = '0';
                            }
                        }
                    }

                    // Check if this record is already in the presences table
                    $stmt = $conn->prepare("
                        SELECT COUNT(*) as count FROM presences 
                        WHERE idetu = :idetu AND date_presence = :date_presence
                    ");
                    $stmt->bindParam(':idetu', $record['PersonID']);
                    $stmt->bindParam(':date_presence', $attendance_datetime);
                    $stmt->execute();
                    $existingRecord = $stmt->fetch(PDO::FETCH_ASSOC);

                    // Only insert if it doesn't exist yet
                    if ($existingRecord['count'] == 0) {
                        // Insérer dans la table présences
                        $stmt = $conn->prepare("
                            INSERT INTO presences (idetu, idmodule, date_presence, statut)
                            VALUES (:idetu, :idmodule, :date_presence, :statut)
                        ");
                        $stmt->bindParam(':idetu', $record['PersonID']);
                        $stmt->bindParam(':idmodule', $current_module['idmodule']);
                        $stmt->bindParam(':date_presence', $attendance_datetime);
                        $stmt->bindParam(':statut', $statut);
                        $stmt->execute();

                        $processed_count++;
                    }
                }
            }
        }
        // Supprimer la ligne traitée de attendancerecordinfo
        $stmt = $conn->prepare("DELETE FROM attendancerecordinfo WHERE id = :id");
        $stmt->bindParam(':id', $record['id']);
        $stmt->execute();
    }

    // Valider la transaction
    $conn->commit();

    // Préparer la réponse
    $response = [
        'success' => true,
        'processed' => $processed_count,
        'message' => $processed_count > 0 ? "Traitement terminé avec succès." : "Aucun nouvel enregistrement à traiter."
    ];

} catch(PDOException $e) {
    // Annuler la transaction en cas d'erreur
    $conn->rollBack();

    $response = [
        'success' => false,
        'message' => "Erreur lors du traitement des enregistrements: " . $e->getMessage()
    ];
}

// Renvoyer la réponse au format JSON
header('Content-Type: application/json');
echo json_encode($response);
?>