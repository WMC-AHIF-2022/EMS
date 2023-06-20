function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function formatString(string) {
    string = string.toLowerCase();
    var words = string.split(" ");

    for (var i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }

    var formattedString = words.join(" ");
    return formattedString;
}

async function getWeatherData(city) {
    console.log("Weather loading...");
    const url = "https://tauwisbackup.de/EMS/api/weather.php?city="+city;
    const response = await fetch(url);
    const data = await response.json();
    const weatherData = data.forecast.forecastday;
    //console.log(weatherData);
    document.getElementById('weatherForecast').innerHTML = '<h5 style="color: white;">Wetterbericht <b>'+formatString(city)+'</b></h5>';

    for(let i = 0; i < weatherData.length; i++){
        string = "";
        let forecast = weatherData[i];
        string += "<div style='background-color: darkgrey; border-radius: 3%; padding: 3%; margin-top: 1%;'><h5>"+formatDate(forecast.date)+"</h5>";
        string += '<img src="'+forecast.day.condition.icon+'" style="margin-left: 68%; margin-top: -20%; display: inline;"/>';
        string += "<p>"+forecast.day.condition.text+"<br>";
        string += Math.round(forecast.day.avgtemp_c)+"°C<br>";
        string += Math.round(forecast.day.daily_chance_of_rain)+"% Regen | "+Math.round(forecast.day.avghumidity)+"% Luftfeuchtigkeit</p></div>";
        document.getElementById('weatherForecast').innerHTML += string;
    }
    console.log("Weather loaded!");
}