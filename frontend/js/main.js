//Pong Game Global variables
	let ball, player1, player2, playerAI;
	let players = [], currentRound = 0, tournamentMode = false;  // Declare for tournament
	const canvasTournament = document.getElementById('pongGameCanvasTournament');
	let ctxTournament;

	const canvasAI = document.getElementById('pongGameCanvasAI');
	const canvasPP = document.getElementById('pongGameCanvasPP');

	let activeCanvas;
	let ctx;
	
	let wPressed = false;
	let sPressed = false;
	let ArrowUpPressed = false;
	let ArrowDownPressed = false; 

	let gameOver = false;
	let isPaused = false;
	let readyKickoff = false;      
	let winner = '';
	let gameLoopId = null;

	let isPlayerAI = false;
	let lastUpdateTime = 0;
	let updateInterval = 1000;  // AI "sees" the ball every 1 second
	let predictedY = 200;  // Initialize with the center position

	// Tournament Global variables
	let matchIndex = 0;
	let winners = [];
	let tournamentMatches = [];

	// Game Data Global variables
	let username = "";  // Assume this is dynamically set during login or game start
	let opponent_username = "";  // Assume this is also dynamically set
	let is_ai = false;  // Whether the opponent is AI
	let score = [0, 0];  // Initial score of the game
	let gameStartTime = null;  // To record the start time of the game
	let gameEndTime = null;  // To record the end time of the game
	let progression = [];  // This will hold the progression of the game

const togglePassword = (event) => {
	event.preventDefault()

	let button = event.currentTarget;
	let passwordId = button.getAttribute("data-password-field")
	let passwordField = document.getElementById(passwordId)

	if (passwordField.type == "password") {
		passwordField.type = "text"
		button.innerHTML = translator.translateForKey("auth.password-hide", siteLanguage)
	}
	else {
		passwordField.type = "password"
		button.innerHTML = translator.translateForKey("auth.password-show", siteLanguage)
	}
}

const displayAlert = (key, type) => {
	// Previous alert should be already deleted before, but just to make sure
	removeAlert()
	if (key === null)
		key = "error-fetch";
	const content = document.querySelector("#content");
	const alert = `<div class="alert alert-${type} alert-dismissible fade show position-absolute" role="alert">
	${translator.translateForKey(key, siteLanguage)}
	<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`
	content.insertAdjacentHTML("beforebegin", alert);
}

const removeAlert = () => {
	const alert = document.querySelector(".alert");
	if (alert)
		alert.remove();
}

function checkPasswordMatch() {
	let newPassword = document.getElementById("password").value;
	let repeatPassword = document.getElementById("confirm-password").value;

	if (newPassword !== repeatPassword)
	{
		const errorPassword = document.querySelector(".repeat-password-error");
		let errorTag = document.createElement("p");
		errorTag.innerHTML = translator.translateForKey("auth.password-no-match", siteLanguage);
		errorPassword.appendChild(errorTag);
		return (false);
	}
	return (true);
}

function addErrorToHTML(data) {
	for (const key in data)
	{
		let errorClass;
		if (key == "error" || key == "new_password")
			errorClass = ".password-error";
		else if (key == "old_password")
			errorClass = ".old-password-error"
		else if (key == "detail")
		{
			removeAlert();
			displayAlert("error-fetch", "danger");
			console.log(data)
			return ;
		}
		else
			errorClass = `.${key}-error`;

		const errorDiv = document.querySelector(errorClass);
		if (errorDiv == null)
			return ;

		data[key].forEach(message => {
			let errorTag = document.createElement("p");
			errorTag.innerHTML = message;
			errorDiv.appendChild(errorTag);
		});
	}
}

function resetErrorField() {
	const errorDivs = document.querySelectorAll(".form-error");

	errorDivs.forEach(div => {
		div.innerHTML = ""
	});
}
