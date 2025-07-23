<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', 'root', 'db01');
$type = $_GET['type'] ?? '';
$options = [];

if ($type == 'filiere') {
    $res = $conn->query("SELECT idfiliere, nom FROM filiere");
    while ($row = $res->fetch_assoc()) {
        $options[] = [
            'value' => $row['idfiliere'],
            'label' => $row['nom']
        ];
    }
} elseif ($type == 'classe') {
    $idfiliere = isset($_GET['idfiliere']) ? $conn->real_escape_string($_GET['idfiliere']) : '';
    $sql = "SELECT idclasse FROM classe";
    if ($idfiliere) {
        $sql .= " WHERE idfiliere = '$idfiliere'";
    }
    $res = $conn->query($sql);
    while ($row = $res->fetch_assoc()) {
        $options[] = [
            'value' => $row['idclasse'],
            'label' => $row['idclasse']
        ];
    }
} elseif ($type == 'prof') {
    $res = $conn->query("SELECT idprof, nom, prenom FROM prof");
    while ($row = $res->fetch_assoc()) {
        $options[] = [
            'value' => $row['idprof'],
            'label' => $row['nom'] . ' ' . $row['prenom']
        ];
    }
}
echo json_encode($options);
$conn->close();
?>