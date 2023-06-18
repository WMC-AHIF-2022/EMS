const consumptionCheckbox = document.getElementById("consumption");
const generationCheckbox = document.getElementById("generation");
const balanceCheckbox = document.getElementById("balance");
const priceCheckbox = document.getElementById("price");
const currRange = document.getElementById("currRange");
const chartSettingsContainer = document.getElementById("chartSettingsContainer");
const year = new Date().getFullYear();
let dailyLabels = [];
let currentChart = undefined;
for (let i = 1; i <= 31; i++) {
    dailyLabels.push(i);
}
const HourLabels = Array.from({
    length: 24
}, (_, i) => (i + 1).toString());
console.log(HourLabels);
const monthLabels = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
let selectedInterval = document.querySelector('input[name="interval"]:checked');
const intervalInputs = document.querySelectorAll('input[name="interval"]');

function changeDate(dateStr, delta) {
    const date = new Date(dateStr.split(".").reverse().join("-"));
    date.setDate(date.getDate() + delta);
    currRange.innerHTML = `${("0" + date.getDate()).slice(-2)}.${("0" + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`;
    //return `${date.getDate()}.${("0" + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`;
}
function changeEuDateToUSDate(datum) {
    console.log(datum);
    const parts = datum.split(".");
    console.log(parts);
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
}

function getDaysInMonth(month) {
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonths[month];
}
function change(action) {
    const currRangeEl = document.getElementById("currRange");
    const currRangeValue = currRangeEl.innerHTML;
    //console.log(currRangeValue);

    const intervalFns = {
        daily: () => changeDate(currRangeValue, action === "prev" ? -1 : 1),
        monthly: () => {
            const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
            let index = months.indexOf(currRangeValue);
            index = (index + (action === "prev" ? -1 : 1) + 12) % 12;
            currRangeEl.innerHTML = months[index];
            dailyLabels = Array.from({ length: getDaysInMonth(index) }, (_, i) => i + 1);
        },
        yearly: () => {
            let range = parseInt(currRangeValue);
            const currentYear = new Date().getFullYear();
            range = range + (action === "prev" ? -1 : 1);
            range = Math.max(2020, Math.min(currentYear, range));
            currRangeEl.innerHTML = range;
        }
    };

    selectedInterval = document.querySelector('input[name="interval"]:checked');
    const selectedIntervalFn = intervalFns[selectedInterval.value];
    //console.log(selectedInterval.value)
    //console.log(selectedIntervalFn);
    if (selectedIntervalFn) {
        selectedIntervalFn();
        drawDiagram();
    }
}
// Helper function to handle checkbox changes
function handleCheckboxChange(checkbox, otherCheckboxes) {
    if (checkbox.checked) {
        otherCheckboxes.forEach(function(otherCheckbox) {
            otherCheckbox.checked = false;
        });
    }
    drawDiagram();
}
priceCheckbox.addEventListener("change", function() {
    handleCheckboxChange(priceCheckbox, [consumptionCheckbox, generationCheckbox, balanceCheckbox]);
});

consumptionCheckbox.addEventListener("change", function() {
    handleCheckboxChange(consumptionCheckbox, [priceCheckbox]);
});

generationCheckbox.addEventListener("change", function() {
    handleCheckboxChange(generationCheckbox, [priceCheckbox]);
});

balanceCheckbox.addEventListener("change", function() {
    handleCheckboxChange(balanceCheckbox, [priceCheckbox]);
});

