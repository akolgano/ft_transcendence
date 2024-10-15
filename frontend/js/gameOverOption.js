console.log("GAME OVER OPTION SCRIPT");

document.addEventListener('DOMContentLoaded', function() {
    const retnMenuButton = document.getElementById('retnMenubtn');

    if (retnMenuButton) {
        retnMenuButton.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent any default button behavior
            btnUrlRoute('/play.html'); // URL for PvP
        });
    } else {
        console.error("Return Menu button not found!");
    }
});
