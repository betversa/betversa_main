
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

// Fetch and display odds for the selected sport
function fetchAndDisplayOdds() {
    const selectedSportKey = document.getElementById('dropdown1') ? document.getElementById('dropdown1').value : null;
    const selectedMarket = document.getElementById('dropdown2') ? document.getElementById('dropdown2').value : null;

    if (!selectedSportKey || !selectedMarket) return;

    const queryParams = `sportKeys=${selectedSportKey}&market=${selectedMarket}`;

    fetch(`/api/odds?${queryParams}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateOddsDisplay(data[selectedSportKey], selectedMarket);
        })
        .catch(error => {
            console.error(`Error fetching odds: ${error.message}`);
        });
}

function updateOddsDisplay(data, marketKey) {
    const container = document.getElementById('games-wrapper');
    // Clear existing content
    if (!container || !data) return;
    container.innerHTML = '';

    data.forEach(event => {
        // Filter the bookmakers' markets by the selected market key
        const markets = event.bookmakers.map(bookmaker => {
            const market = bookmaker.markets.find(market => market.key === marketKey);
            return market ? { bookmaker: bookmaker.title, market: market } : null;
        }).filter(market => market !== null);

        // Ensure we have market data to display
        if (markets.length > 0) {
            const gameElement = document.createElement('div');
            gameElement.classList.add('game-container');
            gameElement.innerHTML = `<h4>${event.home_team} vs ${event.away_team}</h4>
                                     ${markets.map(marketInfo =>
                                        `<p>${marketInfo.bookmaker}: ${marketInfo.market.outcomes.map(outcome =>
                                            `${outcome.name} ${outcome.price}`).join(', ')}</p>`
                                     ).join('')}`;
            container.appendChild(gameElement);
        }
    });
}

// Handle scrolling of games list
function setupScrollButtons() {
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');
    const gamesWrapper = document.getElementById('games-wrapper');
    if (scrollLeftBtn && gamesWrapper) {
        scrollLeftBtn.addEventListener('click', function() {
            gamesWrapper.scrollLeft -= 300;
        });
    }

    if (scrollRightBtn && gamesWrapper) {
        scrollRightBtn.addEventListener('click', function() {
            gamesWrapper.scrollLeft += 300;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupModal();
    // Ensure dropdown elements exist before adding event listeners
    const dropdown1 = document.getElementById('dropdown1');
    const dropdown2 = document.getElementById('dropdown2');
    if (dropdown1) {
        dropdown1.addEventListener('change', fetchAndDisplayOdds);
    }
    if (dropdown2) {
        dropdown2.addEventListener('change', fetchAndDisplayOdds);
    }

    setupScrollButtons();
    fetchAndDisplayOdds(); // Initial fetch and display
});