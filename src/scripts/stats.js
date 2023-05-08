function drawChart(data, labels){
    //console.log("Drawing chart with Data: ", data);
    //console.log("Drawing chart with Labels: ", labels);
    var ctx = document.getElementById("StatsChart")
    var canvas = ctx.getContext("2d");
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    new Chart(ctx, {
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