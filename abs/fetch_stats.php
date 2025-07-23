<?php
// Inclure la configuration de la base de données
require_once 'config.php';

// Préparer la réponse
$response = array();

try {
    // Compter tous les enregistrements dans attendancerecordinfo
    $stmt = $conn->prepare("SELECT COUNT(*) as total_count FROM attendancerecordinfo");
    $stmt->execute();
    $unprocessed = $stmt->fetch(PDO::FETCH_ASSOC)['total_count'];
    
    // Compter les enregistrements déjà traités
    $stmt = $conn->prepare("SELECT COUNT(*) as processed_count FROM presences");
    $stmt->execute();
    $processed = $stmt->fetch(PDO::FETCH_ASSOC)['processed_count'];
    
    // Préparer la réponse
    $response = [
        'unprocessed' => (int) $unprocessed,
        'processed' => (int) $processed
    ];
    
} catch(PDOException $e) {
    $response = [
        'error' => true,
        'message' => "Erreur lors de la récupération des statistiques: " . $e->getMessage()
    ];
}

// Renvoyer la réponse au format JSON
header('Content-Type: application/json');
echo json_encode($response);
?>