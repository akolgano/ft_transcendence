console.log("GAME OPTION SCRIPT");

document.addEventListener('DOMContentLoaded', function() {
    const pvpButton = document.getElementById('PvPbtn');
    const aiButton = document.getElementById('PvAIbtn');
    const tournamentButton = document.getElementById('tourbtn');

    if (pvpButton) {
        pvpButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent any default button behavior
            btnUrlRoute('/play_gamePvP'); // Call urlRoute with desired URL
        });
    } else {
        console.error("PvP button not found!");
    }

    if (aiButton) {
        aiButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent any default button behavior
            btnUrlRoute('/play_gamePvAI'); // Call urlRoute with desired URL
        });
    } else {
        console.error("AI button not found!");
    }

    if (tournamentButton) {
        tournamentButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent any default button behavior
            btnUrlRoute('/play_gametour'); // Call urlRoute with desired URL
        });
    } else {
        console.error("Tournament button not found!");
    }
});