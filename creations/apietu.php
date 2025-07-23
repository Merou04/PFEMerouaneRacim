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
    die(json_encode(['success' => false, 'message' => 'Erreur de connexion: ' . $e->getMessage()]));
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch($action) {
    case 'getFilieres':
        getFilieres();
        break;
    case 'getClasses':
        getClasses();
        break;
    case 'getClassesByFiliere':
        getClassesByFiliere();
        break;
    case 'getSections':
        getSections();
        break;
    case 'getSectionsByClasse':
        getSectionsByClasse();
        break;
    case 'getGroupes':
        getGroupes();
        break;
    case 'getGroupesBySection':
        getGroupesBySection();
        break;
    case 'getStudents':
        getStudents();
        break;
    case 'addStudent':
        addStudent();
        break;
    case 'updateStudent':
        updateStudent();
        break;
    case 'deleteStudent':
        deleteStudent();
        break;
    case 'getStudent':
        getStudent();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Action non reconnue: ' . $action]);
}

function getFilieres() {
    global $pdo;
    try {
        $stmt = $pdo->query("SELECT * FROM filiere ORDER BY nom");
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des filières: ' . $e->getMessage()]);
    }
}

function getClasses() {
    global $pdo;
    try {
        $stmt = $pdo->query("SELECT * FROM classe ORDER BY idclasse");
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des classes: ' . $e->getMessage()]);
    }
}

