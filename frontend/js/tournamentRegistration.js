
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

function setUpTournament(players, gameSettings) {
	gameSettings.type = TOURNAMENT;
	gameSettings.nickname = players[0]
	gameSettings.players = players;
	gameSettings.currentGame = SEMI1;
	const draw = shuffleArray(players);
	gameSettings.firstSemi = draw.slice(0, 2);
	gameSettings.secondSemi = draw.slice(2, 4);
	gameSettings.miniFinals = [];
	gameSettings.finals = [];
	gameSettings.scoreUser = 0;
	gameSettings.scoreGuest = 0;
	localStorage.setItem("gameSettings", JSON.stringify(gameSettings));
}

function validateTourUsernames() {
	resetErrorField(".form-error");

	const TournamentForm = document.getElementById("opponentsNameForm")
	const formData = new FormData(TournamentForm)
	const players = [formData.get("user-name"), formData.get("opponent-name-1"), formData.get("opponent-name-2"), formData.get("opponent-name-3")];
	let error = 0;

	players.forEach((player, index) => {
		if (player.length > 20)
		{
			error = 1;
			registrationError("game.max-size", `.tournament-reg-error-${index}`)
		}
		if (index != 0 && player === JSON.parse(localStorage.getItem("user")).username)
		{
			error = 1;
			registrationError("game.reg-same-user", `.tournament-reg-error-${index}`)
		}
		if (!player.match(/^[\p{L}\d_]+$/u))
		{
			error = 1
			registrationError("game.reg-alphanum", `.tournament-reg-error-${index}`)
		}
		if (player != player.trim())
		{
			error = 1
			registrationError("game.trailing-spaces", `.tournament-reg-error-${index}`);
		}
		if (player === "AI")
		{
			error = 1;
			registrationError("game.reg-no-ai", `.tournament-reg-error-${index}`)
		}
	});

	if (hasDuplicates(players))
	{
		error = 1
		registrationError("game.reg-duplicate", ".tournament-reg-error-3")
	}

	if (error)
		return (null);
	return (players);
}

function getTournamentSettings(event) {
	event.preventDefault();
	if (!checkValidToken())
		return;
	localStorage.removeItem("gameSettings")
	let players = validateTourUsernames()
	if (players === null)
		return ;
	let gameSettings = processGameOptions()
	setUpTournament(players, gameSettings);
	urlRoute({ target: { href: '/announceGame' }, preventDefault: () => {} });
}


function registrationFormTournament(params) {
	document.getElementById("user-name").value = JSON.parse(localStorage.getItem("user")).username;
	document.getElementById("opponentsNameForm").addEventListener("submit", getTournamentSettings)
}

registrationFormTournament()
