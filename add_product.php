<?php
include 'connect.php';

$name = $_POST['name'];
$description = $_POST['description'];
$price = $_POST['price'];
$image = $_POST['image']; // For simplicity; in practice use file upload

$sql = "INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssds", $name, $description, $price, $image);

if ($stmt->execute()) {
    echo "Product added successfully";
} else {
    echo "Error: " . $stmt->error;
}
?>