function getClassesByFiliere() {
    global $pdo;
    $idfiliere = $_GET['idfiliere'] ?? '';
    
    if (empty($idfiliere)) {
        echo json_encode([]);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM classe WHERE idfiliere = ? ORDER BY idclasse");
        $stmt->execute([$idfiliere]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des classes: ' . $e->getMessage()]);
    }
}

function getSections() {
    global $pdo;
    try {
        $stmt = $pdo->query("
            SELECT s.*, c.idfiliere 
            FROM section s 
            LEFT JOIN classe c ON s.idclasse = c.idclasse 
            ORDER BY s.idsection
        ");
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des sections: ' . $e->getMessage()]);
    }
}

function getSectionsByClasse() {
    global $pdo;
    $idclasse = $_GET['idclasse'] ?? '';
    
    if (empty($idclasse)) {
        echo json_encode([]);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            SELECT s.*, c.idfiliere 
            FROM section s 
            LEFT JOIN classe c ON s.idclasse = c.idclasse 
            WHERE s.idclasse = ? 
            ORDER BY s.idsection
        ");
        $stmt->execute([$idclasse]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des sections: ' . $e->getMessage()]);
    }
}

function getGroupes() {
    global $pdo;
    try {
        $stmt = $pdo->query("
            SELECT g.*, s.idclasse, c.idfiliere 
            FROM groupe g 
            LEFT JOIN section s ON g.idsection = s.idsection 
            LEFT JOIN classe c ON s.idclasse = c.idclasse 
            ORDER BY g.idgroupe
        ");
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des groupes: ' . $e->getMessage()]);
    }
}

function getGroupesBySection() {
    global $pdo;
    $idsection = $_GET['idsection'] ?? '';
    
    if (empty($idsection)) {
        echo json_encode([]);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("
            SELECT g.*, s.idclasse, c.idfiliere 
            FROM groupe g 
            LEFT JOIN section s ON g.idsection = s.idsection 
            LEFT JOIN classe c ON s.idclasse = c.idclasse 
            WHERE g.idsection = ? 
            ORDER BY g.idgroupe
        ");
        $stmt->execute([$idsection]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des groupes: ' . $e->getMessage()]);
    }
}

function getStudents() {
    global $pdo;
    try {
        $stmt = $pdo->query("
            SELECT e.*, f.nom as filiere_nom 
            FROM etudiant e 
            LEFT JOIN filiere f ON e.idfiliere = f.idfiliere 
            ORDER BY e.nom, e.prenom
        ");
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des étudiants: ' . $e->getMessage()]);
    }
}

function getStudent() {
    global $pdo;
    
    $id = $_GET['id'] ?? '';
    
    if (empty($id)) {
        echo json_encode(['success' => false, 'message' => 'ID requis']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM etudiant WHERE id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            echo json_encode(['success' => true, 'data' => $result]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Étudiant non trouvé']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération de l\'étudiant: ' . $e->getMessage()]);
    }
}

function addStudent() {
    global $pdo;
    
    $idetu = trim($_POST['idetu'] ?? '');
    $nom = trim($_POST['nom'] ?? '');
    $prenom = trim($_POST['prenom'] ?? '');
    $numcarteetu = trim($_POST['numcarteetu'] ?? '');
    $idfiliere = trim($_POST['idfiliere'] ?? '');
    $idclasse = trim($_POST['idclasse'] ?? '');
    $idsection = trim($_POST['idsection'] ?? '');
    $idgroupe = trim($_POST['idgroupe'] ?? '');
    
    if (empty($idetu) || empty($nom) || empty($prenom) || empty($numcarteetu) || 
        empty($idfiliere) || empty($idclasse) || empty($idsection) || empty($idgroupe)) {
        echo json_encode(['success' => false, 'message' => 'Tous les champs sont requis']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM etudiant WHERE idetu = ? OR numcarteetu = ?");
        $stmt->execute([$idetu, $numcarteetu]);
        if ($stmt->fetchColumn() > 0) {
            echo json_encode(['success' => false, 'message' => 'Un étudiant avec cet ID ou ce numéro de carte existe déjà']);
            return;
        }
        
        $stmt = $pdo->prepare("INSERT INTO etudiant (idetu, nom, prenom, numcarteetu, idfiliere, idclasse, idsection, idgroupe) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$idetu, $nom, $prenom, $numcarteetu, $idfiliere, $idclasse, $idsection, $idgroupe]);
        
        echo json_encode(['success' => true, 'message' => 'Étudiant ajouté avec succès', 'id' => $pdo->lastInsertId()]);
        
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'ajout: ' . $e->getMessage()]);
    }
}

function updateStudent() {
    global $pdo;
    
    $id = trim($_POST['id'] ?? '');
    $idetu = trim($_POST['idetu'] ?? '');
    $nom = trim($_POST['nom'] ?? '');
    $prenom = trim($_POST['prenom'] ?? '');
    $numcarteetu = trim($_POST['numcarteetu'] ?? '');
    $idfiliere = trim($_POST['idfiliere'] ?? '');
    $idclasse = trim($_POST['idclasse'] ?? '');
    $idsection = trim($_POST['idsection'] ?? '');
    $idgroupe = trim($_POST['idgroupe'] ?? '');
    
    if (empty($id) || empty($idetu) || empty($nom) || empty($prenom) || empty($numcarteetu) || 
        empty($idfiliere) || empty($idclasse) || empty($idsection) || empty($idgroupe)) {
        echo json_encode(['success' => false, 'message' => 'Tous les champs sont requis']);
        return;
    }
    
    try {
        // Vérifier que l'étudiant avec cet ID ou numéro carte n'existe pas déjà (sauf l'étudiant actuel)
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM etudiant WHERE (idetu = ? OR numcarteetu = ?) AND id != ?");
        $stmt->execute([$idetu, $numcarteetu, $id]);
        if ($stmt->fetchColumn() > 0) {
            echo json_encode(['success' => false, 'message' => 'Un autre étudiant a déjà cet ID ou ce numéro de carte']);
            return;
        }
        
        // Mettre à jour l'étudiant
        $stmt = $pdo->prepare("UPDATE etudiant SET idetu = ?, nom = ?, prenom = ?, numcarteetu = ?, idfiliere = ?, idclasse = ?, idsection = ?, idgroupe = ? WHERE id = ?");
        $result = $stmt->execute([$idetu, $nom, $prenom, $numcarteetu, $idfiliere, $idclasse, $idsection, $idgroupe, $id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Étudiant modifié avec succès']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Aucune modification effectuée ou étudiant non trouvé']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la modification: ' . $e->getMessage()]);
    }
}

function deleteStudent() {
    global $pdo;
    
    $id = $_POST['id'] ?? '';
    
    if (empty($id)) {
        echo json_encode(['success' => false, 'message' => 'ID requis']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT nom, prenom FROM etudiant WHERE id = ?");
        $stmt->execute([$id]);
        $student = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$student) {
            echo json_encode(['success' => false, 'message' => 'Étudiant non trouvé']);
            return;
        }
        
        $stmt = $pdo->prepare("DELETE FROM etudiant WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Étudiant ' . $student['nom'] . ' ' . $student['prenom'] . ' supprimé avec succès']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression: ' . $e->getMessage()]);
    }
}
?>