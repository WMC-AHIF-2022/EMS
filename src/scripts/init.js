async function init(){
    let settings = await getSettings();
    getWeatherData(settings[3].value)
}