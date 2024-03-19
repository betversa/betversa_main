// Dropdown functionality
var dropdowns = document.getElementsByClassName("dropdown-content");
var i;

for (i = 0; i < dropdowns.length; i++) {
    dropdowns[i].parentNode.addEventListener("click", function() {
        this.classList.toggle("show");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
    });
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.header-link')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
}

// Get all the elements with the class "header-link-container"
var dropdowns = document.getElementsByClassName("header-link-container");

// Loop through the elements and add an event listener to each
for (var i = 0; i < dropdowns.length; i++) {
    dropdowns[i].addEventListener('click', function(event) {
        // Prevent the default action of the link
        event.preventDefault();

        // Get the dropdown content of the clicked element
        var dropdownContent = this.getElementsByClassName("dropdown-content")[0];

        // Toggle the display of the dropdown content
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
    });
}

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
  const selectedMarket = document.getElementById('dropdown2').value;
  fetch('/api/odds')
      .then(response => response.json())
      .then(data => {
          const gamesWrapper = document.getElementById('games-wrapper');
          gamesWrapper.innerHTML = ''; // Clear existing content

          data.forEach(event => {
              const gameContainer = document.createElement('div');
              gameContainer.classList.add('game-container');

              const marketIndex = event.bookmakers[0].markets.findIndex(market => market.key === selectedMarket);

              if (marketIndex !== -1) {
                  const awayTeam = document.createElement('div');
                  awayTeam.classList.add('team', 'away');
                  awayTeam.innerHTML = formatTeamOdds(event.away_team, event.bookmakers[0].markets[marketIndex].outcomes[0], selectedMarket);
                  gameContainer.appendChild(awayTeam);

                  const homeTeam = document.createElement('div');
                  homeTeam.classList.add('team', 'home');
                  homeTeam.innerHTML = formatTeamOdds(event.home_team, event.bookmakers[0].markets[marketIndex].outcomes[1], selectedMarket);
                  gameContainer.appendChild(homeTeam);
              }

              gamesWrapper.appendChild(gameContainer);
          });
      })
      .catch(error => console.error('Error fetching live odds:', error));
}

function formatTeamOdds(teamName, outcome, market) {
    let oddsText = `${teamName} `;

    if (market === 'spreads' || market === 'totals') {
        oddsText += `
            <div class="odds-point">${outcome.point}</div>
            <div class="odds-price">${outcome.price}</div>
        `;
    } else {
        oddsText += `<div class="odds-price">${outcome.price}</div>`;
    }

    return oddsText;
}


// Initial call to populate the odds
fetchOdds();





// Optional: Set an interval to refresh odds every 5 minutes
setInterval(fetchOdds, 300000); // 300000 milliseconds = 5 minutes

function scrollGamesLeft() {
    document.getElementById('games-wrapper').scrollLeft -= 300; // Adjust the scroll amount as needed
}

function scrollGamesRight() {
    document.getElementById('games-wrapper').scrollLeft += 300; // Adjust the scroll amount as needed
}


