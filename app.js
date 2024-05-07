import express from 'express';
import fetch from 'node-fetch'; // Make sure your environment supports ESM, or use require with CJS.
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = 4000;
const APIKEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiM2JkMzYxMGYzMWViMWExZWUxZGEwNjZhZWVlNTY1Yjk2NWI5MzkyNDYwYzAzZGMxMjc2YWQ3YTY4YzMzZWVmNGY0Y2ZmMDNhOThlMDNmZjYiLCJpYXQiOjE3MTM0NTE5MzgsIm5iZiI6MTcxMzQ1MTkzOCwiZXhwIjoxNzQ0OTg3OTM4LCJzdWIiOiIyMjQ0NCIsInNjb3BlcyI6W119.bBris5JQ4l_CRJ2wcoicpcTediwGMqct-D-30rwts2vFD8MBnFIA5RCjrPMyoeMLkkghENcxU3GrNqVJpQmTXg'; // Replace with your actual API key

let skyId = ''
let entityId = ''

// Middleware to handle JSON responses
app.use(express.json());

// Route to fetch airport data
app.get('/fetch-airport', async (req, res) => {
    const { query } = req.query;  // Retrieve the `query` parameter from incoming GET request
    const url = `https://app.goflightlabs.com/retrieveAirport?access_key=${APIKEY}&query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        skyId = data[0]['skyId']
        entityId = data[0]['entityId']
        console.log(skyId, entityId)
        if (response.ok) {
            res.json(data);  // Send the JSON response back to the Chrome extension
        } else {
            throw new Error(`API call failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching airport details:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/retrieve-airport', async (skyId, entityId, res) => {
    const url = `https://app.goflightlabs.com/retrieveFlights?access_key=${APIKEY}&originSkyId=${skyId}&destinationSkyId=NYCA&originEntityId=${entityId}&destinationEntityId=27537542&date=2024-05-10`

    try {
        const response = await fetch(url)
        const data = await response.json();
        if (response.ok) {
            response.json(data);
        } else {
            throw new Error(`API call failed with status: ${response.status}`); 
        }
    } catch (error) {
        console.error('Error fetching flight details:', error);
        res.status(500).json({ error: error.message });
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

