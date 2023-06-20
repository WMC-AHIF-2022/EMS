<?php
// Datenbankverbindungsinformationen
$servername = "localhost:3307";
$username = "h577871_emsadmindb";
$password = "c7rP9LkqM9tLglgl";
$dbname = "h577871_data";

// Verbindung zur Datenbank herstellen
$conn = new mysqli($servername, $username, $password, $dbname);

// Überprüfen, ob die Verbindung zur Datenbank erfolgreich war
if ($conn->connect_error) {
    header("HTTP/1.1 500 Internal Server Error");
    echo "500";
    exit();
}

function getUserAgentInfo() {
    $userAgent = $_SERVER['HTTP_USER_AGENT'];

    // Browser-Datenbank (kann erweitert werden)
    $browsers = array(
        'Edge' => 'Microsoft Edge',
        'Edg' => 'Microsoft Edge (Chromium)',
        'Firefox' => 'Mozilla Firefox',
        'Chrome' => 'Google Chrome',
        'Safari' => 'Apple Safari',
        'Opera' => 'Opera',
        'OPR' => 'Opera',
        'Trident' => 'Microsoft Internet Explorer',
        'MSIE' => 'Microsoft Internet Explorer',
    );

    // Plattform-Datenbank (kann erweitert werden)
    $platforms = array(
        'Windows NT 10.0' => 'Windows 10',
        'Windows NT 6.3' => 'Windows 8.1',
        'Windows NT 6.2' => 'Windows 8',
        'Windows NT 6.1' => 'Windows 7',
        'Windows NT 6.0' => 'Windows Vista',
        'Windows NT 5.1' => 'Windows XP',
        'Windows NT 5.0' => 'Windows 2000',
        'Mac' => 'Macintosh',
        'Linux' => 'Linux',
        'Android' => 'Android',
        'iOS' => 'iOS',
    );

    // Browser identifizieren
    $browser = 'Unknown Browser';
    foreach ($browsers as $key => $value) {
        if (stripos($userAgent, $key) !== false) {
            $browser = $value;
            break;
        }
    }

    // Plattform identifizieren
    $platform = 'Unknown Platform';
    foreach ($platforms as $key => $value) {
        if (stripos($userAgent, $key) !== false) {
            $platform = $value;
            break;
        }
    }

    $userAgentString = "$browser on $platform";
    if($platform == "Unknown Platform" || $browser == "Unknown Browser"){
        $userAgentString = $userAgent;
    }

    return $userAgentString;
}

// Überprüfen, ob POST-Daten gesendet wurden
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Messung und Typ aus POST-Daten abrufen
    $contentType = $_SERVER["CONTENT_TYPE"];
    if($contentType != "application/x-www-form-urlencoded"){
        header("HTTP/1.1 400 Bad Request");
        echo '400 - Wrong Content Type, please use "application/x-www-form-urlencoded"';
        exit();
    }
    if (isset($_POST["type"]) && $_POST["type"] == "teapot"){
        header("HTTP/1.1 418 I am a Teapot");
        echo '418 - Hello Fellow, I am a teapot!<br>See this for more:<br><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418">Docs HTML 418</a>';
        exit();
    }
    if (isset($_POST["type"]) && $_POST["type"] == "418"){
        header("HTTP/1.1 418 I am a Teapot");
        echo '418 - Hello Fellow, I am a teapot!<br>See this for more:<br><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418">Docs HTML 418</a>';
        exit();
    }
    if (!isset($_POST['type']) || empty($_POST['type'])){
        header("HTTP/1.1 400 Bad Request");
        echo '400 - POST "type" is not set';
        exit();
    }
    if (!isset($_POST['measurement']) || empty($_POST['measurement'])){
        header("HTTP/1.1 400 Bad Request");
        echo '400 - POST "measurement" is not set';
        exit();
    }
    
    $measurement = $_POST["measurement"];
    $type = $_POST["type"];
    
    date_default_timezone_set('Europe/Vienna');
    $current_timestamp = time();
    $timestamp = date('Y-m-d H:i:s', $current_timestamp);

    // SQL-Abfrage zum Einfügen der Messung in die Datenbank vorbereiten
    $sql = "INSERT INTO data (measurement, type, client, timestamp) VALUES (?, ?, ?, ?)";

    $caller = getUserAgentInfo();
    // SQL-Abfrage vorbereiten und binden der Parameter
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $measurement, $type, $caller, $timestamp);

    // Ausführen der SQL-Abfrage
    if ($stmt->execute() === TRUE) {
        echo "200 - OK";
    } else {
        header("HTTP/1.1 500 Internal Server Error");
        echo "500 - Internal Server Error";
        exit();
    }

    // Schließen der SQL-Abfrage und Datenbankverbindung
    $stmt->close();
    $conn->close();
} else {
    header("HTTP/1.1 400 Bad Request");
    echo '400 - Not a POST-Request';
    exit();
}
?>