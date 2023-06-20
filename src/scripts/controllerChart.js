const consumptionCheckbox = document.getElementById("consumption");
const generationCheckbox = document.getElementById("generation");
const balanceCheckbox = document.getElementById("balance");
const priceCheckbox = document.getElementById("price");
const currRange = document.getElementById("currRange");
const chartSettingsContainer = document.getElementById("chartSettingsContainer");
const year = new Date().getFullYear();
// let pricePerKw = document.getElementById("pricePerKwh");
let dailyLabels = [];
const yearlyLabels = Array.from({
    length: 12
}, (_, i) => (i + 1).toString());
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
function findRightData(data,consumption, generation, measurement) {
    let price = 0;
    if(consumptionCheckbox.checked && consumption !== 0){
        data.push(consumption);
    }
    else if(generationCheckbox.checked && generation !== 0){
        data.push(generation);
    }
    else {
        measurement = generation - consumption;
        data.push(measurement);
    }
    // else{
    //     console.log(pricePerKw.innerHTML);
    //     price = measurement * parseFloat(pricePerKw.innerHTML);
    //     data.push(price);
    // }
}

function findDay() {
    const split = currRange.innerHTML.split(".");
    let num = parseInt(split[1], 10);
    console.log(num);
    if(num > 1){
        num = num * 95;
    }
    return num;
}

function findMonth() {
    const monthStr = currRange.innerHTML;
    let index = monthLabels.indexOf(monthStr) + 1;
    console.log(index);
    if(index > 1){
        index = index * ((95 * getDaysInMonth(index))-1);
    }
    console.log("Monthright",index);
    return index;
}
async function drawDiagram() {
    console.log("Starting drawDiagramm...");
    try{
        const day = (4*HourLabels)-1;
        const month = (day * dailyLabels)-1;
        const year = month*12;
        let dataArray = await getDataFromAPI();
        console.log("dataArray", dataArray);
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
        console.log("selectedInterval:",selectedInterval.value);
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
                let consumption = 0;
                let generation = 0;
                let measurement = 0;
                if(dataToSplit[x].type === 'consumption'){
                    consumption += dataToSplit[x].measurement;
                }
                else {
                    generation +=  dataToSplit[x].measurement;
                }
                if(x % 4 === 0){
                    findRightData(data,consumption,generation, measurement);
                    console.log("Es geht in die If");
                }
                if(x === day){//95 == Ein tag
                    stepOut = true;
                }
            }
            currentLabel = HourLabels.slice();
            console.log(currentLabel);
        }
        else if(selectedInterval === 'monthly' || selectedInterval.value === 'monthly'){
            let factorMonth = findMonth();
            console.log("factorMonth:",factorMonth);
            for (let x = factorMonth; x < dataArray.length && !stepOut;x++){
                let consumption = 0;
                let generation = 0;
                let measurement = 0;

                if(dataArray[x].type === 'consumption'){
                    consumption += dataArray[x].measurement;
                }
                else {
                    generation +=  dataArray[x].measurement;
                }
                if(x % 95 === 0){ // ein Tag
                    findRightData(data,consumption, generation, measurement);
                }
                if(x === month){
                    stepOut = true;
                }
            }
            currentLabel = dailyLabels.slice();
            console.log("DailyLabel:",dailyLabels);
        }
        else if(selectedInterval === 'yearly' || selectedInterval.value === 'yearly'){
            let indexMonth = 0;
            console.log("data:", dataArray);
            for (let x = 1; x < dataArray.length && !stepOut;x++){
                let consumption = 0;
                let generation = 0;
                let measurement = 0;

                if(dataArray[x].type === 'consumption'){
                    consumption += dataArray[x].measurement;
                }
                else {
                    generation +=  dataArray[x].measurement;
                }
                if(x % (95 * getDaysInMonth(indexMonth) === 0)){
                    findRightData(data,consumption, generation, measurement);
                    indexMonth++;
                    console.log("Index von X:",x);
                }
                if(x === year){
                    stepOut = true;
                }
            }
            currentLabel = yearlyLabels.slice();
            console.log("DailyLabel:",dailyLabels);
        }
        // console.log(dataToSplit);
        // console.log(currentLabel);
        // console.log(`real Data: ${data}`);
        // console.log(HourLabels);
        chartSettingsContainer.display = "block";
        currentChart = drawChart(data,currentLabel, checkbox, currChart);
    }catch(exception){
        console.log("Error drawing Diagram: ", exception);
    }
    // const drawLine = findLine(checkbox, currentLabel);
    console.log("drawDiagramm finished");
}