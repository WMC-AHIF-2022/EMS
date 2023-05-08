async function init(){
    let settings = await getSettings();
    getWeatherData(settings[3].value)
    drawChart([10, 20, 30, 40, 50], ["Jan", "Feb", "Mar", "Apr", "May"]);
}