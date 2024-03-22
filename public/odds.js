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

  container.innerHTML = '';

  let headerBookmakers = data.length > 0 ? data[0].bookmakers.map(bookmaker => bookmaker.title) : [];

  let bookmakerHeaderRow = `<div class="bookmaker-headers"><div>Team</div>${headerBookmakers.map(bookmakerTitle => `<div>${bookmakerTitle}</div>`).join('')}</div>`; // Added "Game Time" as the first column
  container.innerHTML += bookmakerHeaderRow;

  data.forEach(event => {
    if (!event.bookmakers || event.bookmakers.length === 0) return;

    let awayTeamOdds = headerBookmakers.map(bookmakerTitle => {
      let bookmaker = event.bookmakers.find(b => b.title === bookmakerTitle);
      if (!bookmaker) {
        return `<div class="odds-container">N/A</div>`; // If no bookmaker found, now wrapped
      }

      return `<div class="odds-container">${formatBookmakerOdds(bookmaker, marketKey, event.away_team, '', event.id, true)}</div>`; // true for isAwayTeam, now wrapped
    }).join('');

    let homeTeamOdds = headerBookmakers.map(bookmakerTitle => {
      let bookmaker = event.bookmakers.find(b => b.title === bookmakerTitle);
      if (!bookmaker) {
        return `<div class="odds-container">N/A</div>`; // If no bookmaker found, now wrapped
      }

      return `<div class="odds-container">${formatBookmakerOdds(bookmaker, marketKey, event.home_team, '', event.id, false)}</div>`; // false for isAwayTeam (means it's home team), now wrapped
    }).join('');

    // Addition: Including the game start time to the left of each event container.
    let gameTime = event.commence_time ? new Date(event.commence_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "TBD"; 

    let gameContainer = `
        <div class="game-container" style="padding-bottom:20px;">
        <div class="event-container">${event.away_team}${awayTeamOdds}</div>
        <div class="event-container">${event.home_team}${homeTeamOdds}</div>
        <div class="game-container" style="padding-bottom:20px;">
          <div class="game-time-container">${gameTime}</div>
        </div>
    </div>`;// Modified to include game time

    container.innerHTML += gameContainer;
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
    return `<span class="point-number">${selectedOutcome.point}</span><br>${selectedOutcome.price}`;
  } else if (marketKey === 'spreads') {
    // Adding a line break between the spread point and the price
    const outcome = market.outcomes.find(o => o.name === teamName);
    if (!outcome) return ' ';
    return `<span class="point-number">${outcome.point}</span><br>${outcome.price}`;
  } else {
    // For markets other than "totals" and "spreads"
    const outcome = market.outcomes.find(o => o.name === teamName);
    if (!outcome) return ' ';
    return `${outcome.price || 'N/A'}`;
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