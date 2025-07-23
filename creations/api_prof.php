<?php
// filepath: c:\xampp\htdocs\creations\api_prof.php
header('Content-Type: application/json');
$pdo = new PDO('mysql:host=localhost;dbname=db01;charset=utf8mb4', 'root', 'root');

// Ajouter un professeur
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['action'] === 'addProf') {
    $idprof = $_POST['idprof'];
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $numcarteprof = $_POST['numcarteprof'];
    // Vérifier unicité
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM prof WHERE idprof = ?");
    $stmt->execute([$idprof]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'ID Prof déjà existant']);
        exit;
    }
    $stmt = $pdo->prepare("INSERT INTO prof (idprof, nom, prenom, numcarteprof) VALUES (?, ?, ?, ?)");
    $ok = $stmt->execute([$idprof, $nom, $prenom, $numcarteprof]);
    echo json_encode(['success' => $ok]);
    exit;
}

// Lister les professeurs
if ($_GET['action'] === 'list') {
    $stmt = $pdo->query("SELECT idprof, nom, prenom, numcarteprof FROM prof ORDER BY idprof");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}
echo json_encode(['success' => false, 'message' => 'Action inconnue']);