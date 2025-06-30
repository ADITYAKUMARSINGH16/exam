<?php
$host = 'localhost';
$db = 'notes_exam';
$user = 'root'; // Default XAMPP MySQL user
$pass = ''; // Default XAMPP MySQL password (empty)

try {
    $conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Log the error to a file for debugging
    file_put_contents('php_errors.log', "Connection failed: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $e->getMessage()]);
    exit;
}
?>