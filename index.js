const cors = require('cors');
const express = require('express');
const axios = require('axios');
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

// API endpoint to fetch odds
app.get('/api/odds', async (req, res) => {
    const sportKeys = req.query.sportKeys ? req.query.sportKeys.split(',') : [];

    if (sportKeys.length === 0) {
        console.error('No sport keys provided');
        return res.status(400).send('No sport keys provided');
    }

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
                return r.data;
            })
        );

        const allOdds = await Promise.all(promises);
        res.json([].concat(...allOdds));
    } catch (error) {
        console.error('Error fetching odds:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});