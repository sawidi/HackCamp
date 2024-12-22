// json files
const lineChartFile1 = 'http://127.0.0.1:5500/linesCreatedData.json';
const lineChartFile2 = 'http://127.0.0.1:5500/linesDeletedData.json';
const barChartFile = 'http://127.0.0.1:5500/barChart.json';

// initialise stuff
let linesCreatedData = []; 
let linesRemovedData = [];
let barData = [];
let lineChartCreated;
let lineChartDeleted;


// load databases and initialise charts
Promise.all(
[
    fetch(lineChartFile1).then(response => response.json()),
    fetch(lineChartFile2).then(response => response.json()),
    fetch(barChartFile).then(response => response.json())
])
.then(([lineData1, lineData2, fetchedBarData]) => 
{
    linesCreatedData = lineData1;
    linesRemovedData = lineData2;
    barData = fetchedBarData;

    createFirstLineChart(linesCreatedData);
    createSecondLineChart(linesRemovedData);
    createBarChart(barData);
    console.log('Databases loaded');
})
.catch(error => 
    { console.error('Error loading JSON files:', error); });

// create charts
    function createFirstLineChart(data) 
    {
        lineChartCreated = Highcharts.chart('line', 
        {
            chart: { type: 'line' },
            title: { text: 'Lines Created by Users' },
            xAxis: { type: 'datetime' },
            yAxis: { title: { text: 'Values' } },
            series: data.map(user => (
            {
                name: user.name,
                data: user.data
            }))
        });
    }

    function createSecondLineChart(data) 
    {
        lineChartDeleted = Highcharts.chart('line2', 
        {
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

    function createBarChart(data) 
    {
        Highcharts.chart('bar', 
        {
            chart: { type: 'bar' },
            title: { text: 'User rankings' },
            xAxis: {
                title: { text: 'Ranking' },
                // use names from the database
                categories: data[0].data.map(point => point[0]), 
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
// create charts done

// add stuff
    // add created lines
    document.getElementById('createdaddbutton').addEventListener('click', () => 
    {
        const userName = document.getElementById('username').value.trim();
        const createdLines = parseInt(document.getElementById('createdlines').value, 10);
        const dateCreated = document.getElementById('datecreated').value;

        if (!userName || isNaN(createdLines) || !dateCreated || (createdLines < 0)) {
            alert('Please enter valid data!');
            return;
        }

        handleLineData(userName, createdLines, dateCreated, linesCreatedData);
        saveCreatedDataToServer(linesCreatedData);

        // clear input fields after use
        document.getElementById('username').value = '';
        document.getElementById('createdlines').value = '';
        document.getElementById('datecreated').value = '';
    });

    // add deleted lines functionality 
    document.getElementById('addButton2').addEventListener('click', () => 
    {
        const userName = document.getElementById('userName2').value.trim();
        const removedLines = parseInt(document.getElementById('removedLines').value, 10);
        const dateRemoved = document.getElementById('dateRemoved').value;

        // if input field is empty or givem removed lines is a negative number, break function 
        if (!userName || isNaN(removedLines) || !dateRemoved || (removedLines < 0)) 
        {
            alert('Please enter valid data!');
            return;
        }

        handleLineData(userName, removedLines, dateRemoved, linesRemovedData);
        saveRemovedDataToServer(linesRemovedData);
        console.log('save successful');

        // clear input fields after use
        document.getElementById('userName2').value = '';
        document.getElementById('removedLines').value = '';
        document.getElementById('dateRemoved').value = '';
    });

    // handle add line data entries
    function handleLineData(userName, enteredLines, dateEntered, data) 
    {
        const timestamp = Date.parse(dateEntered);

        if (isNaN(timestamp)) 
        {
            alert('Invalid date format!');
            return;
        }

        let user = data.find(user => user.name === userName);

        if (user) 
            { user.data.push([timestamp, enteredLines]); } 
        else 
        {
            const newUser = { name: userName, data: [[timestamp, enteredLines]] };
            data.push(newUser);
            lineChartCreated.addSeries({ name: userName, data: newUser.data });
        }

        lineChartCreated.series.forEach(series => 
        {
            const userData = data.find(user => user.name === series.name);
            if (userData) 
                { series.setData(userData.data, true); }
        });
    }
// add line stuff done

// delete stuff
    // line created chart entry variables
    document.getElementById('deleteCreatedButton').addEventListener('click', () => 
    {
        const userName = document.getElementById('deleteCreatedLineUsername').value.trim();
        const dateToDelete = document.getElementById('deleteCreatedDate').value;

        if (!userName || !dateToDelete) 
        {
            alert('Please enter valid data!');
            return;
        }

        deleteLineData(userName, dateToDelete, linesCreatedData);
        saveCreatedDataToServer(linesCreatedData);
        // clear input fields after use
        document.getElementById('deleteCreatedLineUsername').value = '';
        document.getElementById('deleteCreatedDate').value = '';
    });

    // line removed chart entry variables
    document.getElementById('deleteRemovedButton').addEventListener('click', () => 
    {
        const userName = document.getElementById('deleteRemovedLineUsername').value.trim();
        const dateToDelete = document.getElementById('deleteRemovedDate').value;

        if (!userName || !dateToDelete) {
            alert('Please enter valid data!');
            return;
        }

        deleteLineData(userName, dateToDelete, linesRemovedData);
        saveRemovedDataToServer(linesRemovedData);

        // clear input fields after use
        document.getElementById('deleteRemovedLineUsername').value = '';
        document.getElementById('deleteRemovedDate').value = '';
    });
    
    // general delete function for both charts
    function deleteLineData(userName, dateToDelete, data) 
    {
        const timestamp = Date.parse(dateToDelete);

        if (isNaN(timestamp)) 
        {
            alert('Invalid date format!');
            return;
        }

        const user = data.find(user => user.name === userName);

        if (!user) 
        {
            alert(`${userName} not found in users`);
            return;
        }

        // remove duplicates
        const updatedData = user.data.filter(entry => entry[0] !== timestamp);
        if (updatedData.length === user.data.length) 
        {
            alert('No matching entry found for the given date!');
            return;
        }
        user.data = updatedData;

        // update the chart
        const chartSeries = lineChartCreated.series.find(series => series.name === userName);
        if (chartSeries) 
            { chartSeries.setData(user.data, true); }

        // remove user if no data entries are left
        if (user.data.length === 0) 
        {
            const userIndex = data.findIndex(user => user.name === userName);
            data.splice(userIndex, 1);

            // remove series from chart
            if (chartSeries) 
                { chartSeries.remove(); }
        }
        alert(`"${userName}" has been deleted!`);
    }
// delete entry stuff done

// change code readability function
    document.getElementById('codeReadButton').addEventListener('click', () => 
    {
        const userName = document.getElementById('userName3').value.trim();
        const codeReadInput = parseInt(document.getElementById('codeReadInput').value, 10);

        if (!codeReadInput) 
        {
            alert('enter valid data!');
            return;
        }
        else if (codeReadInput >= 10) 
        {
            alert('value has to be equal to or less than 10');
            return;
        }
        else if (codeReadInput < 0) 
        {
            alert('value has to be equal to or more than 0');
            return;
        }
        

        handleCodeReadability(userName, codeReadInput);
        saveCodeReadDataToServer(barData);

        document.getElementById('userName3').value = '';
        document.getElementById('codeReadInput').value = '';
    });

    function handleCodeReadability(userName, codeReadInput) 
    {
        let codeReadDataset = barData.find(dataset => dataset.name === "Code Read");
        if (codeReadDataset) 
        {
            let user = codeReadDataset.data.find(row => row[0] === userName);
            // update the second column for the user 
            if (!user) 
            {
                alert(`${userName} not found in users`);
                return;
            }
            else if (user) 
            {
                // when user is found, update value of code readability
                user[1] = codeReadInput; 
                console.log(user)
                alert(`"${user}" code readability value has been updated`);
            }
        }
    }
// change code readability function done

// backend stuff
    function saveRemovedDataToServer(updatedData) 
    {
        fetch('http://localhost:5500/update-lines-deleted', 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.ok ? console.log('Data saved successfully') : console.error('Failed to save data:', response.statusText))
        .catch(error => console.error('Error saving data:', error));
    }

    function saveCreatedDataToServer(updatedData) 
    {
        fetch('http://localhost:5500/update-lines-created', 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.ok ? console.log('lines created data saved successfully') : console.error('Failed to save data:', response.statusText))
        .catch(error => console.error('error saving lines created data:', error));
    }

    function saveCodeReadDataToServer(updatedData) 
    {
        fetch('http://localhost:5500/update-code-readability', 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.ok ? console.log('Code readability data saved successfully') : console.error('Failed to save data:', response.statusText))
        .catch(error => console.error('Error saving code readability data:', error));
    }
// backend stuff done

