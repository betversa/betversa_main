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
            updateOddsDisplay(data);
        })
        .catch(error => {
            console.error(`Error fetching odds: ${error.message}`);
        });
}

function updateOddsDisplay(data) {
    const container = document.getElementById('games-wrapper');
    if (!container) return;
    container.innerHTML = ''; // Clear existing content

    data.forEach(event => {
        const gameElement = document.createElement('div');
        gameElement.classList.add('game-container');

        const teamsText = `${event.home_team} vs ${event.away_team}`; // Constructed from home_team and away_team

        // Assume `event.bookmakers[0].markets[0].outcomes` contains the odds info you want to display.
        // Adjust indexing as necessary based on the odds information you wish to show.
        const oddsInfo = event.bookmakers[0] && event.bookmakers[0].markets[0].outcomes.map(outcome => `${outcome.name}: ${outcome.price}`).join(', ');

        gameElement.innerHTML = `
            <h3>${teamsText}</h3>
            <p>Odds: ${oddsInfo}</p>
        `;

        container.appendChild(gameElement);
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