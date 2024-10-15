
function startTournamentSequence(playerNames) {
    console.log('Tournament Sequence started:', playerNames);
    // Reset variables
    matchIndex = 0;
    winners = [];
    tournamentMatches = [];
    tournamentMode = true;
    
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
    document.getElementById("nextMatchButton").style.display = "block";
}

function updateTournamentBracket() {
    console.log('Updating Tournament Bracket');
    document.getElementById("gameContainerPP").style.display = "none";
    document.getElementById("gameOverModalTournament").style.display = "none";    
//    const tournamentBracketElement = document.getElementById("tournamentBracket");
    let bracket = "";
    
    if (tournamentMatches.length === 4) {

    // Create matches for Quarter Finals
    bracket = "<div class='quarter-finals'><h3>Quarter Finals</h3>";
    tournamentMatches.forEach((match, index) => {
        let winnerText = winners[index] ? winners[index] : ""; // Set to "TBD" if winner is undefined
        bracket += `
            <div class='match-box'>
                <div class='match-title'>Match ${index + 1}: <br>${match[0]} vs ${match[1]}</div>
                <div class='winner-placeholder'>Winner: ${winnerText}</div>
            </div>
        `;
    });
    bracket += "</div>"; // Close quarter-finals
    
    // Create Semi-Finals section
        bracket += "<div class='semi-finals'><h3>Semi Finals</h3>";
        bracket += `
            <br><br>
            <div class='match-box'>
                <div class='match-title'>Semi-Final 1: <br>Winner Match 1 vs Winner Match 2</div>
                <div class='winner-placeholder'>Winner: <span id='winnerSemi1'></span></div>
            </div>
            <br><br><br><br>            
            <div class='match-box'>
                <div class='match-title'>Semi-Final 2: <br>Winner Match 3 vs Winner Match 4</div>
                <div class='winner-placeholder'>Winner: <span id='winnerSemi2'></span></div>
            </div>
        `;
        bracket += "</div>"; // Close semi-finals
        
    // Create Final section        
        bracket += "<div class='final'><h3>Final</h3>";
        bracket += `
            <br><br><br><br><br><br><br>
            <div class='match-box'>
                <div class='match-title' data-i18n="tour.wsm1vwsm2"></div>
                <div class='winner-placeholder' data-i18n="play.winner">Winner: <span id='winnerFinal'></span></div>
            </div>
        `;
        bracket += "</div>"; // Close final

        if (matchIndex < 4) {
        document.getElementById("nextMatchButton").innerText = `Start Match ${matchIndex + 1}`;
        document.getElementById("matchLabel").textContent = `Quarter-Final Match ${matchIndex + 1}`;
        console.log(document.getElementById("matchLabel").textContent);
        } else if (matchIndex === 4) {
        document.getElementById("nextMatchButton").innerText = `Proceed to Semi-Final`;           
        }
    }   
    
    else if (tournamentMatches.length === 2) {
        bracket = "<div class='semi-finals'><h3>Semi Finals</h3>";
    
        // Create matches for Semi-Finala
        tournamentMatches.forEach((match, index) => {
            let winnerText = winners[index] ? winners[index] : ""; // Set to "TBD" if winner is undefined
            bracket += `
                <div class='match-box'>
                    <div class='match-title'>Semi-Final ${index + 1}: <br>${match[0]} vs ${match[1]}</div>
                    <div class='winner-placeholder'>Winner: ${winnerText}</div>
                </div>
            `;
        });    
        bracket += "</div>"; // Close semi-finals
        
        // Create Final sections
            bracket += "<div class='final'><h3>Final</h3>";
            bracket += `
                <br>
                <div class='match-box'>
                    <div class='match-title'>Winner Semi-Final 1<br>vs<br>Winner Semi-Final 2</div>
                    <div class='winner-placeholder'>Winner: <span id='winnerFinal'></span></div>
                </div>
            `;
            bracket += "</div>"; // Close final

            if (matchIndex < 2) {
                document.getElementById("nextMatchButton").innerText = `Start Semi-Final ${matchIndex + 1}`;
                document.getElementById("matchLabel").textContent = `Semi-Final ${matchIndex + 1}`;
                console.log(document.getElementById("matchLabel").textContent);
                } else {
                document.getElementById("nextMatchButton").innerText = `Proceed to Final`;           
                }            
    }   else if (tournamentMatches.length === 1) {
        bracket = "<div class='final'><h3>Final</h3>";
        
        // Create matches for Final
        tournamentMatches.forEach((match, index) => {
            let winnerText = winners[index] ? winners[index] : ""; // Set to "TBD" if winner is undefined
            bracket += `
                <div class='match-box'>
                    <div class='match-title'>${match[0]} vs ${match[1]}</div>
                    <div class='winner-placeholder'>Overall Winner: ${winnerText}</div>
                </div>
            `;
        });
            bracket += "</div>"; // Close final 
            
            if (matchIndex < 1) {
                document.getElementById("nextMatchButton").innerText = `Start Final!`;
                document.getElementById("matchLabel").textContent = `Grand Final!`;
                console.log(document.getElementById("matchLabel").textContent);
                } else {
                document.getElementById("nextMatchButton").innerText = `Exit Tournament`;           
                }       
    }
    document.getElementById("tournamentBracket").innerHTML = bracket;
    document.getElementById("tournamentContainer").style.display = "block";
}

// Start the next match in the tournament
function startNextMatch() {
    if (matchIndex < tournamentMatches.length) {
        let match = tournamentMatches[matchIndex];
        let ply1 = match[0];
        let ply2 = match[1];
        // Call PvP mode, passing the current players
        startPvP(ply1, ply2);
    } else if (winners.length > 1) {
        // print current round winners before moving to next round
        
        // Move to the next round with winners
        tournamentMatches = [];
        for (let i = 0; i < winners.length; i += 2) {
            tournamentMatches.push([winners[i], winners[i + 1]]);
        }
        winners = [];
        matchIndex = 0;
        updateTournamentBracket();
        document.getElementById("nextMatchButton").style.display = "block";
    } else {
        // Tournament over, we have a winner
        document.getElementById("winner-name-tour").innerText = winners[0];
        showTournamentOverModal();
    }
}

function showTournamentOverModal() {
        const tournamentOverModal = document.querySelector('.tournament-over-modal');
        tournamentOverModal.style.display = 'block'; 
        const winnerName = document.getElementById('winner-name-tour');
        winnerName.textContent = winner;
        tournamentMode = false;
    }

async function startPvP(ply1, ply2) {
    // This function should start a PvP match between the two players
    console.log(`Starting match between ${ply1} and ${ply2}`);
    document.getElementById("tournamentContainer").style.display = "none";    
    startPlayerVsPlayer(ply1, ply2)
}