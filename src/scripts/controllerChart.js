const consumptionCheckbox = document.getElementById("consumption");
const generationCheckbox = document.getElementById("generation");
const balanceCheckbox = document.getElementById("balance");
const priceCheckbox = document.getElementById("price");

let dailyLabels = [];
for (let i = 1; i <= 31; i++) {
    dailyLabels.push(i);
}
const HourLabels = Array.from({
    length: 24
}, (_, i) => (i + 1).toString());
const monthLabels = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
let selectedInterval = document.querySelector('input[name="interval"]:checked');
const intervalInputs = document.querySelectorAll('input[name="interval"]');

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

async function drawDiagram() {
    let dataArray = await getDataFromAPI();
    console.log(intervalInputs);
    console.log(selectedInterval);
    const checkboxes = [
        { name: 'consumption', label: 'Stromverbrauch', data: [dailyDataConsumption, monthlyDataConsumption], backgroundColor: '#ffcd56', borderColor: '#ffcd56' },
        { name: 'generation', label: 'Stromgewinnung', data: [dailyDataProduction, monthlyDataProduction], backgroundColor: '#36a2eb', borderColor: '#36a2eb' },
        { name: 'balance', label: 'Netto-Strombilanz', data: [dailyDataNetto, monthlyDataNetto], backgroundColor: '#4bc0c0', borderColor: '#4bc0c0' },
        { name: 'price', label: 'Gesamtpreis', data: [selectedInterval === 'daily' ? dailyData : monthlyDataPrice], backgroundColor: '#ffcd56', borderColor: '#ffcd56' }
    ];
    console.log(dataArray);
    // if(consumptionCheckbox.checked){
    //     if(intervalInputs.)
    // }


    const selectedCheckboxes = checkboxes.filter(c => document.getElementById(c.name).checked);
    const chartData = {
        labels: selectedInterval === 'daily' ? HourLabels : selectedInterval === 'monthly' ? dailyLabels : monthLabels,
        datasets: selectedCheckboxes.map(c => ({
            label: c.label,
            data: c.data[selectedInterval === 'daily' ? 0 : 1],
            backgroundColor: c.backgroundColor,
            borderColor: c.borderColor,
            fill: false
        }))
    };

    const chartOptions = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
    document.getElementById("loading").style.display = "none";
}