<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
// Datenbankverbindungsinformationen
$servername = "localhost:3307";
$username = "h577871_emsadmindb";
$password = "c7rP9LkqM9tLglgl";
$dbname = "h577871_data";

// Verbindung zur Datenbank herstellen
$conn = new mysqli($servername, $username, $password, $dbname);

// Überprüfen, ob die Verbindung zur Datenbank erfolgreich war
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

// Überprüfen, ob POST-Daten gesendet wurden
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Messung und Typ aus GET-Daten abrufen
    $unitOfElectricity = $_GET["unitOfElectricity"];
    $currency = $_GET["currency"];
    $defaultStats = $_GET["defaultStats"];
    $homeCity = $_GET["homeCity"];
    $pricePerKwh = $_GET["pricePerKwh"];

    // SQL-Abfrage zum Einfügen der Messung in die Datenbank vorbereiten
    $sql = "UPDATE settings SET value = CASE
       WHEN setting = 'unitOfElectricity' THEN ?
       WHEN setting = 'currency' THEN ?
       WHEN setting = 'pricePerKwh' THEN ?
       WHEN setting = 'defaultStats' THEN ?
       WHEN setting = 'homeCity' THEN ?
    END
    WHERE setting IN ('unitOfElectricity', 'currency', 'pricePerKwh', 'defaultStats', 'homeCity');";

    // SQL-Abfrage vorbereiten und binden der Parameter
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $unitOfElectricity, $currency, $pricePerKwh, $defaultStats, $homeCity);

    // Ausführen der SQL-Abfrage
    if ($stmt->execute() === TRUE) {
        echo "200";
    } else {
        header("HTTP/1.1 500 Internal Server Error");
        echo "500";
    }

    // Schließen der SQL-Abfrage und Datenbankverbindung
    $stmt->close();
    $conn->close();
}else{
    header("HTTP/1.1 400 Bad Request");
    echo "400";
}
?>