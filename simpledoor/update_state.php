<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['doorIds']) || !isset($input['state'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
    exit;
}

$doorIds = $input['doorIds'];
$state = (int) $input['state'];

// Validate state
if ($state < 0 || $state > 3) {
    echo json_encode(['success' => false, 'message' => 'Invalid state value']);
    exit;
}

try {
    $pdo->beginTransaction();
    
    $placeholders = implode(',', array_fill(0, count($doorIds), '?'));
    $stmt = $pdo->prepare("UPDATE doors SET state = ? WHERE id IN ($placeholders)");
    
    $params = array_merge([$state], $doorIds);
    $stmt->execute($params);
    
    $pdo->commit();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Door state(s) updated successfully',
        'affectedRows' => $stmt->rowCount()
    ]);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode([
        'success' => false, 
        'message' => 'Error updating door state: ' . $e->getMessage()
    ]);
    error_log($e->getMessage());
}
?>