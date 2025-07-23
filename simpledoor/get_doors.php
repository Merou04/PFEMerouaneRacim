<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

try {
    $stmt = $pdo->query("SELECT * FROM doors ORDER BY name");
    $doors = $stmt->fetchAll();
    echo json_encode(['success' => true, 'doors' => $doors]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error fetching doors: ' . $e->getMessage()]);
    error_log($e->getMessage());
}
?>