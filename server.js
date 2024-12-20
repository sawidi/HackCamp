const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the CORS middleware

const app = express();
const PORT = 5500;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON body
app.use(express.json());

// Serve static files (e.g., HTML, JS, JSON)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to update linesDeletedData.json
app.post('/update-lines-deleted', (req, res) => {
    const newData = req.body;

    // Log incoming data for debugging
    console.log('New data received:', newData);

    // Path to the JSON file
    const filePath = path.join(__dirname, 'public/linesDeletedData.json');

    // Read the current data from the file
    fs.readFile(filePath, 'utf8', (readErr, fileData) => {
        if (readErr) {
            console.error('Error reading data:', readErr);
            return res.status(500).send('Failed to read existing data');
        }

        // Log the current file data
        console.log('Current file data:', fileData);

        let existingData = [];
        try {
            existingData = JSON.parse(fileData); // Parse the existing data
        } catch (parseErr) {
            console.error('Error parsing existing data:', parseErr);
            return res.status(500).send('Failed to parse existing data');
        }

       // Merge the new data with the existing data
        newData.forEach(newUser => {
            const existingUser = existingData.find(user => user.name.toLowerCase() === newUser.name.toLowerCase());
            if (existingUser) {
                // Avoid duplicate data points
                newUser.data.forEach(newPoint => {
                    const isDuplicate = existingUser.data.some(existingPoint => existingPoint[0] === newPoint[0]);
                    if (!isDuplicate) {
                        existingUser.data.push(newPoint);
                    }
                });
            } else {
                // Add the new user if not already in existing data
                existingData.push(newUser);
            }
        });

        const updatedData = existingData;
        console.log('Updated data to write:', JSON.stringify(updatedData, null, 2));

        // Write the merged data back to the file
        fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error saving data:', writeErr);
                return res.status(500).send('Failed to save data');
            }
            console.log('Data saved successfully');
            res.status(200).send('Data saved successfully');
        });
    });
});

// save lines created data
app.post('/update-lines-created', (req, res) => {
    let newData = req.body;

    console.log('Incoming data:', JSON.stringify(newData, null, 2));

    if (!Array.isArray(newData)) {
        // Convert to an array if it's a single object
        if (typeof newData === 'object' && newData !== null) {
            console.warn('Converting newData to an array.');
            newData = [newData];
        } else {
            console.error('Invalid data format:', newData);
            return res.status(400).send('Invalid data format. Expected an array.');
        }
    }

    const filePath = path.join(__dirname, 'public/linesCreatedData.json');

    fs.readFile(filePath, 'utf8', (readErr, fileData) => {
        let existingData = [];
        if (readErr && readErr.code === 'ENOENT') {
            console.log('File not found. Initializing new data.');
        } else if (readErr) {
            console.error('Error reading data:', readErr);
            return res.status(500).send('Failed to read existing data');
        } else {
            try {
                existingData = JSON.parse(fileData);
            } catch (parseErr) {
                console.error('Error parsing existing data:', parseErr);
                return res.status(500).send('Failed to parse existing data');
            }
        }

        console.log('Parsed existing data:', JSON.stringify(existingData, null, 2));

        // Merge the new data with the existing data
        newData.forEach(newUser => {
            const existingUser = existingData.find(user => user.name.toLowerCase() === newUser.name.toLowerCase());
            if (existingUser) {
                // Avoid duplicate data points
                newUser.data.forEach(newPoint => {
                    const isDuplicate = existingUser.data.some(existingPoint => existingPoint[0] === newPoint[0]);
                    if (!isDuplicate) {
                        existingUser.data.push(newPoint);
                    }
                });
            } else {
                // Add the new user if not already in existing data
                existingData.push(newUser);
            }
        });

        const updatedData = existingData;
        console.log('Updated data to write:', JSON.stringify(updatedData, null, 2));

        // Write the updated data back to the JSON file
        fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error saving data:', writeErr);
                return res.status(500).send('Failed to save data');
            }
            console.log('Data saved successfully');
            res.status(200).send('Data saved successfully');
        });
    });
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
