function calcLoadingPercentage(totalAmount, partialAmount) {
  return (partialAmount / totalAmount) * 100;
}

async function getDataFromAPI() {
    console.log("Fetching Data...");
    try {
        
        const response = await fetch('https://tauwisbackup.de/EMS/api/index.php');
        const data = await response.json();
        console.log("Daten:", data);
        let dataArray = Array.isArray(data) ? data : [data];
        
        let loadingCount = 0;
        for (let i = 0; i < dataArray.length; i++) {
            //console.log("Loading Dataset: "+i+"/"+(dataArray.length-1));
            if(loadingCount = 500){
                let loadingPercentage = Math.round(calcLoadingPercentage(dataArray.length, i))+"%";
                console.log(loadingPercentage);
                //document.getElementById("loadingVal").innerHTML = loadingPercentage;
                loadingCount = 0;
            }
            loadingCount++;
            const convertedDate = new Date(convertDateTime(dataArray[i].timestamp));
            if (!isNaN(convertedDate.getTime())) {
                dataArray[i].time = convertedDate;
            } else {
                dataArray[i].time = new Date(0);
            }
        }

        console.log("Data fetched!");
        return dataArray;
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}
function convertDateTime(inputDateTime) {
    const dateParts = inputDateTime.split(" ")[0].split("-");
    const timeParts = inputDateTime.split(" ")[1].split(":");
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];
    const hours = timeParts[0];
    const minutes = timeParts[1];
    const seconds = timeParts[2];
    const convertedDateTime = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    return convertedDateTime;
}