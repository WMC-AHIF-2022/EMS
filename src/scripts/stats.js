function drawChart(data, labels, drawLine){
    console.log("Drawing chart with Data: ", data);
    console.log("Drawing chart with Labels: ", labels);

    //const selectedCheckboxes = data.filter(c => document.getElementById(c.type).checked); //TODO: Repair Code
    //const selectedCheckboxes = data.filter(c => c.type === "consumption");

    // const chartData1 = {
    //     labels: selectedInterval === 'daily' ? HourLabels : selectedInterval === 'monthly' ? dailyLabels : monthLabels,
    //     datasets: selectedCheckboxes.map(c => ({
    //         label: c.label,
    //         data: c.data[selectedInterval === 'daily' ? 0 : 1],
    //         backgroundColor: c.backgroundColor,
    //         borderColor: c.borderColor,
    //         fill: false
    //     }))
    // };
    var chartData = {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Values",
                data: data,
                backgroundColor: "red",
                borderColor: "red",
                borderWidth: 2,
                fill: false,
            }, ],
        },
        options: {
            plugins: {
                customCanvasBackgroundColor: {
                    color: 'white',
                }
            }
        },
    }
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
}