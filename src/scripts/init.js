async function init(){
    console.log("Init started...");
    console.log("Loading settings!");
    let settings = await getSettings();
    console.log("Loaded settings!");
    await getWeatherData(settings[3].value);
    //console.log("Loading data!");
    getDataFromAPI().then(function(dataResult) {
        //console.log(dataResult);
        var Data = [];
        var labels = [];
        try{
            for (var i = 0; i < dataResult.length; i++) {
                var obj = dataResult[i];
                Data.push(obj);
                labels.push(obj.timestamp);
            }
        } catch (error) {
            console.error('Fehler beim Initialisieren des Diagramms:', error);
        }

        //console.log("Data:", Data);
        //console.log("Labels:", labels);
        //document.getElementById('daily').checked = true;
        //const year = new Date().getFullYear();
        //document.getElementById('currRange').innerHTML = "01.01."+year;
        //drawDiagram();
        console.log("Init finished!");
    });
}