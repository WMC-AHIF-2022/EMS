function drawChart(data, labels){
    //console.log("Drawing chart with Data: ", data);
    //console.log("Drawing chart with Labels: ", labels);
    var ctx = document.getElementById("StatsChart").getContext("2d");
    var myChart = new Chart(ctx, {
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
        }
    });
}