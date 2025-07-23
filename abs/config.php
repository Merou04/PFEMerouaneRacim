<?php
// Configuration de la base de données
$host = "localhost";
$db_name = "db01";
$username = "root";
$password = "root";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    // Définir le mode d'erreur PDO sur Exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Erreur de connexion à la base de données: " . $e->getMessage());
}
?>