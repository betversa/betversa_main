var oddsCache = {
  timestamp: null,
  data: null
};

// JavaScript for controlling dropdown functionality and modal interactions

// Function to show or hide dropdown content
function toggleDropdown(event) {
  const dropdownContent = event.target.nextElementSibling;

  if (!dropdownContent.classList.contains("show")) {
      // Hide any other open dropdowns
      const openDropdowns = document.querySelectorAll('.dropdown-content.show');
      openDropdowns.forEach(dropdown => {
          dropdown.classList.remove("show");
      });

      // Show the clicked dropdown
      dropdownContent.classList.add("show");
  } else {
      // Hide the clicked dropdown
      dropdownContent.classList.remove("show");
  }
}

// Close open dropdowns when clicked outside
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
          }
      }
  }
}

// JavaScript for modal login form interaction
function setupModal() {
  // Safely get the modal and button elements before setting up event listeners
  var modal = document.getElementById("login-form");
  var btn = document.getElementById("login-btn");
  var span = document.getElementsByClassName("close")[0];

  if (btn && modal) {
    // When the user clicks the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }
  }

  if (span && modal) {
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
  }
}

function updateOddsDisplay(data, marketKey) {
  const container = document.getElementById('games-wrapper');
  if (!container || !data) return;

  container.innerHTML = '';
  data.forEach(event => {
      if (!event.bookmakers || event.bookmakers.length === 0) return;
      const bookmaker = event.bookmakers[2]; // Assuming first bookmaker has relevant data
      if (!bookmaker || !bookmaker.markets) return;

      const market = bookmaker.markets.find(m => m.key === marketKey);
      if (market && market.outcomes) {
          let awayOdds, homeOdds;

          if (marketKey === 'h2h') {
              const awayOutcome = market.outcomes.find(o => o.name === event.away_team);
              const homeOutcome = market.outcomes.find(o => o.name === event.home_team);
              if (awayOutcome && homeOutcome) {
                  awayOdds = awayOutcome.price;
                  homeOdds = homeOutcome.price;
              }
          } else if (marketKey === 'spreads') {
              const awayOutcome = market.outcomes.find(o => o.name === event.away_team);
              const homeOutcome = market.outcomes.find(o => o.name === event.home_team);
              if (awayOutcome && homeOutcome) {
                awayOdds = `<span style="color: #FFC72C; font-weight: bold;">${awayOutcome.point}</span> ${awayOutcome.price}`;
                    homeOdds = `<span style="color: #FFC72C; font-weight: bold;">${homeOutcome.point}</span> ${homeOutcome.price}`;
                }
          } else if (marketKey === 'totals') {
              const overOutcome = market.outcomes.find(o => o.name === "Over");
              const underOutcome = market.outcomes.find(o => o.name === "Under");
              if (overOutcome && underOutcome) {
                awayOdds = `<span style="color: #FFC72C; font-weight: bold;">o${overOutcome.point}</span> ${overOutcome.price}`;
                    homeOdds = `<span style="color: #FFC72C; font-weight: bold;">u${underOutcome.point}</span> ${underOutcome.price}`;
                }
          }

          if (awayOdds !== undefined && homeOdds !== undefined) {
              let displayContent = `
              <div class="game-container">
                  <div class="team-info">
                      <p>${event.away_team}</p>
                      <p>${event.home_team}</p>
                  </div>
                  <div class="odds-info">
                      <p>${awayOdds}</p>
                      <p>${homeOdds}</p>
                  </div>
              </div>`;

              const gameElement = document.createElement('div');
              gameElement.innerHTML = displayContent;
              container.appendChild(gameElement);
          }
      }
  });
}


// Fetch and display odds for the selected sport
function fetchAndDisplayOdds() {
  const selectedSportKey = document.getElementById('dropdown1') ? document.getElementById('dropdown1').value : null;
  const selectedMarket = document.getElementById('dropdown2') ? document.getElementById('dropdown2').value : null;

  if (!selectedSportKey || !selectedMarket) return;

  const currentTime = new Date().getTime();

  // Check if cache is valid (5 minutes = 300000 milliseconds)
  if (oddsCache.timestamp && (currentTime - oddsCache.timestamp < 300000) && oddsCache.data) {
      console.log("Using cached data");
      const filteredData = filterDataForDisplay(oddsCache.data, selectedSportKey, selectedMarket);
      updateOddsDisplay(filteredData, selectedMarket);
  } else {
      console.log("Fetching new data");
      fetch(`/api/odds?sportKeys=${selectedSportKey}&markets=${selectedMarket}`)
          .then(response => response.json())
          .then(data => {
              // Update cache with new data and current timestamp
              oddsCache.data = data;
              oddsCache.timestamp = currentTime;
              const filteredData = filterDataForDisplay(data, selectedSportKey, selectedMarket);
              updateOddsDisplay(filteredData, selectedMarket);
          })
          .catch(error => {
              console.error(`Error fetching odds: ${error.message}`);
          });
  }
}
function filterDataForDisplay(data, sportKey, marketKey) {
    const sportData = data[sportKey] || [];
    return sportData;
}
document.addEventListener('DOMContentLoaded', () => {
    setupModal();
    const dropdown1 = document.getElementById('dropdown1');
    const dropdown2 = document.getElementById('dropdown2');
    if (dropdown1) {
        dropdown1.addEventListener('change', fetchAndDisplayOdds);
    }
    if (dropdown2) {
        dropdown2.addEventListener('change', fetchAndDisplayOdds);
    }
    fetchAndDisplayOdds();  // Initial fetch and display
});

function scrollGamesLeft() {
  const gamesWrapper = document.getElementById('games-wrapper');
  gamesWrapper.scrollLeft -= 300; // Adjust the value as needed
}

function scrollGamesRight() {
  const gamesWrapper = document.getElementById('games-wrapper');
  gamesWrapper.scrollLeft += 300; // Adjust the value as needed
}

document.getElementById('scroll-left').addEventListener('click', scrollGamesLeft);
document.getElementById('scroll-right').addEventListener('click', scrollGamesRight);