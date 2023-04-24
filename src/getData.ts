async function getDataFromAPI(): Promise<any> {
    try {
        const response = await fetch('https://ems-syp.000webhostapp.com/api/');
        //console.log(response);
        const data = await response.json();
        console.log(data);
        let dataArray = Array.isArray(data) ? data : [data];
        //console.log(dataArray);
        for (let i = 0; i < dataArray.length; i++) {
            const convertedDate = new Date(convertDateTime(dataArray[i].timestamp));
            if (!isNaN(convertedDate.getTime())) {
                dataArray[i].time = convertedDate;
            } else {
                dataArray[i].time = new Date(0);
            }
        }
        dataArray = processJSON(dataArray);
        return dataArray;
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

function calculateNetUsage(data) {
    let generated = 0;
    let consumed = 0;

    for (let i = 0; i < data.length; i++) {
        if (data[i].type === "generation") {
            generated += parseInt(data[i].measurement);
        } else if (data[i].type === "consumption") {
            consumed += parseInt(data[i].measurement);
        }
    }

    const net = generated - consumed;

    return {
        generated,
        consumed,
        net
    };
}

async function main() {
    const data = await getDataFromAPI(); // Aufruf der Funktion
	const dataCalc = calculateNetUsage(data);
	console.log(dataCalc);
}

main();