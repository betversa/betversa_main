const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Add this line to use environment variables

const app = express();
const port = process.env.PORT || 3000;

// Serve static files (frontend)
app.use(express.static('public'));

// Environment variables
const apiKey = process.env.API_KEY; // Store your API key in a .env file
const sports = [
    'baseball_mlb',
];
const regions = 'us';
const markets = 'h2h';
const oddsFormat = 'american';
const dateFormat = 'iso';

// Route to serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API endpoint to fetch odds
app.get('/api/odds', async (req, res) => {
    try {
        const oddsPromises = sports.map(sportKey => {
            return axios.get(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds`, {
                params: {
                    apiKey,
                    regions,
                    markets,
                    oddsFormat,
                    dateFormat,
                }
            });
        });

        const responses = await Promise.all(oddsPromises);
        const oddsData = responses.map(response => response.data);
        res.json(oddsData);
    } catch (error) {
        console.error('Error fetching odds:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
