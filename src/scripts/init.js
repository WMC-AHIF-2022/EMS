async function init(){
    let settings = await getSettings();
    getWeatherData(settings[3].value);
    let demodata = [0,0,0,0,0,0,0,0,0,0];
    //drawChart(demodata, demodata);
    //document.getElementById("loadingChart").style.display = "none"; //Loading Circle
    // drawChart()
    getDataFromAPI().then(function(dataResult) {
        console.log(dataResult);
        var Data = [];
        var labels = [];

        for (var i = 0; i < dataResult.length; i++) {
            var obj = dataResult[i];
            Data.push(obj);
            labels.push(obj.timestamp);
        }

        console.log("Data:", Data);
        console.log("Labels:", labels);
        // drawChart(Data, labels);
    });
    // Date date = new Date();
    // let currentMonth = date.getMonth() + 1;
    // drawChart();
}