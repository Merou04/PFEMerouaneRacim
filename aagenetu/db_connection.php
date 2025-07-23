<?php
function getDbConnection() {
    $servername = "localhost";
    $username = "root";
    $password = "root"; // Update if needed
    $dbname = "db01";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}
?>