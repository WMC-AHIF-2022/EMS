<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$servername = "localhost:3307";
$username = "h577871_emsadmindb";
$password = "c7rP9LkqM9tLglgl";
$dbname = "h577871_data";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT * FROM data ORDER BY timestamp ASC;";
$result = mysqli_query($conn, $sql);

$data = array();
if (mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }
}

mysqli_close($conn);
echo json_encode($data);
?>