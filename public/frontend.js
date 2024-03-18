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

// frontend.js
// Function to fetch live odds from your backend server
function fetchOdds() {
    fetch('/api/odds')
        .then(response => response.json())
        .then(data => {
            const oddsContainer = document.getElementById('odds-container');
            oddsContainer.innerHTML = ''; // Clear existing content

            data.forEach(sportOdds => {
                sportOdds.forEach(event => {
                    const row = document.createElement('div');
                    row.classList.add('odds-row');
                    row.innerHTML = `
                        <div class="team">${event.home_team} vs ${event.away_team}</div>
                        <div class="odds">${event.bookmakers[0].markets[0].outcomes[0].price}</div>
                    `;
                    oddsContainer.appendChild(row);
                });
            });
        })
        .catch(error => console.error('Error fetching live odds:', error));
}

// Call the function to fetch and display the odds
fetchOdds();

