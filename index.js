const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files (frontend)
app.use(express.static('public'));

// Hardcoded API key
const apiKey = 'eb708c171e07a5586303ff757549edb5';

const sportKey = 'basketball_nba';
const regions = 'us';
const markets = 'h2h';
const oddsFormat = 'american';
const dateFormat = 'iso';
const bookmakers = 'draftkings'; // Specify the bookmaker

// API endpoint to fetch odds
app.get('/api/odds', async (req, res) => {
    try {
        const response = await axios.get(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds`, {
            params: {
                apiKey,
                regions,
                markets,
                oddsFormat,
                dateFormat,
                bookmakers
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching odds:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

