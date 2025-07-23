<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

$conn = new mysqli("localhost", "root", "root", "db01");
if ($conn->connect_error) {
    echo json_encode(['success'=>false]);
    exit;
}

$idmodule = $conn->real_escape_string($data['idmodule']);
$idgroupe = $conn->real_escape_string($data['idgroupe']);
$jour = $conn->real_escape_string($data['jour_semaine']);
$debut = $conn->real_escape_string($data['heure_debut']);
$fin = $conn->real_escape_string($data['heure_fin']);

$sql = "INSERT INTO edt (idmodule, idgroupe, jour_semaine, heure_debut, heure_fin)
        VALUES ('$idmodule', '$idgroupe', '$jour', '$debut', '$fin')";
$res = $conn->query($sql);

echo json_encode(['success'=>$res]);
$conn->close();
?>