const cors = require('cors');
const express = require('express');
const axios = require('axios');
const NodeCache = require("node-cache");
// Set up cache instance. TTK is Time To Keep the data in seconds. Here, 3600 means each cache entry is kept for an hour.
const myCache = new NodeCache({ stdTTL: 3600 });
const app = express();
const port = process.env.PORT || 3000;
// Serve static files (frontend)
app.use(express.static('public'));
app.use(cors());

// API key and other constants - ensure these are securely managed
const apiKey = 'eb708c171e07a5586303ff757549edb5'; // Updated for privacy
const regions = 'us';
const markets = 'h2h,spreads,totals';
const oddsFormat = 'american';
const dateFormat = 'iso';
const bookmakers = 'draftkings'; // Example bookmaker

// API endpoint to fetch odds for multiple sports at once
app.get('/api/odds', async (req, res) => {
    const sportKeys = [
        'basketball_nba',
        'icehockey_nhl',
        'baseball_mlb',
        'basketball_ncaab'
        // Add more sports as necessary
    ];

    console.log(`Fetching odds for sports: ${sportKeys}`);

    try {
        const promises = sportKeys.map(sportKey =>
            axios.get(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds`, {
                params: {
                    apiKey,
                    regions,
                    markets,
                    oddsFormat,
                    dateFormat,
                    bookmakers
                }
            }).then(r => {
                console.log(`Successfully fetched odds for ${sportKey}`);
                return {
                    sportKey,
                    data: r.data
                };
            })
        );

        const allOdds = await Promise.all(promises);
        // Creating a structured object with sportKeys as keys for easy front-end consumption
        const structuredOdds = allOdds.reduce((acc, curr) => {
            acc[curr.sportKey] = curr.data;
            return acc;
        }, {});

        res.json(structuredOdds);
    } catch (error) {
        console.error('Error fetching odds:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});