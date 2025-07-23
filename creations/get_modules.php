<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', 'root', 'db01');
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion']);
    exit;
}

$sql = "SELECT m.idmodule, m.nom, m.idfiliere, m.idclasse, m.idprof, p.nom AS prof_nom, p.prenom AS prof_prenom
        FROM module m
        JOIN prof p ON m.idprof = p.idprof";
$res = $conn->query($sql);

$modules = [];
while ($row = $res->fetch_assoc()) {
    $modules[] = [
        'idmodule' => $row['idmodule'],
        'nom' => $row['nom'],
        'idfiliere' => $row['idfiliere'],
        'idclasse' => $row['idclasse'],
        'idprof' => $row['idprof'],
        'prof' => $row['prof_nom'] . ' ' . $row['prof_prenom']
    ];
}
echo json_encode($modules);
$conn->close();
?>