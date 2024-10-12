	function startTournament() {
		document.getElementById('gameOptions').style.display = 'none';
		// Hide the player name form
    	document.getElementById('playerNameForm').style.display = 'none';
		document.getElementById('tourOptions').style.display = 'block';
	}

	function getPlayerName(playerCount) {
	    // Hide tournament options and show the player name form
	    document.getElementById('tourOptions').style.display = 'none';
	    document.getElementById('playerNameForm').style.display = 'block';
	    
	    // Get the form element
	    const form = document.getElementById('playerForm');
	    
	    // Clear any existing input fields
	    form.innerHTML = '';
	    
	    // Dynamically create input fields for the number of players
	    for (let i = 1; i <= playerCount; i++) {
		const div = document.createElement('div');
		div.classList.add('form-row');

		const label = document.createElement('label');
		label.for = `player${i}`;
		label.textContent = `Player ${i}:`;

		const input = document.createElement('input');
		input.type = 'text';
		input.placeholder = `Enter Player ${i} Name`;
		input.id = `player${i}`;
		input.name = `player${i}`;

		div.appendChild(label);
		div.appendChild(input);
		form.appendChild(div);
	    }
	}

	function finalisePlayer() {
	    const form = document.getElementById('playerForm');
	    const playerNames = [];
	    
	    // Collect all the player names by iterating over form elements
	    // Only consider input elements (ignore other elements like <br>, <label>)
	    const inputs = form.querySelectorAll('input');
	    
	    inputs.forEach(input => {
		if (input.value.trim() !== '') {  // Ensure that the name is not an empty string
		    playerNames.push(input.value.trim());
		}
	    });
	    
	    // Check if we have all the player names
	    if (playerNames.length === inputs.length) {
		console.log('Starting tournament with players:', playerNames);
		// Call the function to start the tournament with the collected player names
	    document.getElementById('playerNameForm').style.display = "none";
		startTournamentSequence(playerNames);
	    } else {
		alert('Please enter names for all players.');
	    }
	}