// Attach change event listener to interval inputs
intervalInputs.forEach(input => {
    input.addEventListener('change', function(event) {
        const selectedIntervalTwo = event.target.value;
        selectedInterval = selectedIntervalTwo;

        if (selectedIntervalTwo === "monthly") {
            currRange.innerHTML = "Januar";
        } else if (selectedIntervalTwo === "yearly") {
            currRange.innerHTML = year;
        } else {
            currRange.innerHTML = `01.01.${year}`;
        }
        drawDiagram();
    });
});
// function removeElementFromArray(array, index) {
//     const newArray = [...array.slice(0, index), ...array.slice(index + 1)];
//     return newArray;
function findLine(checkboxes, currentLabel) {
    for (let i = 0; i < checkboxes.length;i++){
        if(currentLabel === checkboxes[i].label){
            return checkboxes[i];
        }
    }
    return undefined;
}
// }
async function drawDiagram() {
    let dataArray = await getDataFromAPI();
    let dataToSplit = [];
    let data = [];
    let currentLabel = [];
    let stepOut = false;
    let demodata = [0,0,0,0,0,0,0,0,0,0];
    const checkbox = [
        {name: 'consumption',label: 'consumption', data:data, backgroundColor:'#ffffff', borderColor: '#ffcd56' },
        {name: 'generation',label: 'generation', data:data, backgroundColor: '#36a2eb', borderColor: '#36a2eb' },
        {name: 'balance',label: 'balance', data:data,  backgroundColor: '#4bc0c0', borderColor: '#4bc0c0' },
        {name: 'price',label:'price', data: data,  backgroundColor: '#ffcd56', borderColor: '#ffcd56' }
    ]
    let currChart = drawChart(demodata, HourLabels.slice(), checkbox, currentChart);
    // console.log(intervalInputs);
    // console.log(selectedInterval);

    if(consumptionCheckbox.checked){
        if(selectedInterval === 'daily'){
            for (let i = 0; i < dataArray.length -1;i++){
                let split = dataArray[i].timestamp.split(" ");
                console.log(currRange.innerHTML);
                if(split[0] === changeEuDateToUSDate(currRange.innerHTML)){
                    dataToSplit.push(dataArray[i]);
                }
                 //console.log(`DataToSplit: ${JSON.stringify(dataToSplit)}`);
                //console.log(`Measurement: ${JSON.stringify(dataToSplit[50])}`);
            }
            for (let x = 1; x < dataToSplit.length && !stepOut;x++){
                let consumption = 0;
                let generation = 0;
                let measurement = 0;
                // console.log(`lol ${JSON.stringify(dataToSplit[x])}`);
                if(dataToSplit[x].type === 'consumption'){
                    consumption += dataToSplit[x].measurement;
                }
                else {
                    generation +=  dataToSplit[x].measurement;
                }
                if(x % 4 === 0){
                    measurement = generation - consumption;
                    data.push(measurement);
                    measurement = 0;
                    generation = 0;
                    consumption = 0;
                }
                if(measurement.length === 24){
                    stepOut = true;
                }
            }
            currentLabel = HourLabels.slice();
            console.log(currentLabel);
        }
        else if(selectedInterval === 'monthly'){
            for (let i = 0; i < dataArray.length -1;i++){
                let split = dataArray[i].timestamp.split(" ");
                dataToSplit.push(dataArray[i]);
                for (let x = 1; x < dataToSplit.length && !stepOut;x++){
                    let consumption = 0;
                    let generation = 0;
                    let measurement = 0;
                    // console.log(`lol ${JSON.stringify(dataToSplit[x])}`);
                    if(dataToSplit[x].type === 'consumption'){
                        consumption += dataToSplit[x].measurement;
                    }
                    else {
                        generation +=  dataToSplit[x].measurement;
                    }
                    if(x % 95 === 0){
                        measurement = generation - consumption;
                        data.push(measurement);
                        measurement = 0;
                        generation = 0;
                        consumption = 0;
                    }
                    if(measurement.length === getDaysInMonth(dailyLabels)){
                        stepOut = true;
                    }
                }
                //console.log(`DataToSplit: ${JSON.stringify(dataToSplit)}`);
                //console.log(`Measurement: ${JSON.stringify(dataToSplit[50])}`);
            }
            // for (let i = 0; i < dataArray.length;i++){
            //     let split = dataArray[i].timestamp.split(" ");
            //     let splitted = split[0].split("-");
            //     let changedUsDate = changeEuDateToUSDate(currRange.innerHTML);
            //     let splitChangeUsDate = changedUsDate.split("-");
            //     if(splitted[1] === splitChangeUsDate[1]){
            //         dataToSplit.push(dataArray[i]);
            //     }
            //     console.log(`lol ${JSON.stringify(dataToSplit)}`);
            // }
            currentLabel.push(dailyLabels);
            console.log(dailyLabels);
        }
    }
    // console.log(dataToSplit);
    // console.log(currentLabel);
    // console.log(`real Data: ${data}`);
    // console.log(HourLabels);
    chartSettingsContainer.display = "block";
    const drawLine = findLine(checkbox, currentLabel);
    currentChart = drawChart(data,currentLabel, checkbox, currChart);
}