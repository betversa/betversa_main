var oddsCache = {
  timestamp: null,
  data: null
};

function toggleDropdown(event) {
  const dropdownContent = event.target.nextElementSibling;
  if (!dropdownContent.classList.contains("show")) {
      const openDropdowns = document.querySelectorAll('.dropdown-content.show');
      openDropdowns.forEach(dropdown => {
          dropdown.classList.remove("show");
      });
      dropdownContent.classList.add("show");
  } else {
      dropdownContent.classList.remove("show");
  }
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (var i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
          }
      }
  }
}

function setupModal() {
  var modal = document.getElementById("login-form");
  var btn = document.getElementById("login-btn");
  var span = document.getElementsByClassName("close")[0];

  if (btn && modal) {
    btn.onclick = function() {
        modal.style.display = "block";
    }
  }

  if (span && modal) {
    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
  }
}

function updateOddsDisplay(data, marketKey) {
    const container = document.getElementById('odds-grid');
    if (!container || !data) return;

    container.innerHTML = ''; // Clear any existing content

    // Create a header container
    let headerRow = document.createElement('div');
    headerRow.className = 'header-row';

    // Create a div for 'Team' header
    let teamHeader = document.createElement('div');
    teamHeader.innerText = 'Team';
    headerRow.appendChild(teamHeader);

    // Ensure Pinnacle is first, if it's present
    const pinnacleIndex = data[0].bookmakers.findIndex(b => b.title === "Pinnacle");
    if (pinnacleIndex > -1) {
        // Move Pinnacle to the front of the array
        const pinnacleBookmaker = data[0].bookmakers.splice(pinnacleIndex, 1)[0];
        data[0].bookmakers.unshift(pinnacleBookmaker);
    }

    // Add bookmakers' headers
    data[0].bookmakers.forEach(bookmaker => {
        let bookmakerHeader = document.createElement('div');
        bookmakerHeader.className = 'bookmaker-header';
        bookmakerHeader.innerHTML = `
            <img src="images/logos/${bookmaker.title.toLowerCase().replace(/\s+/g, '') + '.png'}" alt="${bookmaker.title}" class="bookmaker-logo">
            <span class="bookmaker-name">${bookmaker.title}</span>`;
        headerRow.appendChild(bookmakerHeader);
    });
    container.appendChild(headerRow);

    // Generate rows for each event
    data.forEach(event => {
        // Create a container for each event
        let eventContainer = document.createElement('div');
        eventContainer.className = 'event-container';

        // Add a row for each team in the event
        [event.away_team, event.home_team].forEach((team, index) => {
            let teamRow = document.createElement('div');
            teamRow.className = 'team-row';

            // Team name cell
            let teamNameDiv = document.createElement('div');
            teamNameDiv.innerText = team;
            teamRow.appendChild(teamNameDiv);

            // Find the best odds for the current team
            let bestOdds = Math.max(...event.bookmakers.map(bookmaker => {
                const market = bookmaker.markets.find(m => m.key === marketKey);
                if (market) {
                    const outcome = market.outcomes.find(o => o.name === team);
                    return outcome ? parseFloat(outcome.price) : 0;
                }
                return 0;
            }));

            // Add cells for bookmaker odds, with Pinnacle's odds first
            event.bookmakers.forEach(bookmaker => {
                let oddsDiv = document.createElement('div');
                oddsDiv.className = 'odds-value';
                let isAwayTeam = index === 0;
                let oddsValue = formatBookmakerOdds(bookmaker, marketKey, team, '', event.id, isAwayTeam);

                // Highlight the best odds in green
                if (parseFloat(oddsValue) === bestOdds) {
                    oddsDiv.classList.add('best-odds');
                }

                oddsDiv.innerHTML = oddsValue;
                teamRow.appendChild(oddsDiv);
            });

            eventContainer.appendChild(teamRow);
        });

        container.appendChild(eventContainer);
    });
}



// This assumes that createTeamRow function creates a row for a single team.
function createMatchupRows(event, marketKey) {
  let matchupContainer = document.createElement('div');
  matchupContainer.className = 'matchup-container';

  let awayTeamRow = createTeamRow(event, marketKey, event.away_team);
  awayTeamRow.classList.add('team-row');
  matchupContainer.appendChild(awayTeamRow);

  let homeTeamRow = createTeamRow(event, marketKey, event.home_team);
  homeTeamRow.classList.add('team-row', 'last-row'); // Add 'last-row' to home team for styling
  matchupContainer.appendChild(homeTeamRow);

  return matchupContainer;
}



function getTeamOdds(headerBookmakers, event, marketKey, teamName, isAwayTeam) {
  return headerBookmakers.map(bookmakerTitle => {
    let bookmaker = event.bookmakers.find(b => b.title === bookmakerTitle);
    if (!bookmaker) {
      return `<div class="odds-value">N/A</div>`; // If no bookmaker found
    }
    let odds = formatBookmakerOdds(bookmaker, marketKey, teamName, '', event.id, isAwayTeam);
    return `<div class="odds-value">${odds}</div>`;
  });
}


function formatBookmakerOdds(bookmaker, marketKey, teamName, prefix = '', gameId, isAwayTeam = false) {
    // Ensure bookmaker markets are defined
    if (!bookmaker.markets) return ' ';

    // Find the market by key
    const market = bookmaker.markets.find(m => m.key === marketKey);
    if (!market || !market.outcomes) return ' ';

    if (marketKey === 'totals') {
        // For the "totals" market, use "Over" odds for the away team and "Under" odds for the home team
        const overOutcome = market.outcomes.find(o => o.name === "Over");
        const underOutcome = market.outcomes.find(o => o.name === "Under");
        if (!overOutcome || !underOutcome) return ' ';

        // Select "Over" for away team and "Under" for home team
        const selectedOutcome = isAwayTeam ? overOutcome : underOutcome;
        const prefix = isAwayTeam ? "o" : "u";
        return `<div class="odds-container"><span class="point-number">${prefix}${selectedOutcome.point}</span><br><span class="price-number">${selectedOutcome.price}</span></div>`;
    } else if (marketKey === 'spreads') {
        // For the "spreads" market
        const outcome = market.outcomes.find(o => o.name === teamName);
        if (!outcome) return ' ';
        return `<div class="odds-container"><span class="point-number">${outcome.point}</span><br><span class="price-number">${outcome.price}</span></div>`;
    } else {
        // For markets other than "totals" and "spreads"
        const outcome = market.outcomes.find(o => o.name === teamName);
        if (!outcome) return ' ';
        return `<div class="odds-container">${outcome.price || 'N/A'}</div>`;
    }
}





function fetchAndDisplayOdds() {
  const selectedSportKey = document.getElementById('dropdown3') ? document.getElementById('dropdown3').value : null;
  const selectedMarket = document.getElementById('dropdown4') ? document.getElementById('dropdown4').value : null;

  if (!selectedSportKey || !selectedMarket) return;

  const currentTime = new Date().getTime();
  if (oddsCache.timestamp && (currentTime - oddsCache.timestamp < 300000) && oddsCache.data) {
      console.log("Using cached data");
      const filteredData = filterDataForDisplay(oddsCache.data, selectedSportKey, selectedMarket);
      updateOddsDisplay(filteredData, selectedMarket);
  } else {
      console.log("Fetching new data");
      fetch(`/api/odds?sportKeys=${selectedSportKey}&markets=${selectedMarket}`)
          .then(response => response.json())
          .then(data => {
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
    fetchAndDisplayOdds();
});