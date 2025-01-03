{
// --------------------------------------------- SET UP -------------------------------------------------
	let board;
	let boardWidth = 800;
	let boardHeight = 500;
	let context;
	let playerHeight = 55;

	let playerWidth = 10;
	let playerVelocityY = 0;

	let ballWidth = 10;
	let ballHeight = 10;

	let gameLoopId;
	let computerLevel = 0.95;
	let hitLast = false;
	let powerLast = false;

	let ball = {
		x : boardWidth / 2,
		y : boardHeight / 2,
		width: ballWidth,
		height: ballHeight,
		velocityX: -2.5,
		velocityY: 2.5,
	}

	let playerUser = {
		x: 0,
		y : boardHeight / 2,
		width: playerWidth,
		velocityY: playerVelocityY,
		score: 0
	}

	let playerGuest = {
		x: boardWidth - playerWidth - 0,
		y : boardHeight / 2,
		width: playerWidth,
		velocityY: playerVelocityY,
		score: 0
	}

	let progression;
	let timeStart;
	let duration;
	let intervalID = null;
	let gameSettings;

	// Game customizations
	let powerUp = 0;
	let powerUpStart;
	let oldSpeedX;
	let oldSpeedY;

	let predictedBallPosition = -1;
	let lastTime = 0;
	const FRAME_RATE = 60;
	const FRAME_TIME = 1000 / FRAME_RATE
	let accumulatedTime = 0;

// --------------------------------------------- END GAME -------------------------------------------------

	function stopGame() {
		if (gameLoopId) {

			cancelAnimationFrame(gameLoopId);
			gameLoopId = null
		}
		if (intervalID) {
			clearInterval(intervalID)
			intervalID = null;
		}
		document.removeEventListener("keyup", startGame)
		window.removeEventListener("popstate", stopGame)
		document.removeEventListener("keyup", movePlayerOnce);
		document.removeEventListener("keydown", movePlayerContinuous);
		document.querySelectorAll("a").forEach(link => {
			link.removeEventListener("click", stopGame)
		})
	}

	function getDuration() {
		let end_time = new Date();
		let distance = (end_time - timeStart);
		const hours = Math.floor(distance / 3600000);
		distance -= hours * 3600000;
		const minutes = Math.floor(distance / 60000);
		distance -= minutes * 60000;
		const seconds = Math.floor(distance / 1000);
		duration = `${hours}:${minutes}:${seconds}`
	}

	function popModal() {
		if (document.querySelector("body").classList.contains("modal-open"))
			document.querySelector("body").classList.remove("modal-open")
		if (document.querySelector(".modal-backdrop"))
			document.querySelector(".modal-backdrop").remove();
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';
		removeEventListener('popstate', popModal)
	}


	function endSimpleGame(winner, looser) {

		if (intervalID) {
			clearInterval(intervalID)
			intervalID = null;
		}
		getDuration()
		if (playerGuest.name === "AI" && playerUser.score < playerGuest.score)
		{
			const modalElem = document.querySelector(".modalEndOfGameAIWOn")
			const modal = new bootstrap.Modal(modalElem);
			document.querySelector(".ai-score").innerText = `${playerUser.score} - ${playerGuest.score}`
			document.querySelector(".play-again-ai").addEventListener("click", () => {modal.hide()})
			modal.show()
			window.addEventListener('popstate', popModal);
			modalElem.addEventListener('hide.bs.modal', () => {
				removeEventListener('popstate', popModal)
				urlRoute({ target: { href: "/gameRegistration" }, preventDefault: () => {} });
			});
		}
		else
		{
			const modalElem = document.querySelector(".modalEndOfGame")
			const modal = new bootstrap.Modal(modalElem);
			document.querySelector(".modalEndOfGame").style.display = "block"
			document.querySelector(".modal-title-winner").innerText = winner
			document.querySelector(".modal-score").innerText = `${playerUser.score} - ${playerGuest.score}`
			document.querySelector(".modal-looser").innerText = looser
			document.querySelector(".play-again").addEventListener("click", () => {modal.hide()})
			modal.show()
			window.addEventListener('popstate', popModal);
			modalElem.addEventListener('hide.bs.modal', () => {
				removeEventListener('popstate', popModal)
				urlRoute({ target: { href: "/gameRegistration" }, preventDefault: () => {} });
			});
		}
		sendSimpleGameData(playerGuest.name, playerUser.score, playerGuest.score, duration, gameSettings.progression);
		localStorage.removeItem("gameSettings");
		gameSettings = null;
	}

	function endTournament(winner, looser) {
		gameSettings.scoreUser = 0;
		gameSettings.scoreGuest = 0;
		if (gameSettings.powerUp)
		{
			gameSettings.powerUpGuest = 3
			gameSettings.powerUpUser = 3
		}
		switch (gameSettings.currentGame) {

			case SEMI1:
				gameSettings.finals.push(winner);
				gameSettings.miniFinals.push(looser);
				gameSettings.currentGame = SEMI2;
				break;
			case SEMI2:
				gameSettings.finals.push(winner);
				gameSettings.miniFinals.push(looser);
				gameSettings.currentGame = MINIFINALS;
				break;
			case MINIFINALS:
				gameSettings.third = winner;
				gameSettings.fourth = looser;
				gameSettings.currentGame = FINALS;
				break;
			case FINALS:
				gameSettings.first = winner;
				gameSettings.second = looser;
				gameSettings.currentGame = null;
				sendTournamentData([gameSettings.first, gameSettings.second, gameSettings.third, gameSettings.fourth], gameSettings.nickname)
				break;
			default:
				break;
		}
		localStorage.setItem("gameSettings", JSON.stringify(gameSettings));
		urlRoute({ target: { href: "/announceGame" }, preventDefault: () => {} });
	}

	function endOfGame() {
		const winner = playerGuest.score > playerUser.score ? playerGuest.name : playerUser.name
		const looser = (winner == playerGuest.name ? playerUser.name : playerGuest.name)
		if (!checkValidToken())
			return;
		if (gameSettings.type == SIMPLE_GAME)
			endSimpleGame(winner, looser);
		else if (gameSettings.type == TOURNAMENT)
			endTournament(winner, looser);
		else
		document.removeEventListener("keyup", movePlayerOnce);
		document.removeEventListener("keydown", movePlayerContinuous);
		document.querySelectorAll("a").forEach(link => {
			link.removeEventListener("click", stopGame)
		})
	}

// --------------------------------------------- START GAME -------------------------------------------------

	function startGame(event) {
		if (event.code !== "Space")
			return ;

		document.removeEventListener("keyup", startGame)
		if (playerGuest.name === "AI")
			intervalID = setInterval(playerAI, 1000);
		gameLoopId = requestAnimationFrame(update)

		if (gameSettings.type === SIMPLE_GAME)
			timeStart = new Date();
		document.querySelector(".space-start").remove()
		document.addEventListener("keyup", movePlayerOnce)
		document.addEventListener("keydown", movePlayerContinuous)
	}

	function prepareGame() {
		playerUser.name = JSON.parse(localStorage.getItem("user")).username;
		playerGuest.name = gameSettings.guestName;
	}

	function prepareTournament() {
		switch (gameSettings.currentGame) {
			case SEMI1:
				playerUser.name = gameSettings.firstSemi[0];
				playerGuest.name = gameSettings.firstSemi[1];
				break;
			case SEMI2:
				playerUser.name = gameSettings.secondSemi[0];
				playerGuest.name = gameSettings.secondSemi[1];
				break;
			case MINIFINALS:
				playerUser.name = gameSettings.miniFinals[0];
				playerGuest.name = gameSettings.miniFinals[1];
				break;
			case FINALS:
				playerUser.name = gameSettings.finals[0];
				playerGuest.name = gameSettings.finals[1];
				break;
			default:
				break;
		}
	}

	function gameSetUp() {

		gameSettings = JSON.parse(localStorage.getItem("gameSettings"))
		if (!gameSettings)
		{
			const content = document.getElementById("content");
			let error = document.createElement("p");
			error.setAttribute("data-i18n", "game.not-registered")
			content.innerText = ""
			content.appendChild(error)
			translateNewContent(content)
			return ;
		}
		if (gameSettings.type == SIMPLE_GAME)
			prepareGame();
		else if (gameSettings.type === TOURNAMENT)
			prepareTournament();

		playerHeight = parseInt(gameSettings.paddleSize)
		playerGuest.height = playerHeight;
		playerUser.height = playerHeight;
		playerUser.score = parseInt(gameSettings.scoreUser)
		playerGuest.score = parseInt(gameSettings.scoreGuest)
		progression = gameSettings.progression

		document.getElementById("pongContent").classList.remove("d-none")
		document.getElementById("playerUser").innerText = playerUser.score
		document.getElementById("playerGuest").innerText = playerGuest.score
		document.querySelector(".name-opponent").innerText = playerGuest.name;
		document.querySelector(".name-user").innerText = playerUser.name;
		if (playerGuest.name === "AI")
			document.querySelector(".opponent-emoji").innerText = "🤖"
		board = document.getElementById("pongCanvas");
		board.height = boardHeight;
		board.width = boardWidth;
		context = board.getContext("2d");

		// Power Up
		if (gameSettings.powerUp)
		{
			displayPowerEmoji(gameSettings.powerUpGuest, ".power-up-guest");
			displayPowerEmoji(gameSettings.powerUpUser, ".power-up-user");
			document.querySelector(".power-up-count").classList.remove("d-none")
		}
		// Draw player 1 and 2
		context.fillStyle = "white";
		context.fillRect(playerUser.x, playerUser.y, playerUser.width, playerUser.height)
		context.fillRect(playerGuest.x, playerGuest.y, playerGuest.width, playerGuest.height)
		for (let i = 10; i < board.height; i += 30)
			context.fillRect(board.width / 2 - 4, i, 2, 10)

		document.addEventListener("keyup", startGame)
		document.querySelectorAll("a:not(.change-language):not(.language-link):not(.account-list)").forEach(link => {
			link.addEventListener("click", stopGame)
		})
		window.addEventListener('popstate', stopGame)
	}

	gameSetUp()

// --------------------------------------------- AI PLAYER -------------------------------------------------

function predictBallPosition() {
	let predictedBallY = ball.y;
	let predictedBallX = ball.x;
	let velocityX = ball.velocityX;
	let velocityY = ball.velocityY;

	for (let frames = 0; frames < 60; frames++) {
		predictedBallX += velocityX;
		predictedBallY += velocityY;

		// Check for wall bounces in the y-direction (top/bottom)
		if (predictedBallY <= 0 || predictedBallY >= boardHeight) {
			velocityY *= -1;
			predictedBallY = Math.max(0, Math.min(predictedBallY, boardHeight));  // Keep within bounds
		}
		// If the ball is going out of bounds horizontally, stop prediction
		if (predictedBallX >= (board.width - playerGuest.width)) {
			break;
		}
	}
	if (ball.velocityX > 5.3)
		return (predictedBallY * computerLevel)
	return predictedBallY;
}

function playerAI() {
	if (ball.velocityX <= 0)
	{
		playerGuest.velocityY = 0;
		return;
	}
	if (ball.x > boardWidth * 0.60 && ball.velocityX >= 4.5 && !powerUp && gameSettings.powerUp && gameSettings.powerUpGuest > 0 && !powerLast)
	{
		let possibilities = [1, 2, 3]
		let random = possibilities[(Math.floor(Math.random() * possibilities.length))]
		if (random === 1)
		{
			powerUpActivation()
			updatePowerUpCount(playerGuest)
			powerLast = true
		}
		else
			powerLast = false
	}
	else
		powerLast = false
	predictedBallPosition = predictBallPosition();

	if (predictedBallPosition > playerGuest.y + (playerGuest.height * 0.25)) // Ball is higher, go up
		playerGuest.velocityY = 3;
	if (predictedBallPosition < playerGuest.y + (playerGuest.height * 0.75)) // Ball is lower, go down
		playerGuest.velocityY = -3;
}

// --------------------------------------------- UPDATE -------------------------------------------------

function checkPowerUp() {
	const now = new Date();
	const difference = (now - powerUpStart) / 1000; // Result in seconds
	if (difference >= 3)
	{
		ball.velocityX = (ball.velocityX > 0 ? oldSpeedX : -oldSpeedX);
		ball.velocityY = (ball.velocityY > 0 ? oldSpeedY : -oldSpeedY);
		powerUp = 0
		powerUpStart = 0
		oldSpeedX = 0
		oldSpeedY = 0
		document.querySelector(".power-up-activated").innerText = ""
	}
}

function handleCollision() {
	if (!hitLast)
	{
		if (Math.abs(ball.velocityX) < 5.5 && !powerUp && !gameSettings.easyMode)
			ball.velocityX *= -1.05;
		else
			ball.velocityX *= -1;
		hitLast = true
		userStillOnline()
	}
}

function paddleBallCollision() {
	if (ball.x - ball.width <= playerUser.x && ball.x >= playerUser.x - playerUser.width)
	{
		if (ball.y <= playerUser.y + playerUser.height && ball.y + ball.height >= playerUser.y)
			handleCollision();
	}
	else if (ball.x - ball.width <= playerGuest.x && ball.x >= playerGuest.x - playerGuest.width)
	{
		if (ball.y <= playerGuest.y + playerGuest.height && ball.y + ball.height >= playerGuest.y)
			handleCollision()
	}
	else
		hitLast = false;
}

function updateGameState()
{
	// Move ball and check if touch wall
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;
	if (ball.y <= 0 || ball.y + ball.height >= boardHeight)
		ball.velocityY *= -1


	if (predictedBallPosition >= 0 && playerGuest.velocityY !== 0)
	{
		if (predictedBallPosition > (playerGuest.y + playerGuest.height * 0.25) && predictedBallPosition < playerGuest.y + (playerGuest.height * 0.75))
			playerGuest.velocityY = 0
	}

	paddleBallCollision();

	calculateNewPosition(playerUser);
	calculateNewPosition(playerGuest);

	if (powerUp)
		checkPowerUp()

	if (ball.x < 0)
		addScore(playerGuest, "playerGuest", 2.5)
	else if (ball.x + ball.width > boardWidth)
		addScore(playerUser, "playerUser", -2.5)

	if (playerGuest.score >= 5 || playerUser.score >= 5)
	{
		endOfGame();
		return (1);
	}
	return (0);
}

function renderGameElements(deltaTime)
{
	context.fillRect(ball.x, ball.y, ball.width, ball.height)

	for (let i = 10; i < board.height; i += 30)
		context.fillRect(board.width / 2 - 4, i, 2, 10)
}

function update(timestamp) {
	if (lastTime === 0)
		lastTime = timestamp
	const deltaTime = timestamp - lastTime;
	lastTime = timestamp
	accumulatedTime += deltaTime

	while (accumulatedTime >= FRAME_TIME)
	{
		if (updateGameState())
			return ;
		accumulatedTime -= FRAME_TIME
	}

	context.clearRect(0, 0, boardWidth, boardHeight) // CLEAR ball and paddles to update to new position
	context.fillRect(playerUser.x, playerUser.y, playerUser.width, playerUser.height)
	context.fillRect(playerGuest.x, playerGuest.y, playerGuest.width, playerGuest.height)
	renderGameElements(deltaTime);
	gameLoopId = requestAnimationFrame(update);
}

// --------------------------------------------- GAME HELPERS -------------------------------------------------


	function outOfBounds(yPosition) {
		if (yPosition < 0 || yPosition + playerHeight > boardHeight)
			return true;
		return false;
	}

	function addScore(user, userId, speed) {
		if (user === playerUser)
		{
			playerUser.score += 1
			gameSettings.scoreUser = playerUser.score
			gameSettings.progression.push(0);
		}
		else
		{
			playerGuest.score += 1
			gameSettings.scoreGuest = playerGuest.score
			gameSettings.progression.push(1);
		}
		localStorage.setItem("gameSettings", JSON.stringify(gameSettings))
		document.getElementById(userId).innerText = user.score
		ball.velocityX = speed;
		const possibilities = [-2.5, 2.5]
		ball.velocityY = possibilities[(Math.floor(Math.random() * possibilities.length))]
		document.querySelector(".power-up-activated").innerText = ""
		ball.x = boardWidth / 2;
		ball.y = boardHeight / 2;
		if (!checkValidToken())
		{
			cancelAnimationFrame(gameLoopId);
			return;
		}
	}

	function calculateNewPosition(player) {
		let nextPlayerPositionA = player.y + player.velocityY
		if (!outOfBounds(nextPlayerPositionA))
			player.y += player.velocityY
		context.fillRect(player.x, player.y, player.width, player.height)
	}

// --------------------------------------------- MOVEMENTS -------------------------------------------------

	function displayPowerEmoji(points, powerClass)
	{
		let powerEmoji = ""
		for (let index = 0; index < points; index++) {
			powerEmoji += "💪"
		}
		document.querySelector(powerClass).innerText = powerEmoji;
	}

	function updatePowerUpCount(player) {
		let powerClass;
		let total = 0;

		if (player === playerGuest)
		{
			gameSettings.powerUpGuest -= 1;
			total = gameSettings.powerUpGuest
		}
		else if (player === playerUser)
		{
			gameSettings.powerUpUser -= 1
			total = gameSettings.powerUpUser
		}
		localStorage.setItem("gameSettings", JSON.stringify(gameSettings))


		powerClass = (player == playerUser ? ".power-up-user" : ".power-up-guest")
		displayPowerEmoji(total, powerClass)

		document.querySelector(".power-up-activated").innerText = "POWER UP"
	}

	function powerUpActivation()
	{
		powerUp = 1;
		powerUpStart = new Date();
		oldSpeedX = Math.abs(ball.velocityX);
		oldSpeedY = Math.abs(ball.velocityY);
		ball.velocityX = (ball.velocityX > 0 ? 2 : -2);
		ball.velocityY = (ball.velocityY > 0 ? 2 : -2);
	}



	function movePlayerContinuous(event) {
		// Player 1 - USER
		if (event.code == "KeyW")
			playerUser.velocityY = -3;

		if (event.code == "KeyS")
			playerUser.velocityY = 3;

		// Player 2 - GUEST
		if (playerGuest.name !== "AI")
		{
			if (event.code == "KeyO")
				playerGuest.velocityY = -3;

			if (event.code == "KeyL")
				playerGuest.velocityY = 3;
		}
	}

	function movePlayerOnce(event) {
		if (event.code == "KeyW") {
			if (!outOfBounds(playerUser.y - 10)) {
				playerUser.y -= 10;
				playerUser.velocityY = 0
			}
		}

		if (event.code == "KeyS") {
			if (!outOfBounds(playerUser.y + 10)) {
				playerUser.y += 10;
				playerUser.velocityY = 0
			}
		}

		if (event.code == "KeyP" && gameSettings.powerUp && !powerUp && gameSettings.powerUpGuest > 0 && playerGuest.name !== "AI")
		{
			powerUpActivation()
			updatePowerUpCount(playerGuest)
		}

		if (event.code == "KeyA" && gameSettings.powerUp && !powerUp && gameSettings.powerUpUser > 0)
		{
			powerUpActivation()
			updatePowerUpCount(playerUser)
		}

		if (playerGuest.name !== "AI") {

			if (event.code == "KeyO") {
				if (!outOfBounds(playerGuest.y - 10)) {
					playerGuest.y -= 10;
					playerGuest.velocityY = 0;
				}
			}

			if (event.code == "KeyL") {
				if (!outOfBounds(playerGuest.y + 10)) {
					playerGuest.y += 10;
					playerGuest.velocityY = 0;
				}
			}
		}
	}
}
