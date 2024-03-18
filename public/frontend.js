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

function fetchOdds() {
  fetch('/api/odds')
      .then(response => response.json())
      .then(data => {
          const oddsContainer = document.getElementById('odds-container');
          oddsContainer.innerHTML = ''; // Clear existing content

          data.forEach(event => {
              event.bookmakers.forEach(bookmaker => {
                  bookmaker.markets.forEach(market => {
                      market.outcomes.forEach(outcome => {
                          const row = document.createElement('div');
                          row.classList.add('odds-row');
                          row.innerHTML = `
                              <div class="team">${outcome.name}</div>
                              <div class="odds">${outcome.price}</div>
                          `;
                          oddsContainer.appendChild(row);
                      });
                  });
              });
          });
      })
      .catch(error => console.error('Error fetching live odds:', error));
}

// Call the function to fetch and display the odds
fetchOdds();



