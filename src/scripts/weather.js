async function getWeatherForecast(city) {
    const url = 'https://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=10&appid=01752eb5ff2b67aac8cfaf76717a7954';
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.length > 0) {
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        //console.log('Latitude:', latitude, 'Longitude:', longitude);
        getWeatherForecastFromAPI(latitude, longitude);
      } else {
        console.log('Keine Ergebnisse gefunden.');
      }
    } catch (error) {
      console.log('Fehler beim Abrufen der Daten:', error);
    }
  }
  
  function estimateSolarPanelEfficiency(cloudinessPercentage, dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const hour = dateTime.getHours();
    const month = dateTime.getMonth() + 1;
    
    if (cloudinessPercentage >= 85 || hour < 7 || hour >= 19) {
      return "PV-Effizienz: Sehr niedrig";
    } else if (cloudinessPercentage >= 60 || month < 3 || month >= 11) {
      return "PV-Effizienz: Niedrig";
    } else if (cloudinessPercentage >= 30) {
      return "PV-Effizienz: Mittel";
    } else if (cloudinessPercentage >= 15) {
      return "PV-Effizienz: Hoch";
    } else {
      return "PV-Effizienz: Sehr hoch";
    }
  }
  
  function formatDate(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
  
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
  
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
  
  async function getWeatherForecastFromAPI(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=01752eb5ff2b67aac8cfaf76717a7954&lang=de&units=metric`;
    //console.log(url);
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      //console.log(data);
      let string = "";
      document.getElementById('weatherForecast').innerHTML = "<h3>Wettervorhersage</h3>";
      for(let i = 0; i < data.list.length; i++){
          string = "";
          let forecast = data.list[i];
          string += "<h3>"+formatDate(forecast.dt)+"</h3>";
          string += "<p>"+forecast.weather[0].description+"</p>";
          string += "<p>"+Math.round(forecast.main.temp)+"°C</p>";
          string += "<p>"+forecast.clouds.all+"% bewölkt</p>";
          string += "<p>"+estimateSolarPanelEfficiency(forecast.clouds.all, formatDate(forecast.dt))+"</p>";
          document.getElementById('weatherForecast').innerHTML += string;
      }
    } catch (error) {
      console.log('Fehler beim Abrufen der Daten:', error);
    }
  }