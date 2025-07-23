<?php
// Start session
session_start();

// Set headers for JSON response
header('Content-Type: application/json');

// Database connection
$conn = new mysqli('localhost', 'root', 'root', 'dbpfe');

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get username and password from POST data
    $username = $conn->real_escape_string($_POST['username']);
    $password = $_POST['password'];
    
    // Query to find user with this username
    $sql = "SELECT a.account_id, a.username, a.password, a.account_type_id, t.type_name 
            FROM accounts a
            JOIN account_types t ON a.account_type_id = t.type_id
            WHERE a.username = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // Verify password
        if (password_verify($password, $user['password'])) {
            // Update last login timestamp
            $updateSql = "UPDATE accounts SET last_login = NOW() WHERE account_id = ?";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bind_param('i', $user['account_id']);
            $updateStmt->execute();
            
            // Set session variables
            $_SESSION['user_id'] = $user['account_id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['account_type'] = $user['type_name'];
            
            // Determine redirect URL based on account type
            $redirectUrl = '';
            switch ($user['account_type_id']) {
                case 1:
                    $redirectUrl = '../dashboards/admindash.html';
                    break;
                case 2:
                    $redirectUrl = '../dashboards/tier1dash.html';
                    break;
                case 3:
                    $redirectUrl = '../dashboards/tier2dash.html';
                    break;
                case 4:
                    $redirectUrl = '../dashboards/tier3dash.html';
                    break;
                default:
                    $redirectUrl = '../login/login.html';
            }
            
            echo json_encode([
                'success' => true, 
                'message' => 'Login successful', 
                'redirect' => $redirectUrl
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    }
    
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>