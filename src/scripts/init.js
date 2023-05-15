async function init(){
    let settings = await getSettings();
    getWeatherData(settings[3].value);
    let demodata = [0,0,0,0,0,0,0,0,0,0];
    drawChart(demodata, demodata);
    // drawChart()
    // let data = getDataFromAPI();
    // Date date = new Date();
    // let currentMonth = date.getMonth() + 1;
    // drawChart();
}