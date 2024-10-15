console.log("TOURNAMENT OPTION SCRIPT");

document.addEventListener('DOMContentLoaded', function() {
    const retnMenuButton1 = document.getElementById('retnMenubtn1');
    const retnMenuButton2 = document.getElementById('retnMenubtn2');

    if (retnMenuButton1) {
        retnMenuButton1.addEventListener('click', function(event) {
            btnUrlRoute('/play.html'); // URL for PvP
        });
    } else {
        console.error("Return Menu button not found!");
    }

    if (retnMenuButton2) {
        retnMenuButton2.addEventListener('click', function(event) {
            btnUrlRoute('/play.html'); // URL for PvP
        });
    } else {
        console.error("Return Menu button not found!");
    }
});
