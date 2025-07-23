<?php
// Inclure la configuration de la base de données
require_once 'config.php';

// Préparer la réponse
$response = array();

try {
    // Récupérer les filières
    $stmt = $conn->prepare("SELECT idfiliere, nom FROM filiere ORDER BY nom");
    $stmt->execute();
    $response['filieres'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Récupérer les classes
    $stmt = $conn->prepare("SELECT idclasse, idfiliere FROM classe ORDER BY idclasse");
    $stmt->execute();
    $response['classes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Récupérer les groupes
    $stmt = $conn->prepare("SELECT idgroupe, idsection, idclasse, idfiliere FROM groupe ORDER BY idgroupe");
    $stmt->execute();
    $response['groupes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Récupérer les étudiants
    $stmt = $conn->prepare("SELECT idetu, nom, prenom, idfiliere, idclasse, idgroupe FROM etudiant ORDER BY nom, prenom");
    $stmt->execute();
    $response['etudiants'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
} catch(PDOException $e) {
    $response = [
        'error' => true,
        'message' => "Erreur lors de la récupération des filtres: " . $e->getMessage()
    ];
}

// Renvoyer la réponse au format JSON
header('Content-Type: application/json');
echo json_encode($response);
?>