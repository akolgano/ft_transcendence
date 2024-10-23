{
// --------------------------------------------- SET UP -------------------------------------------------
	let board;
	let boardWidth = 800;
	let boardHeight = 500;
	let context;

	let playerHeight = 50;
	let playerWidth = 10;
	let playerVelocityY = 0;

	let ballWidth = 10;
	let ballHeight = 10;

	let gameLoopId;
	let computerLevel = 0.95;
	let hitLast = false

	let ball = {
		x : boardWidth / 2,
		y : boardHeight / 2,
		width: ballWidth,
		height: ballHeight,
		velocityX: -3,
		velocityY: 3,
	}

	let playerUser = {
		x: 0,
		y : boardHeight / 2,
		width: playerWidth,
		height: playerHeight,
		velocityY: playerVelocityY,
		score: 0
	}

	let playerGuest = {
		x: boardWidth - playerWidth - 0,
		y : boardHeight / 2,
		width: playerWidth,
		height: playerHeight,
		velocityY: playerVelocityY,
		score: 0
	}

	let progression = [];
	let timeStart;
	let duration;
	let intervalID = null;

	let predictedBallPosition = -1;

// --------------------------------------------- END GAME -------------------------------------------------

	function stopGame() {
		console.log("Canceling Animation frame")
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
	function endSimpleGame(winner, looser) {

		if (intervalID) {
			clearInterval(intervalID)
			intervalID = null;
		}
		getDuration()
		document.querySelector(".modalEndOfGame").classList.remove("d-none")
		document.querySelector(".modalEndOfGame").style.display = "block"
		document.querySelector(".modal-title-winner").innerHTML = winner
		document.querySelector(".modal-score").innerHTML = `${playerUser.score} - ${playerGuest.score}`
		document.querySelector(".modal-looser").innerHTML = looser

		sendSimpleGameData(playerGuest.name, playerUser.score, playerGuest.score, duration, progression);
		document.querySelector(".play-again").addEventListener("click", event => {
			urlRoute({ target: { href: "/gameRegistration" }, preventDefault: () => {} });
		})
		localStorage.removeItem("guestName");
	}

	function endTournament(winner, looser) {
		switch (gameData.currentGame) {

			case SEMI1:
				gameData.finals.push(winner);
				gameData.miniFinals.push(looser);
				gameData.currentGame = SEMI2;
				break;
			case SEMI2:
				gameData.finals.push(winner);
				gameData.miniFinals.push(looser);
				gameData.currentGame = MINIFINALS;
				break;
			case MINIFINALS:
				gameData.third = winner;
				gameData.fourth = looser;
				gameData.currentGame = FINALS;
				break;
			case FINALS:
				gameData.first = winner;
				gameData.second = looser;
				gameData.currentGame = null;
				sendTournamentData([gameData.first, gameData.second, gameData.third, gameData.fourth], gameData.nickname)
				break;
			default:
				break;
		}
		urlRoute({ target: { href: "/announceGame" }, preventDefault: () => {} });
	}

	function endOfGame() {
		const winner = playerGuest.score > playerUser.score ? playerGuest.name : playerUser.name
		const looser = (winner == playerGuest.name ? playerUser.name : playerGuest.name)

		if (localStorage.getItem("guestName"))
			endSimpleGame(winner, looser);
		else if (Object.keys(gameData).length !== 0)
			endTournament(winner, looser);

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

		if (localStorage.getItem("guestName"))
			timeStart = new Date();
		document.querySelector(".space-start").remove()
		document.addEventListener("keyup", movePlayerOnce)
		document.addEventListener("keydown", movePlayerContinuous)
	}

	function prepareGame() {
		playerUser.name = JSON.parse(localStorage.getItem("user")).username;
		playerGuest.name = localStorage.getItem("guestName");
	}

	function prepareTournament() {
		switch (gameData.currentGame) {
			case SEMI1:
				playerUser.name = gameData.firstSemi[0];
				playerGuest.name = gameData.firstSemi[1];
				break;
			case SEMI2:
				playerUser.name = gameData.secondSemi[0];
				playerGuest.name = gameData.secondSemi[1];
				break;
			case MINIFINALS:
				playerUser.name = gameData.miniFinals[0];
				playerGuest.name = gameData.miniFinals[1];
				break;
			case FINALS:
				playerUser.name = gameData.finals[0];
				playerGuest.name = gameData.finals[1];
				break;
			default:
				break;
		}
	}

	function gameSetUp() {

		if (localStorage.getItem("guestName"))
			prepareGame();
		else if (Object.keys(gameData).length !== 0)
			prepareTournament();
		else {
			const content = document.getElementById("content");
			let error = document.createElement("p");
			error.setAttribute("data-i18n", "game.not-registered")
			content.innerHTML = ""
			content.appendChild(error)
			translateNewContent(content)
			return ;
		}

		document.getElementById("pongContent").classList.remove("d-none")
		document.getElementById("playerUser").innerHTML = 0
		document.getElementById("playerGuest").innerHTML = 0
		document.querySelector(".name-opponent").innerHTML = playerGuest.name;
		document.querySelector(".name-user").innerHTML = playerUser.name;
		if (playerGuest.name === "AI")
			document.querySelector(".opponent-emoji").innerText = "🤖"
		board = document.getElementById("pongCanvas");
		board.height = boardHeight;
		board.width = boardWidth;
		context = board.getContext("2d");

		// Draw player 1 and 2
		context.fillStyle = "white";
		context.fillRect(playerUser.x, playerUser.y, playerUser.width, playerUser.height)
		context.fillRect(playerGuest.x, playerGuest.y, playerGuest.width, playerGuest.height)
		for (let i = 10; i < board.height; i += 30)
			context.fillRect(board.width / 2 - 4, i, 2, 10)

		document.addEventListener("keyup", startGame)
		document.querySelectorAll("a").forEach(link => {
			link.addEventListener("click", stopGame)
		})
		window.addEventListener('popstate', stopGame)
	}

	gameSetUp()

// --------------------------------------------- AI PLAYER -------------------------------------------------

// function predictBallPosition() {
// 	let predictedBallY = ball.y + (ball.velocityY * 60);
// 	let predictedBallX = ball.x + (ball.velocityX * 60)

// 	// Check for wall bounces and adjust the predicted position
// 	if (predictedBallY <= 0 || predictedBallY >= boardHeight) {
// 		let remainingDistance = Math.abs(predictedBallY - boardHeight);
// 		if (predictedBallY < 0) {
// 			predictedBallY = Math.abs(predictedBallY); // Bounce from top wall
// 		} else if (predictedBallY > boardHeight) {
// 			predictedBallY = boardHeight - remainingDistance; // Bounce from bottom wall
// 		}
// 	}
// 	return predictedBallY;
// }

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
	predictedBallPosition = predictBallPosition();

	if (predictedBallPosition > playerGuest.y + (playerGuest.height * 0.25)) // Ball is higher, go up
	{
		playerGuest.velocityY = 3;
	}
	if (predictedBallPosition < playerGuest.y + (playerGuest.height * 0.75)) // Ball is lower, go down
	{
		playerGuest.velocityY = -3;
	}
}

// --------------------------------------------- UPDATE -------------------------------------------------

function update() {
	if (playerGuest.score == 5 || playerUser.score == 5)
	{
		endOfGame();
		return ;
	}
	gameLoopId = requestAnimationFrame(update);

	context.clearRect(0, 0, boardWidth, boardHeight) // CLEAR ball and paddles to update to new position

	// Move ball and check if touch wall
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;
	if (ball.y <= 0 || ball.y + ball.height >= boardHeight)
		ball.velocityY *= -1

	context.fillRect(ball.x, ball.y, ball.width, ball.height)

	if (predictedBallPosition >= 0 && playerGuest.velocityY !== 0)
	{
		if (predictedBallPosition > (playerGuest.y + playerGuest.height * 0.25) && predictedBallPosition < playerGuest.y + (playerGuest.height * 0.75))
		{
			// console.log("AI CAN STOP MOVING. Predicted ball position is " + predictedBallPosition + ". Paddle position: " + playerGuest.y + "-" + (playerGuest.y + playerGuest.height) )
			playerGuest.velocityY = 0
		}
	}

	calculateNewPosition(playerUser);
	calculateNewPosition(playerGuest);

	if (ball.x - ball.width <= playerUser.x && ball.x >= playerUser.x - playerUser.width) {
		if (ball.y <= playerUser.y + playerUser.height && ball.y + ball.height >= playerUser.y)
		{
			if (!hitLast)
			{
				if (Math.abs(ball.velocityX) < 5.5)
					ball.velocityX *= -1.05;
				else
					ball.velocityX *= -1;
				hitLast = true
				console.log("Ball velocity: " + ball.velocityX)
			}
		}
	}
	else if (ball.x - ball.width <= playerGuest.x && ball.x >= playerGuest.x - playerGuest.width) {
		if (ball.y <= playerGuest.y + playerGuest.height && ball.y + ball.height >= playerGuest.y)
		{
			if (!hitLast)
			{
				if (Math.abs(ball.velocityX) < 5.5)
					ball.velocityX *= -1.05;
				else
					ball.velocityX *= -1;
				hitLast = true;
				console.log("Ball velocity: " + ball.velocityX)
			}
		}
	}
	else
		hitLast = false;

	if (ball.x < 0)
		addScore(playerGuest, "playerGuest", 3)
	else if (ball.x + ball.width > boardWidth)
		addScore(playerUser, "playerUser", -3)

	for (let i = 10; i < board.height; i += 30)
		context.fillRect(board.width / 2 - 4, i, 2, 10)
}

// --------------------------------------------- GAME HELPERS -------------------------------------------------


	function outOfBounds(yPosition) {
		if (yPosition < 0 || yPosition + playerHeight > boardHeight)
			return true;
		return false;
	}

	function addScore(user, userId, speed) {
		if (user === playerUser)
			progression.push(0);
		else
			progression.push(1);
		user.score += 1;
		document.getElementById(userId).innerHTML = user.score
		ball.velocityX = speed;
		ball.x = boardWidth / 2;
		ball.y = boardHeight / 2;

	}

	function calculateNewPosition(player) {
		let nextPlayerPositionA = player.y + player.velocityY
		if (!outOfBounds(nextPlayerPositionA))
			player.y += player.velocityY
		context.fillRect(player.x, player.y, player.width, player.height)
	}

// --------------------------------------------- MOVEMENTS -------------------------------------------------

	function movePlayerContinuous(event) {
		// Player 1 - USER

		if (event.code == "KeyW")
			playerUser.velocityY = -3;

		if (event.code == "KeyS")
			playerUser.velocityY = 3;

		// Player 2 - GUEST
		if (playerGuest.name !== "AI")
		{
			if (event.code == "ArrowUp")
				playerGuest.velocityY = -3;

			if (event.code == "ArrowDown")
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

		if (playerGuest.name !== "AI") {

			if (event.code == "ArrowUp") {
				if (!outOfBounds(playerGuest.y - 10)) {
					playerGuest.y -= 10;
					playerGuest.velocityY = 0;
				}
			}

			if (event.code == "ArrowDown") {
				if (!outOfBounds(playerGuest.y + 10)) {
					playerGuest.y += 10;
					playerGuest.velocityY = 0;
				}
			}
		}
	}

}
