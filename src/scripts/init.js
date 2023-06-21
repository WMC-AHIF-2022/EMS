async function init(){
    console.log("Init started...");
    console.log("Loading settings!");
    let settings = await getSettings();
    console.log("Loaded settings!");
    await getWeatherData(settings[3].value);
    getDataFromAPI().then(function(dataResult) {
        let Data = [];
        let labels = [];
        try{
            for (let i = 0; i < dataResult.length; i++) {
                let obj = dataResult[i];
                Data.push(obj);
                labels.push(obj.timestamp);
            }
        } catch (error) {
            console.error('Fehler beim Initialisieren des Diagramms:', error);
        }
        console.log("Init finished!");
    });
}