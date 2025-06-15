<?php
// Database connection setup
$servername = "localhost";  // or "127.0.0.1"
$username = "root";
$password = "";
$dbname = "final";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Collect form data
$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];
$confirmPassword = $_POST['confirmPassword'];

// Check password match
if ($password !== $confirmPassword) {
    die("Passwords do not match.");
}

// OPTIONAL: Hash password before storing (recommended!)
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert data into users table
$sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $name, $email, $hashedPassword);

if ($stmt->execute()) {
    echo "Registration successful!";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
