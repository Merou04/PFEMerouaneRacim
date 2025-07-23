<?php
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "root", "db01");
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

// Filières
$filieres = [];
$res = $conn->query("SELECT idfiliere, nom FROM filiere");
while ($row = $res->fetch_assoc()) $filieres[] = $row;

// Classes
$classes = [];
$res = $conn->query("SELECT idclasse, idfiliere FROM classe");
while ($row = $res->fetch_assoc()) $classes[] = $row;

// Sections
$sections = [];
$res = $conn->query("SELECT idsection, idclasse, idfiliere FROM section");
while ($row = $res->fetch_assoc()) $sections[] = $row;

// Groupes
$groupes = [];
$res = $conn->query("SELECT idgroupe, idsection, idclasse, idfiliere FROM groupe");
while ($row = $res->fetch_assoc()) $groupes[] = $row;

// Modules
$modules = [];
$res = $conn->query("SELECT idmodule, nom, idfiliere, idclasse FROM module");
while ($row = $res->fetch_assoc()) $modules[] = $row;

echo json_encode([
    'filieres' => $filieres,
    'classes' => $classes,
    'sections' => $sections,
    'groupes' => $groupes,
    'modules' => $modules
]);
$conn->close();
?>