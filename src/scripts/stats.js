function drawChart(data, label, checkbox, currentChart){
    //console.log("Drawing chart with Data: ", data);
    //console.log("Drawing chart with Labels: ", label);
    let chartData2;

    const selectCheckbox = checkbox.filter(c => document.getElementById(c.name).checked);
    //console.log("SelectedCheckbox:",selectCheckbox);
    data.push(eval(selectCheckbox[0].name));
    let chartData1 = {
        type: "line",
        labels:label,
        datasets: [{
            label: selectCheckbox[0].name,
            data:data,
            backgroundColor:selectCheckbox[0].backgroundColor,
            borderColor:selectCheckbox[0].borderColor,
            fill:false
        }],
    }
    let canvas = document.getElementById('myChart');
    if (canvas) {
        let ctx = canvas.getContext('2d');
        if(currentChart !== undefined){
            currentChart.destroy();
        }
        // Erstellt das Diagramm
        let myChart = new Chart(ctx, {
            type: 'line',
            data: chartData1,
        });
        if(myChart !== undefined){
            document.getElementById('loadingChart').style.display = "none";
        }
        return myChart;
    } else {
        console.error("Canvas-Element nicht gefunden.");
    }
}