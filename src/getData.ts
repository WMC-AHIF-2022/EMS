async function getDataFromAPI(): Promise<void> {
    try {
        const response = await fetch('https://ems-syp.000webhostapp.com/api/');
        //console.log(response);
        const data = await response.json();
        //console.log(data);
        let dataArray = Array.isArray(data) ? data : [data];
        console.log(dataArray);
        for (let i = 0; i < dataArray.length; i++) {
            const convertedDate = new Date(convertDateTime(dataArray[i].time));
            if (!isNaN(convertedDate.getTime())) {
                dataArray[i].time = convertedDate;
            } else {
                dataArray[i].time = new Date(0);
            }
        }
        dataArray = processJSON(dataArray);
        //DEV AUSGABE
        let genArray = [];
        let conArray = [];
        for(let i = 0; i < dataArray.length; i++){
            console.log(dataArray[i]);
            if(dataArray[i].type === 'generation'){
                genArray.push(dataArray[i]);
            }else if(dataArray[i].type === 'consumption'){
                conArray.push(dataArray[i]);
            }
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}

function processJSON(jsonArray: any[]): any[] {
    const sortedArray = jsonArray.sort((a, b) => {
        const aDate = new Date(a.time);
        const bDate = new Date(b.time);
        return aDate.getTime() - bDate.getTime();
    });

    let generation = 0;
    let consumption = 0;

    const resultArray = sortedArray.map((data) => {
        if (data.type === 'generation') {
            generation += data.value;
        } else if (data.type === 'consumption') {
            consumption += data.value;
        }
        return data;
    });

    const net = generation - consumption;

    return resultArray.concat({ net });
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

async function main() {
    await getDataFromAPI(); // Aufruf der Funktion
}

main();