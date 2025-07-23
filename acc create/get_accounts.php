<?php
// filepath: c:\xampp\htdocs\acc create\get_accounts.php
// Connexion à la base de données avec mot de passe "root"
$conn = mysqli_connect('localhost', 'root', 'root', 'dbpfe');
if (!$conn) {
    die(json_encode(['error' => "Erreur de connexion: " . mysqli_connect_error()]));
}

// Récupérer les comptes avec les informations sur le type de compte
$sql = "SELECT a.account_id, a.username, a.created_at, a.last_login, t.type_id, t.type_name 
        FROM accounts a 
        JOIN account_types t ON a.account_type_id = t.type_id 
        ORDER BY a.account_id";

$result = mysqli_query($conn, $sql);

$accounts = array();
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $accounts[] = $row;
    }
}

// Renvoyer les données au format JSON
header('Content-Type: application/json');
echo json_encode($accounts);

mysqli_close($conn);
?>