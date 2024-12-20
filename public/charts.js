// json files
const lineChartFile1 = 'http://127.0.0.1:5500/linesCreatedData.json';
const lineChartFile2 = 'http://127.0.0.1:5500/linesDeletedData.json';
const barChartFile = 'http://127.0.0.1:5500/barChart.json';

// 
let linesCreatedData = []; 
let linesRemovedData = [];
let lineChartCreated;
let lineChartDeleted;

// Load database and initialize charts
Promise.all([
    fetch(lineChartFile1).then(response => response.json()),
    fetch(lineChartFile2).then(response => response.json()),
    fetch(barChartFile).then(response => response.json())
]).then(([lineData1, lineData2, barData]) => {
    linesCreatedData = lineData1;
    linesRemovedData = lineData2;

    createFirstLineChart(linesCreatedData);
    createSecondLineChart(linesRemovedData);
    createBarChart(barData);
    console.log('Databases loaded');
}).catch(error => {
    console.error('Error loading JSON files:', error);
});

// Create charts
function createFirstLineChart(data) {
    lineChartCreated = Highcharts.chart('line', {
        chart: { type: 'line' },
        title: { text: 'Lines Created by Users' },
        xAxis: { type: 'datetime' },
        yAxis: { title: { text: 'Values' } },
        series: data.map(user => ({
            name: user.name,
            data: user.data
        }))
    });
}

function createSecondLineChart(data) {
    lineChartDeleted = Highcharts.chart('line2', {
        chart: { type: 'line' },
        title: { text: 'Lines Deleted by Users' },
        xAxis: { type: 'datetime' },
        yAxis: { title: { text: 'Values' } },
        series: data.map(user => ({
            name: user.name,
            data: user.data
        }))
    });
}

function createBarChart(data) {
    Highcharts.chart('bar', {
        chart: { type: 'bar' },
        title: { text: 'User rankings' },
        xAxis: {
            title: { text: 'Ranking' },
            categories: data[0].data.map(point => point[0]), // Use names from the database
        },
        yAxis: { title: { text: 'Ranking' }, max: 10 },
        tooltip: { shared: true, valueSuffix: ' points' },
        plotOptions: { series: { dataLabels: { enabled: true } } },
        series: data.map(user => ({
            name: user.name,
            data: user.data
        }))
    });
}

// Add created lines
document.getElementById('createdaddbutton').addEventListener('click', () => {
    const userName = document.getElementById('username').value.trim();
    const createdLines = parseInt(document.getElementById('createdlines').value, 10);
    const dateCreated = document.getElementById('datecreated').value;

    if (!userName || isNaN(createdLines) || !dateCreated) {
        alert('Please enter valid data!');
        return;
    }

    handleCreatedLines(userName, createdLines, dateCreated);
    saveCreatedDataToServer(linesCreatedData);

    // Clear input fields
    document.getElementById('username').value = '';
    document.getElementById('createdlines').value = '';
    document.getElementById('datecreated').value = '';
});

// Add deleted lines
document.getElementById('addButton2').addEventListener('click', () => {
    const userName = document.getElementById('userName2').value.trim();
    const removedLines = parseInt(document.getElementById('removedLines').value, 10);
    const dateRemoved = document.getElementById('dateRemoved').value;

    if (!userName || isNaN(removedLines) || !dateRemoved) {
        alert('Please enter valid data!');
        return;
    }

    handleDeletedLines(userName, removedLines, dateRemoved);
    saveDataToServer(linesRemovedData);

    // Clear input fields
    document.getElementById('userName2').value = '';
    document.getElementById('removedLines').value = '';
    document.getElementById('dateRemoved').value = '';
});

// Handle created lines
function handleCreatedLines(userName, createdLines, dateCreated) {
    const timestamp = Date.parse(dateCreated);

    if (isNaN(timestamp)) {
        alert('Invalid date format!');
        return;
    }

    let user = linesCreatedData.find(user => user.name === userName);

    if (user) {
        user.data.push([timestamp, createdLines]);
    } else {
        const newUser = { name: userName, data: [[timestamp, createdLines]] };
        linesCreatedData.push(newUser);
        lineChartCreated.addSeries({ name: userName, data: newUser.data });
    }

    lineChartCreated.series.forEach(series => {
        const userData = linesCreatedData.find(user => user.name === series.name);
        if (userData) {
            series.setData(userData.data, true);
        }
    });
}

// Handle deleted lines
function handleDeletedLines(userName, removedLines, dateRemoved) {
    const timestamp = Date.parse(dateRemoved);

    if (isNaN(timestamp)) {
        alert('Invalid date format!');
        return;
    }

    let user = linesRemovedData.find(user => user.name === userName);

    if (user) {
        user.data.push([timestamp, removedLines]);
    } else {
        const newUser = { name: userName, data: [[timestamp, removedLines]] };
        linesRemovedData.push(newUser);
        lineChartDeleted.addSeries({ name: userName, data: newUser.data });
    }

    lineChartDeleted.series.forEach(series => {
        const userData = linesRemovedData.find(user => user.name === series.name);
        if (userData) {
            series.setData(userData.data, true);
        }
    });
}

// Save to server
function saveDataToServer(updatedData) {
    fetch('http://localhost:5500/update-lines-deleted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
        .then(response => response.ok ? console.log('Data saved successfully') : console.error('Failed to save data:', response.statusText))
        .catch(error => console.error('Error saving data:', error));
}

function saveCreatedDataToServer(updatedData) {
    fetch('http://localhost:5500/update-lines-created', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
        .then(response => response.ok ? console.log('Lines created data saved successfully') : console.error('Failed to save data:', response.statusText))
        .catch(error => console.error('Error saving lines created data:', error));
}
