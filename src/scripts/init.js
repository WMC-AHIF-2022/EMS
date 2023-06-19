async function init(){
    let settings = await getSettings();
    await getWeatherData(settings[3].value);
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
    });
}