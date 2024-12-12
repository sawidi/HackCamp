(async () => {

    // Load the dataset
    const data = await fetch(
        'data.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'User Data'
        },
        yAxis: {
            title: {
                text: 'Number of Employees'
            }
        },
    

        series: [{
            name: 'User Data',
            data: data,
            step: true,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
})();