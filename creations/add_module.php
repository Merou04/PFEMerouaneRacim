<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', 'root', 'db01');
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion']);
    exit;
}

$idmodule = $_POST['idmodule'] ?? '';
$nom = $_POST['nom'] ?? '';
$idfiliere = $_POST['idfiliere'] ?? '';
$idclasse = $_POST['idclasse'] ?? '';
$idprof = $_POST['prof'] ?? '';

if (!$idmodule || !$nom || !$idfiliere || !$idclasse || !$idprof) {
    http_response_code(400);
    echo json_encode(['error' => 'Champs manquants']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO module (idmodule, nom, idfiliere, idclasse, idprof) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $idmodule, $nom, $idfiliere, $idclasse, $idprof);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de l\'ajout : ' . $stmt->error]);
}
$stmt->close();
$conn->close();
?>