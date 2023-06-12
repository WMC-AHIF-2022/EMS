function drawChart(data, label, checkbox){
    console.log("Drawing chart with Data: ", data);
    console.log("Drawing chart with Labels: ", label);

    //const selectedCheckboxes = data.filter(c => document.getElementById(c.type).checked); //TODO: Repair Code
    //const selectedCheckboxes = data.filter(c => c.type === "consumption");

    const selectCheckbox = checkbox.filter(c => document.getElementById(c.name).checked);
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
    const chartData = {
        type: "line",
        labels:label,
        datasets: [{
            data:data,
            backgroundColor:selectCheckbox.backgroundColor,
            borderColor:selectCheckbox.borderColor,
        }],
        fill:false
    }

    // var chartData = {
    //     type: "line",
    //     data: {
    //         labels: label,
    //         datasets: [{
    //             label: "Values",
    //             data: data,
    //             backgroundColor: "red",
    //             borderColor: "red",
    //             borderWidth: 2,
    //             fill: false,
    //         }, ],
    //     },
    //     options: {
    //         plugins: {
    //             customCanvasBackgroundColor: {
    //                 color: 'white',
    //             }
    //         }
    //     },
    // }
    // const chartOptions = {
    //     scales: {
    //         yAxes: [{
    //             ticks: {
    //                 beginAtZero: true
    //             }
    //         }]
    //     }
    // };
    // const ctx = document.getElementById('myChart').getContext('2d');
    // const myChart = new Chart(ctx, {
    //     type: 'line',
    //     data: chartData,
    // });
    const canvas = document.getElementById('myChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Erstelle das Diagramm
        const myChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
        });
        if(myChart !== undefined){
            document.getElementById('loadingChart').style.display = "none";
        }
    } else {
        console.error("Canvas-Element nicht gefunden.");
    }
}