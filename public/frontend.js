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
      let displayContent = `
      <div style="display: flex; justify-content: space-between; width: 100%;">
        <div class="team-names">
          <p>${event.away_team}</p>
          <p>${event.home_team}</p>
        </div>`;
      const bookmaker = event.bookmakers[0]; // Assuming first bookmaker has relevant data
      if (marketKey === 'h2h') {
          const outcomes = bookmaker.markets.find(m => m.key === 'h2h').outcomes;
          displayContent += `<div class="market-info">${outcomes[1].price} vs ${outcomes[0].price}</div>`; // Changed to display away odds on top of home odds
      } else if (marketKey === 'spreads') {
          const outcomes = bookmaker.markets.find(m => m.key === 'spreads').outcomes;
          displayContent += `<div class="market-info">${outcomes[1].point} ${outcomes[1].price} vs ${outcomes[0].point} ${outcomes[0].price}</div>`; // Changed to display away odds on top of home odds
      } else if (marketKey === 'totals') {
          const outcomes = bookmaker.markets.find(m => m.key === 'totals').outcomes;
          displayContent += `<div class="market-info">Total: Over/Under ${outcomes[0].point}, Price: ${outcomes[1].price} or ${outcomes[0].price}</div>`; // Modified for consistency, although direction doesn't apply
      }
      displayContent += `</div>`;

      const gameElement = document.createElement('div');
      gameElement.classList.add('game-container');
      gameElement.innerHTML = displayContent;
      container.appendChild(gameElement);
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

document.getElementById('scroll-btn left').addEventListener('click', scrollGamesLeft);
document.getElementById('scroll-btn right').addEventListener('click', scrollGamesRight);

