
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));

		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
 }

function addErrorForm(message, selector){
	let errorTag = document.createElement("p");
	errorTag.innerHTML = message;
	document.querySelector(selector).appendChild(errorTag);
}

function setUpTournament(players) {
	gameData.players = players;
	gameData.currentGame = SEMI1;
	const draw = shuffleArray(players);
	gameData.firstSemi = draw.slice(0, 2);
	gameData.secondSemi = draw.slice(2, 4);
	gameData.miniFinals = [];
	gameData.finals = [];
	gameData.nickname = players[0]
}

function validateTourUsernames(event) {
	event.preventDefault();
	resetErrorField();

	const TournamentForm = document.getElementById("opponentsNameForm")
	const formData = new FormData(TournamentForm)
	const players = [formData.get("user-name"), formData.get("opponent-name-1"), formData.get("opponent-name-2"), formData.get("opponent-name-3")];

	players.forEach((player, index) => {
		if (index != 0 && player === JSON.parse(localStorage.getItem("user")).username)
			addErrorForm("Game name cannot be the username of the user", `.tournament-reg-error-${index}`)
		else if (!player.match(/^[0-9a-zA-Z]+$/))
			addErrorForm("Game name has to be alphanumeric", `.tournament-reg-error-${index}`)
		else if (player === "AI")
			addErrorForm("I know you are not AI.", `.tournament-reg-error-${index}`)
	});

	if (hasDuplicates(players))
		return (addErrorForm("Each user needs a different game name", ".tournament-reg-error-3"))

	setUpTournament(players);
	urlRoute({ target: { href: '/announceGame' }, preventDefault: () => {} });
}


function registrationFormTournament(params) {
	document.getElementById("user-name").value = JSON.parse(localStorage.getItem("user")).username;
	document.getElementById("opponentsNameForm").addEventListener("submit", validateTourUsernames)
}

registrationFormTournament()
