const consumptionCheckbox = document.getElementById("consumption");
const generationCheckbox = document.getElementById("generation");
const balanceCheckbox = document.getElementById("balance");
const priceCheckbox = document.getElementById("price");
const currRange = document.getElementById("currRange");
const chartSettingsContainer = document.getElementById("chartSettingsContainer");
const year = new Date().getFullYear();
let pricePerKw = document.getElementById('pricePerKwh');
let currentChart = undefined;
let dailyLabels = [];
const monthLabels = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
let selectedInterval = document.querySelector('input[name="interval"]:checked');
const intervalInputs = document.querySelectorAll('input[name="interval"]');
const day = 95;
if(pricePerKw === null){
    pricePerKw = 0.31;
}
const yearlyLabels = Array.from({
    length: 12
}, (_, i) => (i + 1).toString());

for (let i = 1; i <= 31; i++) {
    dailyLabels.push(i);
}
const HourLabels = Array.from({
    length: 24
}, (_, i) => (i + 1).toString());

function changeDate(dateStr, delta) {
    const date = new Date(dateStr.split(".").reverse().join("-"));
    date.setDate(date.getDate() + delta);
    currRange.innerHTML = `${("0" + date.getDate()).slice(-2)}.${("0" + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`;
}
function changeEuDateToUSDate(datum) {
    const parts = datum.split(".");
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
}

function getDaysInMonth(index) {
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonths[index];
}
function change(action) {
    const currRangeEl = document.getElementById("currRange");
    const currRangeValue = currRangeEl.innerHTML;

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
            currRangeEl.innerHTML = range.toString();
        }
    };

    selectedInterval = document.querySelector('input[name="interval"]:checked');
    const selectedIntervalFn = intervalFns[selectedInterval.value];
    console.log("sel Intervall", selectedInterval.value)

    if (selectedIntervalFn) {
        selectedIntervalFn();
        drawDiagram();
    }
}

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
function findRightData(data,consumption, generation, measurement) {
    let price = 0;
    if(consumptionCheckbox.checked){
        data.push(consumption);
    }
    else if(generationCheckbox.checked){
        data.push(generation);
    }
    else if(balanceCheckbox.checked){
        data.push(measurement);
    }
    else{
        price = Math.abs(measurement) * parseFloat(pricePerKw);
        data.push(price);
    }
}

function findDay() {
    let num;
    const splitDate = currRange.innerHTML.split(".");
    console.log(splitDate);
    if(parseInt(splitDate[0].substring(0,1)) === 0){
        num = parseInt(splitDate[0].substring(1,2));
    }else {
        num = parseInt(splitDate[0]);
    }
    return num;
}

function findMonth() {
    const monthStr = currRange.innerHTML;
    let index = monthLabels.indexOf(monthStr) + 1;
    return index;
}

function findYear() {
    let index = 1;
    const yearRange = parseInt(currRange.innerHTML);
    if(year === yearRange){
        return index;
    }
    else {
        return index * 365;
    }
}

async function drawDiagram() {
    console.log("Starting drawDiagramm...");
    try{
        let dataArray = await getDataFromAPI();
        console.log("dataArray", dataArray);
        let dataToSplit = [];
        let data = [];
        let counterOneDay = 0;
        let currentLabel = [];
        let stepOut = false;
        let demoData = [0,0,0,0,0,0,0,0,0,0];
        const checkbox = [
            {name: 'consumption',label: 'consumption', data:data, backgroundColor:'#ffcd56', borderColor: '#ffcd56' },
            {name: 'generation',label: 'generation', data:data, backgroundColor: '#36a2eb', borderColor: '#36a2eb' },
            {name: 'balance',label: 'balance', data:data,  backgroundColor: '#4bc0c0', borderColor: '#4bc0c0' },
            {name: 'price',label:'price', data: data,  backgroundColor: '#ffb256', borderColor: '#ffb256' }
        ]
        let currChart = drawChart(demoData, HourLabels.slice(), checkbox, currentChart);
        if(selectedInterval === 'daily' || selectedInterval.value === 'daily'){
            for (let i = 0; i < dataArray.length -1;i++){
                let split = dataArray[i].timestamp.split(" ");
                if(split[0] === changeEuDateToUSDate(currRange.innerHTML)){
                    dataToSplit.push(dataArray[i]);
                }
            }
            let factorDays = findDay();
            console.log(factorDays);
            for (let x = factorDays; x < dataToSplit.length && !stepOut;x++){
                counterOneDay++;
                let consumption = 0;
                let generation = 0;
                let measurement = 0;
                if(dataToSplit[x].type === 'consumption'){
                    consumption += parseFloat(dataArray[x].measurement);
                }
                else {
                    generation +=  parseFloat(dataArray[x].measurement);
                }
                if(counterOneDay % 4 === 0){
                    measurement = generation - consumption;
                    findRightData(data,consumption,generation, measurement);
                }
                if(x === factorDays + day){
                    stepOut = true;
                }
            }
            currentLabel = HourLabels.slice();
        }
        else if(selectedInterval === 'monthly' || selectedInterval.value === 'monthly'){
            let factorMonth = findMonth();
            if(factorMonth > 1){
                factorMonth = factorMonth * ((95 * getDaysInMonth(factorMonth))-1);
            }
            for (let x = factorMonth; x < dataArray.length && !stepOut;x++){
                let consumption = 0;
                let generation = 0;
                let measurement = 0;

                if(dataArray[x].type === 'consumption'){
                    consumption += parseFloat(dataArray[x].measurement);
                }
                else {
                    generation +=  parseFloat(dataArray[x].measurement);
                }
                if(x % day === 0){ // ein Tag
                    measurement = generation - consumption;
                    findRightData(data,consumption, generation, measurement);
                }
                if(x === day * getDaysInMonth(factorMonth)){
                    stepOut = true;
                }
            }
            currentLabel = dailyLabels.slice();
        }
        else if(selectedInterval === 'yearly' || selectedInterval.value === 'yearly'){
            let indexMonth = 1;
            let count = 0;
            let factorYear = findYear();
            console.log("data:", dataArray);
            for (let x = factorYear; x < dataArray.length && !stepOut;x++){
                let consumption = 0;
                let generation = 0;
                let measurement = 0;
                count++;
                if(dataArray[x].type === 'consumption'){
                    consumption += parseFloat(dataArray[x].measurement);
                }
                else {
                    generation +=  parseFloat(dataArray[x].measurement);
                }
                if(count ===(day * getDaysInMonth(indexMonth))){
                    measurement = generation - consumption;
                    findRightData(data,consumption, generation, measurement);
                    indexMonth++;
                    count = 0;
                }
                if(x === dataArray.length/2){
                    stepOut = true;
                }
            }
            currentLabel = yearlyLabels.slice();
        }
         console.log(`real Data: ${data}`);
        chartSettingsContainer.display = "block";
        currentChart = drawChart(data,currentLabel, checkbox, currChart);
    }catch(exception){
        console.log("Error drawing Diagram: ", exception);
    }
    console.log("drawDiagramm finished");
}