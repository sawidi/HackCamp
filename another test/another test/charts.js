// Chart Configuration
Highcharts.chart('container', {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Metrics'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: [{
        // Primary yAxis (Column and Line Data)
        labels: {
            format: '{value}°C',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
            text: 'Tempearature',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        }
    }, {
        // Secondary yAxis (Pie Data)
        title: {
            text: 'Precipitation',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value} mm',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        opposite: true
    }],
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 80,
        verticalAlign: 'top',
        y: 55,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || 'rgba(255,255,255,0.25)'
    },
    series: [{
        type: 'column',
        name: 'Rainfall',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        tooltip: {
            valueSuffix: ' mm'
        }
    }, {
        type: 'spline',
        name: 'Temperature',
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
        tooltip: {
            valueSuffix: '°C'
        }
    }, {
        type: 'pie',
        name: 'Total Precipitation',
        data: [{
            name: 'January',
            y: 49.9,
            color: Highcharts.getOptions().colors[0] // Rainfall color
        }, {
            name: 'February',
            y: 71.5,
            color: Highcharts.getOptions().colors[1] // Temperature color
        }, {
            name: 'March',
            y: 106.4,
            color: Highcharts.getOptions().colors[2]
        }, {
            name: 'April',
            y: 129.2,
            color: Highcharts.getOptions().colors[3]
        }, {
            name: 'May',
            y: 144.0,
            color: Highcharts.getOptions().colors[4]
        }],
        center: [100, 80],
        size: 100,
        showInLegend: false,
        dataLabels: {
            enabled: false
        }
    }]
});
