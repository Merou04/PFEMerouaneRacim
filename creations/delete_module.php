<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', 'root', 'db01');
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion']);
    exit;
}
$idmodule = $_POST['idmodule'] ?? '';
if (!$idmodule) {
    http_response_code(400);
    echo json_encode(['error' => 'ID manquant']);
    exit;
}
$stmt = $conn->prepare("DELETE FROM module WHERE idmodule=?");
$stmt->bind_param("i", $idmodule);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la suppression : ' . $stmt->error]);
}
$stmt->close();
$conn->close();
?>