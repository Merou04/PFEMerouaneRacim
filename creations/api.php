<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration de la base de données
$host = 'localhost';
$dbname = 'db01';
$username = 'root';
$password = 'root';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion: ' . $e->getMessage()]);
    exit;
}

$action = $_REQUEST['action'] ?? '';

switch($action) {
    // FILIÈRES
    case 'getFilieres':
        try {
            $stmt = $pdo->query("SELECT * FROM filiere ORDER BY nom");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'addFiliere':
        try {
            $stmt = $pdo->prepare("INSERT INTO filiere (idfiliere, nom) VALUES (?, ?)");
            $stmt->execute([$_POST['idfiliere'], $_POST['nom']]);
            echo json_encode(['success' => true, 'message' => 'Filière ajoutée avec succès']);
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'updateFiliere':
        try {
            $stmt = $pdo->prepare("UPDATE filiere SET idfiliere = ?, nom = ? WHERE id = ?");
            $stmt->execute([$_POST['idfiliere'], $_POST['nom'], $_POST['id']]);
            echo json_encode(['success' => true, 'message' => 'Filière modifiée avec succès']);
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'deleteFiliere':
        try {
            $stmt = $pdo->prepare("DELETE FROM filiere WHERE id = ?");
            $stmt->execute([$_POST['id']]);
            echo json_encode(['success' => true, 'message' => 'Filière supprimée avec succès']);
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    // CLASSES
    case 'getClasses':
        try {
            $stmt = $pdo->query("SELECT * FROM classe ORDER BY idclasse");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'addClasse':
        try {
            $stmt = $pdo->prepare("INSERT INTO classe (idclasse, idfiliere) VALUES (?, ?)");
            $stmt->execute([$_POST['idclasse'], $_POST['idfiliere']]);
            echo json_encode(['success' => true, 'message' => 'Classe ajoutée avec succès']);
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'updateClasse':
        try {
            $stmt = $pdo->prepare("UPDATE classe SET idclasse = ?, idfiliere = ? WHERE id = ?");
            $stmt->execute([$_POST['idclasse'], $_POST['idfiliere'], $_POST['id']]);
            echo json_encode(['success' => true, 'message' => 'Classe modifiée avec succès']);
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'deleteClasse':
        try {
            $stmt = $pdo->prepare("DELETE FROM classe WHERE id = ?");
            $stmt->execute([$_POST['id']]);
            echo json_encode(['success' => true, 'message' => 'Classe supprimée avec succès']);
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    // SECTIONS
    case 'getSections':
        try {
            $stmt = $pdo->query("SELECT * FROM section ORDER BY idsection");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'addSection':
        try {
            $stmt = $pdo->prepare("INSERT INTO section (idsection, idclasse, idfiliere) VALUES (?, ?, ?)");
            $stmt->execute([$_POST['idsection'], $_POST['idclasse'], $_POST['idfiliere']]);
            echo json_encode(['success' => true, 'message' => 'Section ajoutée avec succès']);
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'updateSection':
        try {
            $stmt = $pdo->prepare("UPDATE section SET idsection = ?, idclasse = ?, idfiliere = ? WHERE id = ?");
            $stmt->execute([$_POST['idsection'], $_POST['idclasse'], $_POST['idfiliere'], $_POST['id']]);
            echo json_encode(['success' => true, 'message' => 'Section modifiée avec succès']);
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'deleteSection':
        try {
            $stmt = $pdo->prepare("DELETE FROM section WHERE id = ?");
            $stmt->execute([$_POST['id']]);
            echo json_encode(['success' => true, 'message' => 'Section supprimée avec succès']);
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    // GROUPES
    case 'getGroupes':
        try {
            $stmt = $pdo->query("SELECT * FROM groupe ORDER BY idgroupe");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'addGroupe':
        try {
            $stmt = $pdo->prepare("INSERT INTO groupe (idgroupe, idsection, idclasse, idfiliere) VALUES (?, ?, ?, ?)");
            $stmt->execute([$_POST['idgroupe'], $_POST['idsection'], $_POST['idclasse'], $_POST['idfiliere']]);
            echo json_encode(['success' => true, 'message' => 'Groupe ajouté avec succès']);
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'updateGroupe':
        try {
            $stmt = $pdo->prepare("UPDATE groupe SET idgroupe = ?, idsection = ?, idclasse = ?, idfiliere = ? WHERE id = ?");
            $stmt->execute([$_POST['idgroupe'], $_POST['idsection'], $_POST['idclasse'], $_POST['idfiliere'], $_POST['id']]);
            echo json_encode(['success' => true, 'message' => 'Groupe modifié avec succès']);
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'deleteGroupe':
        try {
            $stmt = $pdo->prepare("DELETE FROM groupe WHERE id = ?");
            $stmt->execute([$_POST['id']]);
            echo json_encode(['success' => true, 'message' => 'Groupe supprimé avec succès']);
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Action non reconnue']);
        break;
}
?>