async function getDataFromAPI() {
    try {
        const response = await fetch('https://ems-syp.000webhostapp.com/api/index.php');
        const data = await response.json();
        console.log("Scheiß ausgabe:", data);

        let dataArray = Array.isArray(data) ? data : [data];

        for (let i = 0; i < dataArray.length; i++) {
            const convertedDate = new Date(convertDateTime(dataArray[i].timestamp));
            if (!isNaN(convertedDate.getTime())) {
                dataArray[i].time = convertedDate;
            } else {
                dataArray[i].time = new Date(0);
            }
        }

        return dataArray;
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}
function convertDateTime(inputDateTime) {
    //console.log(inputDateTime);
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