async function getDataFromAPI() {
    try {
        const response = await fetch('https://ems-syp.000webhostapp.com/api/');
        const data = await response.json();
        let dataArray = Array.isArray(data) ? data : [data];
        console.log(dataArray);
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i].time) {
                const convertedDate = new Date(convertDateTime(dataArray[i].time));
                if (!isNaN(convertedDate.getTime())) {
                    dataArray[i].time = convertedDate;
                } else {
                    dataArray[i].time = new Date(0);
                }
            }
        }
        dataArray = processJSON(dataArray);
        let genArray = [];
        let conArray = [];
        for(let i = 0; i < dataArray.length; i++){
            console.log(dataArray[i]);
            if(dataArray[i].type === 'generation'){
                genArray.push(dataArray[i].measurement);
            }else if(dataArray[i].type === 'consumption'){
                conArray.push(dataArray[i].measurement);
            }
        }
        console.log("Generated: ", genArray);
        console.log("Consumed: ", conArray);
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}

function processJSON(jsonArray) {
    const sortedArray = jsonArray.sort((a, b) => {
        const aDate = new Date(a.time);
        const bDate = new Date(b.time);
        return aDate.getTime() - bDate.getTime();
    });

    let generation = 0;
    let consumption = 0;

    const resultArray = sortedArray.map((data) => {
        if (data.type === 'generation') {
            generation += data.measurement;
        } else if (data.type === 'consumption') {
            consumption += data.measurement;
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
    await getDataFromAPI();
}

main();