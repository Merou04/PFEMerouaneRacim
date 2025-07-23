<?php
// Connexion à la base de données avec vos paramètres
$conn = mysqli_connect('localhost', 'root', 'root', 'dbpfe');
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Fonction pour sécuriser les entrées
function secure_input($data) {
    global $conn;
    return mysqli_real_escape_string($conn, trim($data));
}

// Traitement de la création de compte
if (isset($_POST['action']) && $_POST['action'] == 'create') {
    $username = secure_input($_POST['username']);
    $password = secure_input($_POST['password']);
    $confirm_password = secure_input($_POST['confirm_password']);
    $account_type = secure_input($_POST['account_type']);
    
    // Validation
    $errors = [];
    
    if (empty($username)) {
        $errors[] = "Le nom d'utilisateur est requis";
    }
    
    if (empty($password)) {
        $errors[] = "Le mot de passe est requis";
    }
    
    if ($password !== $confirm_password) {
        $errors[] = "Les mots de passe ne correspondent pas";
    }
    
    if (empty($account_type)) {
        $errors[] = "Le type de compte est requis";
    }
    
    // Vérifier si l'utilisateur existe déjà
    $check_user = mysqli_query($conn, "SELECT * FROM accounts WHERE username = '$username'");
    if (mysqli_num_rows($check_user) > 0) {
        $errors[] = "Ce nom d'utilisateur existe déjà";
    }
    
    if (!empty($errors)) {
        $error_message = implode(", ", $errors);
        header("Location: createacc.html?status=error&message=" . urlencode($error_message));
        exit();
    }
    
    // Hasher le mot de passe
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Insérer le nouvel utilisateur
    $sql = "INSERT INTO accounts (username, password, account_type_id, created_at) 
            VALUES ('$username', '$hashed_password', '$account_type', NOW())";
    
    if (mysqli_query($conn, $sql)) {
        header("Location: createacc.html?status=success&message=" . urlencode("Compte créé avec succès"));
    } else {
        header("Location: createacc.html?status=error&message=" . urlencode("Erreur lors de la création du compte: " . mysqli_error($conn)));
    }
    exit();
}

// Traitement de la modification de compte
if (isset($_POST['action']) && $_POST['action'] == 'update') {
    $account_id = secure_input($_POST['account_id']);
    $username = secure_input($_POST['edit-username']);
    $password = secure_input($_POST['edit-password']);
    $account_type = secure_input($_POST['edit-acctype']);
    
    // Validation
    $errors = [];
    
    if (empty($username)) {
        $errors[] = "Le nom d'utilisateur est requis";
    }
    
    if (empty($account_type)) {
        $errors[] = "Le type de compte est requis";
    }
    
    // Vérifier si le nom d'utilisateur existe déjà (sauf pour le compte actuel)
    $check_user = mysqli_query($conn, "SELECT * FROM accounts WHERE username = '$username' AND account_id != '$account_id'");
    if (mysqli_num_rows($check_user) > 0) {
        $errors[] = "Ce nom d'utilisateur est déjà utilisé par un autre compte";
    }
    
    if (!empty($errors)) {
        $error_message = implode(", ", $errors);
        header("Location: createacc.html?status=error&message=" . urlencode($error_message));
        exit();
    }
    
    // Construire la requête SQL
    if (!empty($password)) {
        // Mettre à jour avec nouveau mot de passe
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $sql = "UPDATE accounts SET username = '$username', password = '$hashed_password', account_type_id = '$account_type' WHERE account_id = '$account_id'";
    } else {
        // Mettre à jour sans changer le mot de passe
        $sql = "UPDATE accounts SET username = '$username', account_type_id = '$account_type' WHERE account_id = '$account_id'";
    }
    
    if (mysqli_query($conn, $sql)) {
        header("Location: createacc.html?status=success&message=" . urlencode("Compte modifié avec succès"));
    } else {
        header("Location: createacc.html?status=error&message=" . urlencode("Erreur lors de la modification: " . mysqli_error($conn)));
    }
    exit();
}

// Traitement de la suppression de compte
if (isset($_POST['action']) && $_POST['action'] == 'delete') {
    $account_id = secure_input($_POST['account_id']);
    
    if (empty($account_id)) {
        header("Location: createacc.html?status=error&message=" . urlencode("ID de compte invalide"));
        exit();
    }
    
    // Vérifier que ce n'est pas le compte admin principal (optionnel)
    $check_admin = mysqli_query($conn, "SELECT * FROM accounts WHERE account_id = '$account_id' AND username = 'admin'");
    if (mysqli_num_rows($check_admin) > 0) {
        header("Location: createacc.html?status=error&message=" . urlencode("Impossible de supprimer le compte administrateur principal"));
        exit();
    }
    
    $sql = "DELETE FROM accounts WHERE account_id = '$account_id'";
    
    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn) > 0) {
            header("Location: createacc.html?status=success&message=" . urlencode("Compte supprimé avec succès"));
        } else {
            header("Location: createacc.html?status=error&message=" . urlencode("Aucun compte trouvé avec cet ID"));
        }
    } else {
        header("Location: createacc.html?status=error&message=" . urlencode("Erreur lors de la suppression: " . mysqli_error($conn)));
    }
    exit();
}

// Si aucune action valide n'est trouvée
header("Location: createacc.html?status=error&message=" . urlencode("Action non valide"));
exit();

mysqli_close($conn);
?>