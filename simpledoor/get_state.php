<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

$doorId = isset($_GET['id']) ? (int)$_GET['id'] : 1; // Default to first door if none specified

try {
    $stmt = $pdo->prepare("SELECT state FROM doors WHERE id = ?");
    $stmt->execute([$doorId]);
    $door = $stmt->fetch();
    
    if ($door) {
        echo json_encode(['success' => true, 'state' => (int)$door['state']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Door not found']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>