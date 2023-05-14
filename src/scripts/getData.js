var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
async function getDataFromAPI() {
    try {
        const response = await fetch('https://ems-syp.000webhostapp.com/api/');
        const data = await response.json();
        console.log(data);

        let dataArray = Array.isArray(data) ? data : [data];

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
            generation += data.value;
        }
        else if (data.type === 'consumption') {
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield getDataFromAPI(); // Aufruf der Funktion
    });
}
main();
//# sourceMappingURL=getData.js.map