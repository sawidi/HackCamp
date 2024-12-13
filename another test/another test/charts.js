Highcharts.chart('line', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Lines Created by Users'
    },
    subtitle: {
        text: 'Source: Github Repo'
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 120,
        y: 70,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
    },
    xAxis: {
        // highlight here
        plotBands: [{
            color: 'rgba(68, 170, 213, .2)'
        }],
        type: 'datetime',
        title: {
            text: 'Date'
        }
    },
    yAxis: {
        title: {
            text: 'Lines Count'
        }
    },
    tooltip: {
        shared: true,
        headerFormat: '<b>{point.x:%Y-%m-%d}</b><br>'
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        series: {
            pointStart: Date.UTC(2000, 0, 1),
            pointIntervalUnit: 'day'
        },
        areaspline: {
            fillOpacity: 0.5
        }
    },
    series: [
        {
            name: 'Bob',
            data: [
                [1672876800000, 120],
                [1672963200000, 85],
                [1673049600000, 140],
                [1673136000000, 100]
            ]
        },
        {
            name: 'Alice',
            data: [
                [1672876800000, 150],
                [1672963200000, 90],
                [1673049600000, 160],
                [1673136000000, 120]
            ]
        },
        {
            name: 'Charlie',
            data: [
                [1672876800000, 130],
                [1672963200000, 95],
                [1673049600000, 145],
                [1673136000000, 110]
            ]
        }
    ]
});

Highcharts.chart('line2', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Lines Deleted by Users'
    },
    subtitle: {
        text: 'Source: Github Repo'
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 120,
        y: 70,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
    },
    xAxis: {
        // highlight here
        plotBands: [{
            color: 'rgba(68, 170, 213, .2)'
        }],
        type: 'datetime', 
        title: {
            text: 'Date'
        }
    },
    yAxis: {
        title: {
            text: 'Lines Count'
        }
    },
    tooltip: {
        shared: true,
        headerFormat: '<b>{point.x:%Y-%m-%d}</b><br>'
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        series: {
            pointStart: Date.UTC(2000, 0, 1), // Adjust based on your earliest timestamp
            pointIntervalUnit: 'day' // Adjust based on your data frequency
        },
        areaspline: {
            fillOpacity: 0.5
        }
    },
    series: [
        {
            name: 'Bob',
            data: [
                [1672876800000, 15],
                [1672963200000, 20],
                [1673049600000, 30],
                [1673136000000, 25]
            ]
        },
        {
            name: 'Alice',
            data: [
                [1672876800000, 10],
                [1672963200000, 18],
                [1673049600000, 25],
                [1673136000000, 20]
            ]
        },
        {
            name: 'Charlie',
            data: [
                [1672876800000, 12],
                [1672963200000, 15],
                [1673049600000, 20],
                [1673136000000, 18]
            ]
        }
    ]
});

Highcharts.chart('bar', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'User scores'
    },
    subtitle: {
        text: 'Source: Fuck knows'
    },
    xAxis: {
        categories: ['Bob', 'Alice', 'Charlie'],
        title: {
            text: null
        },
        gridLineWidth: 1,
        lineWidth: 0
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Population (millions)',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        },
        gridLineWidth: 0
    },
    // tooltip: {
    //     valueSuffix: ' millions'
    // },
    plotOptions: {
        bar: {
            borderRadius: '50%',
            dataLabels: {
                enabled: true
            },
            groupPadding: 0.1
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Code Readability',
        data: [6, 9, 10]
    }, {
        name: 'idk',
        data: [8, 3, 10]
    }//, add more attributes here
]
});