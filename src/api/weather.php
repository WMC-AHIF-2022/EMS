<?php
header("Access-Control-Allow-Origin: *");

function urlEncodeSpaces($string) {
    return str_replace(' ', '%20', $string);
}

function getWeatherData($city) {
  $urlCity = urlEncodeSpaces($city);
  $url = "https://api.weatherapi.com/v1/forecast.json?key=d8da82e78334423ab3e144036231505&q=Linz&days=3&aqi=no&alerts=no&lang=de";
  //$url = "https://api.weatherapi.com/v1/forecast.json?key=$apiKey&q=$city&days=6&aqi=no&lang=de";
  $context = stream_context_create(array(
    'ssl' => array(
      'verify_peer' => false,
      'verify_peer_name' => false,
    ),
  ));
  $response = file_get_contents($url, false, $context);
  return $response;
}

if (isset($_GET['city'])) {
  $city = $_GET['city'];
  $weatherData = getWeatherData($city);
  echo $weatherData;
}else{
    header("HTTP/1.1 400 Bad Request");
    echo "400";
}
?>