function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

async function getWeatherData(city) {
  const url = `http://ems-syp.000webhostapp.com/api/weather.php?city=Linz`;
  const response = await fetch(url);
  const data = await response.json();
  const weatherData = data.forecast.forecastday;
  //console.log(weatherData);
  
  for(let i = 0; i < weatherData.length; i++){
          string = "";
          let forecast = weatherData[i];
          string += "<div style='background-color: darkgrey; border-radius: 3%; padding: 1%; margin-top: 1%;'><h3>"+formatDate(forecast.date)+"</h3>";
          string += "<p>"+forecast.day.condition.text+"</p>";
          string += "<p>"+Math.round(forecast.day.avgtemp_c)+"°C</p>";
          string += "<p>"+Math.round(forecast.day.daily_chance_of_rain)+"% Regen | "+Math.round(forecast.day.avghumidity)+"% Luftfeuchtigkeit</p></div>";
          document.getElementById('weatherForecast').innerHTML += string;
  }
}