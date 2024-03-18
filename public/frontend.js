// JavaScript for modal login form...
var modal = document.getElementById("login-form");
var btn = document.getElementById("login-btn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Function to fetch live odds and display them in the odds container
function fetchOdds() {
    fetch('/api/odds')
        .then(response => response.json())
        .then(data => {
            const oddsContainer = document.getElementById('odds-container');
            oddsContainer.innerHTML = ''; // Clear existing content

            data.forEach(event => {
                event.bookmakers.forEach(bookmaker => {
                    bookmaker.markets.forEach(market => {
                        // Create a row for the away team
                        const awayRow = document.createElement('div');
                        awayRow.classList.add('odds-row');
                        awayRow.innerHTML = `
                            <div class="team">${event.away_team}</div>
                            <div class="odds">${market.outcomes.find(outcome => outcome.name === event.away_team).price}</div>
                            <div
                        `;
                        oddsContainer.appendChild(awayRow);

                        // Create a row for the home team
                        const homeRow = document.createElement('div');
                        homeRow.classList.add('odds-row');
                        homeRow.innerHTML = `
                            <div class="team">${event.home_team}</div>
                            <div class="odds">${market.outcomes.find(outcome => outcome.name === event.home_team).price}</div>
                        `;
                        oddsContainer.appendChild(homeRow);

                        // Add a separator line
                        const separator = document.createElement('hr');
                        oddsContainer.appendChild(separator);
                    });
                });
            });
        })
        .catch(error => console.error('Error fetching live odds:', error));
}

// Call the function to fetch and display the odds initially
fetchOdds();

// Set an interval to update the odds every 5 minutes (300000 milliseconds)
setInterval(fetchOdds, 300000);




