<?php
// Inclure la configuration de la base de données
require_once 'config.php';

// Récupérer les paramètres de filtre
$filiere = isset($_GET['filiere']) ? $_GET['filiere'] : '';
$classe = isset($_GET['classe']) ? $_GET['classe'] : '';
$groupe = isset($_GET['groupe']) ? $_GET['groupe'] : '';
$etudiant = isset($_GET['etudiant']) ? $_GET['etudiant'] : '';
$statut = isset($_GET['statut']) ? $_GET['statut'] : '';
$date_start = isset($_GET['date_start']) ? $_GET['date_start'] : '';
$date_end = isset($_GET['date_end']) ? $_GET['date_end'] : '';

// Pagination
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$records_per_page = 10;
$offset = ($page - 1) * $records_per_page;

// Préparer la réponse
$response = array();

try {
    // Construire la requête SQL avec filtres
    $sql = "
        SELECT p.id, p.idetu, e.nom as nom_etudiant, e.prenom as prenom_etudiant, 
               p.idmodule, m.nom as nom_module, p.date_presence, p.statut,
               e.idfiliere, e.idclasse, e.idgroupe
        FROM presences p
        LEFT JOIN etudiant e ON p.idetu = e.idetu
        LEFT JOIN module m ON p.idmodule = m.idmodule
        WHERE 1=1
    ";
    
    $params = array();
    
    if ($filiere) {
        $sql .= " AND e.idfiliere = :filiere";
        $params[':filiere'] = $filiere;
    }
    
    if ($classe) {
        $sql .= " AND e.idclasse = :classe";
        $params[':classe'] = $classe;
    }
    
    if ($groupe) {
        $sql .= " AND e.idgroupe = :groupe";
        $params[':groupe'] = $groupe;
    }
    
    if ($etudiant) {
        $sql .= " AND p.idetu = :etudiant";
        $params[':etudiant'] = $etudiant;
    }
    
    if ($statut !== '') {
        $sql .= " AND p.statut = :statut";
        $params[':statut'] = $statut;
    }
    
    if ($date_start) {
        $sql .= " AND DATE(p.date_presence) >= :date_start";
        $params[':date_start'] = $date_start;
    }
    
    if ($date_end) {
        $sql .= " AND DATE(p.date_presence) <= :date_end";
        $params[':date_end'] = $date_end;
    }
    
    // Compter le nombre total d'enregistrements pour la pagination
    $count_sql = str_replace("SELECT p.id, p.idetu, e.nom as nom_etudiant, e.prenom as prenom_etudiant, 
               p.idmodule, m.nom as nom_module, p.date_presence, p.statut,
               e.idfiliere, e.idclasse, e.idgroupe", "SELECT COUNT(*) as total", $sql);
    
    $stmt = $conn->prepare($count_sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();
    $total_records = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Ajouter l'ordre et la pagination
    $sql .= " ORDER BY p.date_presence DESC LIMIT " . $offset . ", " . $records_per_page;
    
    // Exécuter la requête principale
    $stmt = $conn->prepare($sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Préparer la réponse
    $response = [
        'records' => $records,
        'pagination' => [
            'total_records' => $total_records,
            'records_per_page' => $records_per_page,
            'current_page' => $page,
            'total_pages' => ceil($total_records / $records_per_page)
        ]
    ];
    
} catch(PDOException $e) {
    $response = [
        'error' => true,
        'message' => "Erreur lors de la récupération des présences: " . $e->getMessage()
    ];
}

// Renvoyer la réponse au format JSON
header('Content-Type: application/json');
echo json_encode($response);
?>