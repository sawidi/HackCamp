// json files
const lineChartFile1 = 'http://127.0.0.1:5500/linesCreatedData.json';
const lineChartFile2 = 'http://127.0.0.1:5500/linesDeletedData.json';
const barChartFile = 'http://127.0.0.1:5500/barChart.json';
const baseURL = "http://localhost:5500";

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
            credits: {enabled: false},
            chart: { type: 'line' },
            title: { text: 'Lines Created by Users' },
            xAxis: { type: 'datetime' },
            yAxis: { title: { text: 'Lines created' } },
            tooltip: { shared: true, valueSuffix: ' lines' },
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
            credits: {enabled: false},
            chart: { type: 'line' },
            title: { text: 'Lines Deleted by Users' },
            xAxis: { type: 'datetime' },
            yAxis: { title: { text: 'Lines deleted' } },
            tooltip: { shared: true, valueSuffix: ' lines' },
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
            credits: {enabled: false},
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

        // give variables for functions to handle
        const linesCreatedURL = `${baseURL}/update-lines-created`;
        handleLineData(userName, createdLines, dateCreated, linesCreatedData);
        saveDataToServer(linesCreatedData, linesCreatedURL);

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

        // give variables for functions to handle
        const linesRemovedURL = `${baseURL}/update-lines-deleted`;
        handleLineData(userName, removedLines, dateRemoved, linesRemovedData);
        saveDataToServer(linesRemovedData, linesRemovedURL);
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
        // if timestamp isnt a timestamp value, return
        if (isNaN(timestamp)) 
        {
            alert('Invalid date format!');
            return;
        }

        // search for user in the array
        let user = data.find(user => user.name === userName);
        // if found, push entry in the array (will be sorted in the backend)
        if (user) 
            { user.data.push([timestamp, enteredLines]); } 
        else
        // if not found, create a new user and push as a new entry  
        {
            const newUser = { name: userName, data: [[timestamp, enteredLines]] };
            data.push(newUser);
            lineChartCreated.addSeries({ name: userName, data: newUser.data });
        }

        // update the chart
        lineChartCreated.series.forEach(series => 
        {
            const userData = data.find(user => user.name === series.name);
            if (userData) 
                { series.setData(userData.data, true); }
        });
    }
// add line stuff done

// delete stuff
    // line removed chart entry variables
    document.getElementById('deleteCreatedButton').addEventListener('click', () => 
    {
        const userName = document.getElementById('deleteCreatedLineUsername').value.trim();
        const dateToDelete = document.getElementById('deleteCreatedDate').value;

        // if fields are empty
        if (!userName || !dateToDelete) 
        {
            alert('Please enter valid data!');
            return;
        }

        const linesCreatedURL = `${baseURL}/update-lines-created`;

        // give variables for functions to handle
        deleteLineData(userName, dateToDelete, linesCreatedData);
        saveDataToServer(linesCreatedData, linesCreatedURL);

        // clear input fields after use
        document.getElementById('deleteCreatedLineUsername').value = '';
        document.getElementById('deleteCreatedDate').value = '';
    });

    // line removed chart entry variables
    document.getElementById('deleteRemovedButton').addEventListener('click', () => 
    {
        const userName = document.getElementById('deleteRemovedLineUsername').value.trim();
        const dateToDelete = document.getElementById('deleteRemovedDate').value;

        // if fields are empty
        if (!userName || !dateToDelete) {
            alert('Please enter valid data!');
            return;
        }

        const linesDeletedURL = `${baseURL}/update-lines-deleted`;

        // give variables for functions to handle
        deleteLineData(userName, dateToDelete, linesRemovedData);
        saveDataToServer(linesRemovedData, linesDeletedURL);

        // clear input fields after use
        document.getElementById('deleteRemovedLineUsername').value = '';
        document.getElementById('deleteRemovedDate').value = '';
    });
    
    // general delete function for both charts
    function deleteLineData(userName, dateToDelete, data) 
    {
        const timestamp = Date.parse(dateToDelete);

        // if timestamp field is invalid, break
        if (isNaN(timestamp)) 
        {
            alert('Invalid date format!');
            return;
        }

        // look for matching user in array
        const user = data.find(user => user.name === userName);
        if (!user) 
        // if user not found
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
            { 
                chartSeries.setData(user.data, true); 
            }

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
        else if (codeReadInput > 11) 
        {
            alert('value has to be equal to or less than 10');
            return;
        }
        else if (codeReadInput < 0) 
        {
            alert('value has to be equal to or more than 0');
            return;
        }
        
        const codeReadabilityURL = `${baseURL}/update-code-readability`;

        handleCodeReadability(userName, codeReadInput);
        saveDataToServer(barData, codeReadabilityURL);

        document.getElementById('userName3').value = '';
        document.getElementById('codeReadInput').value = '';
    });

    document.getElementById('deleteCodeReadButton').addEventListener('click', () => 
    {
        const userName = document.getElementById('userName4').value.trim();
    
        if (!userName) 
        {
            alert('Please enter a valid user name!');
            return;
        }
    
        const codeReadabilityURL = `${baseURL}/update-code-readability`;

        deleteCodeReadabilityUser(userName);
        saveDataToServer(barData, codeReadabilityURL);
    
        // Clear input field
        document.getElementById('deleteUserName').value = '';
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
                codeReadDataset.data.push([userName, codeReadInput]);
                console.log(`added new user: ${userName} with score ${codeReadInput}`);
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

    function deleteCodeReadabilityUser(userName) 
    {
        // Find the "Code Read" dataset
        let codeReadDataset = barData.find(dataset => dataset.name === "Code Read");
        
        if (!codeReadDataset) 
        {
            console.log('dataset not found.');
            return;
        }
    
        // Find the user in the dataset
        const userIndex = codeReadDataset.data.findIndex(row => row[0] === userName);
    
        if (userIndex !== -1) 
        {
            // Remove the user from the dataset
            codeReadDataset.data.splice(userIndex, 1);
            console.log(`deleted user: ${userName} from Code Readability dataset.`);
        } 
        else
        {
            console.log(`user: ${userName} not found in Code Readability dataset.`);
        }
    }
// change code readability function done

// backend stuff
    function saveDataToServer(updatedData, url) 
    {
        fetch(url, 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.ok ? console.log('Code readability data saved successfully') : console.error('Failed to save data:', response.statusText))
        .catch(error => console.error('Error saving code readability data:', error));
    }
// backend stuff done

