const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 5500;

// global CORS access
app.use(cors());
// JSON parsing
app.use(express.json());
// serve static files 
app.use(express.static(path.join(__dirname, 'public')));






// save lines removed data 
    app.post('/update-lines-deleted', (req, res) => 
    {
        console.log('new unsorted data:', JSON.stringify(req.body, null, 2));
        const incomingData = req.body;
        const filePath = path.join(__dirname, 'public/linesDeletedData.json');

        if (!Array.isArray(incomingData)) 
            { return res.status(400).send('invalid data; has to be an array'); }

        // sort data by date
        const sortedData = incomingData.map(user => (
        {
            name: user.name,
            data: user.data.sort((a, b) => a[0] - b[0]) 
            // in ascending order
        }));

        console.log('sorted data to write:', JSON.stringify(sortedData, null, 2));
        // replace data in file with new sorted data
        fs.writeFile(filePath, JSON.stringify(sortedData, null, 2), (writeErr) => 
        {
            if (writeErr) 
            {
                console.error('error saving data:', writeErr);
                return res.status(500).send('failed to save data');
            }
            console.log('data saved');
            res.status(200).send('data saved');
        });
    });
// save lines removed data done

// save lines created data
    app.post('/update-lines-created', (req, res) => 
    {
        console.log('incoming data:', JSON.stringify(req.body, null, 2));

        const incomingData = req.body;
        const filePath = path.join(__dirname, 'public/linesCreatedData.json');

        if (!Array.isArray(incomingData)) { return res.status(400).send('invalid data; has to be an array'); }

        // sort data by date
        const sortedData = incomingData.map(user => (
        {
            name: user.name,
            data: user.data.sort((a, b) => a[0] - b[0]) 
            // in ascending order
        }));

        console.log('sorted data to write:', JSON.stringify(sortedData, null, 2));
        // replace data in file with new sorted data
        fs.writeFile(filePath, JSON.stringify(sortedData, null, 2), (writeErr) => {
            if (writeErr) 
            {
                console.error('error saving data:', writeErr);
                return res.status(500).send('Failed to save data');
            }
            console.log('data saved');
            res.status(200).send('data saved');
        });
    });
// save lines created data done



// in-memory storage
let codeReadabilityData = [];
// code readability data update
app.post('/update-code-readability', (req, res) => 
{
    const updatedData = req.body;
    if (!updatedData || !Array.isArray(updatedData)) 
        { return res.status(400).json({ error: 'invalid data format' }); }
    console.log('new code readability data:', updatedData);

    // save to in-memory storage
    codeReadabilityData = updatedData;
    // save data to a file, here its the bar chart data file in public  
    fs.writeFile('public/barChart.json', JSON.stringify(codeReadabilityData, null, 2), (err) => 
    {
        if (err) 
        {
            console.error('error saving data to file:', err);
            return res.status(500).json({ error: 'failed to save data' });
        }
        console.log('code readability data saved to file.');
        res.status(200).json({ message: 'code readability data saved to file' });
    });
});




// start the server
app.listen(PORT, () => { console.log(`server is running at http://localhost:${PORT}`); });
