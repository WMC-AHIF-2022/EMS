function getCurrentDate() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1; // Monate im Date-Objekt sind nullbasiert, daher +1
    var year = date.getFullYear();

    // Führende Nullen hinzufügen, falls Tag oder Monat einstellig sind
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    var formattedDate = day + '.' + month + '.' + year;
    return formattedDate;
}

async function init(){
    let settings = await getSettings();
    getWeatherData(settings[3].value);
    document.getElementById('currRange').innerHTML = getCurrentDate(); //Um das aktuelle Datum statt dem 01.01 anzuzeigen im Auswahlmenü des Charts
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