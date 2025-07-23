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
$heure_debut = $conn->real_escape_string($data['heure_debut']);

$sql = "DELETE FROM edt WHERE idmodule='$idmodule' AND idgroupe='$idgroupe' AND jour_semaine='$jour' AND heure_debut='$heure_debut' LIMIT 1";
$res = $conn->query($sql);

echo json_encode(['success'=>$res]);
$conn->close();
?>