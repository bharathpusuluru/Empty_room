<?php
header('Content-Type: application/json');

// Database credentials
$host = "localhost";
$username = "root";
$password = "";
$dbname = "class_data_test";

// Connect to the database
$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$fromTime = $_GET['fromTime'];
$uptoTime = $_GET['uptoTime'];
$day = $_GET['day'];
$floor_no = $_GET['floor_no'];

// Create your SQL query to fetch rooms not assigned during specific time range on a specific day
$sql = "
WITH Hours AS (
    SELECT 8 AS hour UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL 
    SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL 
    SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL 
    SELECT 17
)
SELECT r.Room_Number, h.hour AS start_time
FROM Hours h
CROSS JOIN (SELECT DISTINCT Room_Number FROM {$floor_no}) r
LEFT JOIN {$floor_no} sf 
    ON sf.Room_Number = r.Room_Number 
    AND sf.start_time = h.hour 
    AND sf.weekday = ?
WHERE sf.Room_Number IS NULL AND h.hour >= ? AND h.hour < ?
ORDER BY r.Room_Number, h.hour;
";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    die("SQL Error: " . $conn->error);
}
$stmt->bind_param("sii", $day, $fromTime, $uptoTime);

$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($data);

$stmt->close();
$conn->close();
?>
