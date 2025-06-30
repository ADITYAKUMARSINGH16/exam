<?php
session_start();
header('Content-Type: application/json');

include 'db.php';

if (isset($_SESSION['user_id'])) {
    try {
        $stmt = $conn->prepare("SELECT username FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user && !empty($user['username'])) {
            echo json_encode(['status' => 'success', 'username' => $user['username']]);
        } else {
            file_put_contents('php_errors.log', "User not found or username empty for ID: " . $_SESSION['user_id'] . "\n", FILE_APPEND);
            echo json_encode(['status' => 'error', 'message' => 'User not found or username empty']);
        }
    } catch (PDOException $e) {
        file_put_contents('php_errors.log', "Get user info error: " . $e->getMessage() . "\n", FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    file_put_contents('php_errors.log', "No user_id in session\n", FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
}
?>