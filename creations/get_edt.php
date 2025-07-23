<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "root", "db01");
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

$filiere = isset($_GET['filiere']) ? $conn->real_escape_string($_GET['filiere']) : '';
$classe = isset($_GET['classe']) ? $conn->real_escape_string($_GET['classe']) : '';
$section = isset($_GET['section']) ? $conn->real_escape_string($_GET['section']) : '';
$groupe = isset($_GET['groupe']) ? $conn->real_escape_string($_GET['groupe']) : '';
$jour = isset($_GET['jour']) ? $conn->real_escape_string($_GET['jour']) : '';
$idmodule = isset($_GET['idmodule']) ? $conn->real_escape_string($_GET['idmodule']) : '';
$nommodule = isset($_GET['nommodule']) ? $conn->real_escape_string($_GET['nommodule']) : '';

$sql = "SELECT edt.idmodule, module.nom AS module_nom, edt.idgroupe, edt.jour_semaine, edt.heure_debut, edt.heure_fin, groupe.idfiliere, groupe.idclasse, groupe.idsection
        FROM edt
        LEFT JOIN module ON edt.idmodule = module.idmodule
        LEFT JOIN groupe ON edt.idgroupe = groupe.idgroupe
        WHERE 1";

if ($filiere !== '') {
    $sql .= " AND groupe.idfiliere = '$filiere'";
}
if ($classe !== '') {
    $sql .= " AND groupe.idclasse = '$classe'";
}
if ($section !== '') {
    $sql .= " AND groupe.idsection = '$section'";
}
if ($groupe !== '') {
    $sql .= " AND edt.idgroupe LIKE '%$groupe%'";
}
if ($jour !== '') {
    $sql .= " AND edt.jour_semaine = '$jour'";
}
if ($idmodule !== '') {
    $sql .= " AND edt.idmodule LIKE '%$idmodule%'";
}
if ($nommodule !== '') {
    $sql .= " AND module.nom LIKE '%$nommodule%'";
}

$result = $conn->query($sql);
$data = [];
if ($result) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}
$conn->close();
echo json_encode($data);
?>