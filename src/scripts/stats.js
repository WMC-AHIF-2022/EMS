function drawChart(data, label, checkbox, currentChart){
    console.log("Drawing chart with Data: ", data);
    console.log("Drawing chart with Labels: ", label);

    //const selectedCheckboxes = data.filter(c => document.getElementById(c.type).checked); //TODO: Repair Code
    //const selectedCheckboxes = data.filter(c => c.type === "consumption");

    const selectCheckbox = checkbox.filter(c => document.getElementById(c.name).checked);
    let chartData = {
        type: "line",
        labels:label,
        datasets: [{
            data:data,
            backgroundColor:selectCheckbox.backgroundColor,
            borderColor:selectCheckbox.borderColor,
        }],
        fill:false
    }
    console.log(currentChart);
    console.log(currentChart);
    let canvas = document.getElementById('myChart');
    if (canvas) {
        let ctx = canvas.getContext('2d');
        if(currentChart !== undefined){
            currentChart.destroy();
        }
        // Erstelle das Diagramm
         let myChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
        });
        if(myChart !== undefined){
            document.getElementById('loadingChart').style.display = "none";
        }
        return myChart;
    } else {
        console.error("Canvas-Element nicht gefunden.");
    }
}