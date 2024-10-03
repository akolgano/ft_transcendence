let currentMatchIndex = 0;
let winners = [];
let tournamentMatches = [];

function startTournamentSequence(playerNames) {
    // Reset variables
    currentMatchIndex = 0;
    winners = [];
    tournamentMatches = [];
    
    // Check if playerNames is 4 or 8
    if (playerNames.length !== 4 && playerNames.length !== 8) {
        console.error("The tournament can only start with 4 or 8 players.");
        return;
    }

    // Generate initial matchups for the first round
    for (let i = 0; i < playerNames.length; i += 2) {
        tournamentMatches.push([playerNames[i], playerNames[i + 1]]);
    }

    // Show tournament bracket diagram (simple text version, you can enhance it with actual HTML and CSS)
    updateTournamentBracket();

    // Display "Start Match" button to begin the first match
    document.getElementById("startMatchButton").style.display = "block";
}

function updateTournamentBracket() {
    let bracket = "";
    tournamentMatches.forEach((match, index) => {
        bracket += `Match ${index + 1}: ${match[0]} vs ${match[1]}<br>`;
    });
    document.getElementById("tournamentBracket").innerHTML = bracket;
}

// Start the next match in the tournament
function startNextMatch() {
    if (currentMatchIndex < tournamentMatches.length) {
        let match = tournamentMatches[currentMatchIndex];
        let player1 = match[0];
        let player2 = match[1];

        // Call PvP mode, passing the current players
        startPvP(player1, player2);
    } else if (winners.length > 1) {
        // Move to the next round with winners
        tournamentMatches = [];
        for (let i = 0; i < winners.length; i += 2) {
            tournamentMatches.push([winners[i], winners[i + 1]]);
        }
        winners = [];
        currentMatchIndex = 0;
        updateTournamentBracket();
        document.getElementById("startMatchButton").style.display = "block";
    } else {
        // Tournament over, we have a winner
        document.getElementById("winner-name-tournament").innerText = winners[0];
        document.getElementById("tournamentOverModal").style.display = "block";
    }
}

// function startPvP(player1, player2) {
//     // This function should start a PvP match between the two players
//     console.log(`Starting match between ${player1} and ${player2}`);
    
//     // Simulate the match for now (you would replace this with your actual game logic)
//     setTimeout(() => {
//         // Randomly pick a winner for demo purposes
//         let winner = Math.random() > 0.5 ? player1 : player2;
//         console.log(`Winner is ${winner}`);
//         winners.push(winner);
//         currentMatchIndex++;
//         startNextMatch();
//     }, 2000); // Simulated delay for the match
// }