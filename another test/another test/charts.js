// Paths to JSON files
// json files
const lineChartFile1 = 'http://127.0.0.1:5500/linesCreatedData.json';
const lineChartFile2 = 'http://127.0.0.1:5500/linesDeletedData.json';
const barChartFile = 'http://127.0.0.1:5500/barChart.json';


// Load all JSON files simultaneously
Promise.all([
    fetch(lineChartFile1).then(response => response.json()),
    fetch(lineChartFile2).then(response => response.json()),
    fetch(barChartFile).then(response => response.json())
]).then(([lineData1, lineData2, barData]) => {
    // Create charts using the loaded data
    createFirstLineChart(lineData1);
    createSecondLineChart(lineData2);
    createBarChart(barData);
    console.log('Databases loaded');

}).catch(error => {
    console.error('Error loading JSON files:', error);
});

// lines created chart
function createFirstLineChart(data) {
    Highcharts.chart('line', {
        chart: { type: 'line' },
        title: { text: 'First Line Chart' },
        xAxis: { type: 'datetime' },
        yAxis: { title: { text: 'Values' } },
        series: data.map(user => ({
            name: user.name,
            data: user.data
        }))
    });
}

// lines deleted chart
function createSecondLineChart(data) {
    Highcharts.chart('line2', {
        chart: { type: 'line' },
        title: { text: 'Second Line Chart' },
        xAxis: { type: 'datetime' },
        yAxis: { title: { text: 'Values' } },
        series: data.map(user => ({
            name: user.name,
            data: user.data
        }))
    });
}

// bar chart
function createBarChart(data) {
    Highcharts.chart('bar', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Code Readability and Yuh by Users'
        },
        xAxis: {
            categories: data.map(user => user.name), // Map user names to x-axis
            title: {
                text: 'Users'
            }
        },
        yAxis: [
            {
                title: {
                    text: 'Code Readability' // Label for first Y-axis
                },
                opposite: false // Left side
            },
            {
                title: {
                    text: 'Yuh' // Label for second Y-axis
                },
                opposite: true // Right side
            }
        ],
    
        tooltip: {
            shared: true
        },
        plotOptions: {
            series: {
                grouping: true, // Keep bars separated
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [
            {
                name: 'Code Readability',
                data: data.map(user => user.data[0][0]), // Use the first row's first value for each user
                yAxis: 0 // Link to first Y-axis
            },
            {
                name: 'Yuh',
                data: data.map(user => user.data[0][1]), // Use the first row's second value for each user
                yAxis: 1 // Link to second Y-axis
            }
        ]
    });
}
