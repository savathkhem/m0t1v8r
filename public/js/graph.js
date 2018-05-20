ctx = document.getElementById('lineChartExampleWithNumbersAndGrid').getContext("2d");

gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
gradientStroke.addColorStop(0, '#18ce0f');
gradientStroke.addColorStop(1, chartColor);

gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
gradientFill.addColorStop(1, hexToRGB('#18ce0f',0.4));

myChart = new Chart(ctx, {
    type: 'line',
    responsive: true,
    data: {
        labels: ["12pm,", "3pm", "6pm", "9pm", "12am", "3am", "6am", "9am"],
        datasets: [{
            label: "Email Stats",
            borderColor: "#18ce0f",
            pointBorderColor: "#FFF",
            pointBackgroundColor: "#18ce0f",
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 4,
            fill: true,
            backgroundColor: gradientFill,
            borderWidth: 2,
            data: [40, 500, 650, 700, 1200, 1250, 1300, 1900]
        }]
    },
    options: gradientChartOptionsConfigurationWithNumbersAndGrid
});