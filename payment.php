<?php
require_once 'connect.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo "Please login first";
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    $amount = mysqli_real_escape_string($conn, $_POST['amount']);
    $payment_method = mysqli_real_escape_string($conn, $_POST['payment_method']);

    $sql = "INSERT INTO payments (user_id, amount, payment_method) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ids", $user_id, $amount, $payment_method);

    if ($stmt->execute()) {
        echo "Payment successful";
    } else {
        echo "Error: " . $stmt->error;
    }
    $stmt->close();
}
$conn->close();
?>
