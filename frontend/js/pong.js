{
	// initial variables
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
	let computerLevel = 0.98;

	let ball = {
		x : boardWidth / 2,
		y : boardHeight / 2,
		width: ballWidth,
		height: ballHeight,
		velocityX: -3,
		velocityY: 3,
	}

	let playerUser = {
		x: 10,
		y : boardHeight / 2,
		width: playerWidth,
		height: playerHeight,
		velocityY: playerVelocityY,
		score: 0
	}

	let playerGuest = {
		x: boardWidth - playerWidth - 10,
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

	predictedBallPosition = -1;

	function stopGame() {
		console.log("Canceling Animation frame")
		if (gameLoopId) {

			cancelAnimationFrame(gameLoopId);
			gameLoopId = null
		}
		document.removeEventListener("keyup", startGame)
		window.removeEventListener("popstate", stopGame)
		document.removeEventListener("keyup", movePlayerOnce);
		document.removeEventListener("keydown", movePlayerContinuous);
		document.querySelectorAll("a").forEach(link => {
			link.removeEventListener("click", stopGame)
		})
	}

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

	function outOfBounds(yPosition) {
		if (yPosition < 0 || yPosition + playerHeight > boardHeight)
			return true;
		return false;
	}

	function addScore(user, userId) {
		if (user === playerUser)
			progression.push(0);
		else
			progression.push(1);
		user.score += 1;
		document.getElementById(userId).innerHTML = user.score
		ball.velocityX *= -1;
		ball.x = boardWidth / 2;
		ball.y = boardHeight / 2;

	}

	function calculateNewPosition(player) {
		let nextPlayerPositionA = player.y + player.velocityY
		if (!outOfBounds(nextPlayerPositionA))
			player.y += player.velocityY
		context.fillRect(player.x, player.y, player.width, player.height)
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
		document.querySelector(".modalEndOfGame").style.display = "block";
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
	function predictBallPosition(secondsAhead) {
		let predictedBallY = ball.y + ball.velocityY * secondsAhead * 1000 / 1000;

		// Check for wall bounces and adjust the predicted position
		if (predictedBallY <= 0 || predictedBallY >= boardHeight) {
			let remainingDistance = Math.abs(predictedBallY - boardHeight);
			if (predictedBallY < 0) {
				predictedBallY = Math.abs(predictedBallY); // Bounce from top wall
			} else if (predictedBallY > boardHeight) {
				predictedBallY = boardHeight - remainingDistance; // Bounce from bottom wall
			}
		}
		return predictedBallY;
	}

	function playerAI() {
		console.log("HERE AI")
		predictedBallPosition = predictBallPosition(1);
		const playerPaddle = (playerGuest.y - playerGuest.height / 2)
		if (ball.velocityX > 0)
		{
			if (playerPaddle * computerLevel  > predictedBallPosition) // Ball is lower, paddle go down
			{
				playerGuest.velocityY = -3;
			}
			if (playerPaddle * computerLevel < predictedBallPosition)
			{
				playerGuest.velocityY = 3;
			}
		}
		else
			playerGuest.velocityY = 0;
	}

	function update() {
		if (playerGuest.score == 2 || playerUser.score == 2)
		{
			endOfGame();
			return ;
		}
		gameLoopId = requestAnimationFrame(update);

		context.clearRect(0, 0, boardWidth, boardHeight)

		calculateNewPosition(playerUser);
		calculateNewPosition(playerGuest)

		// Move ball and check if touch wall
		ball.x += ball.velocityX;
		ball.y += ball.velocityY;
		if (ball.y <= 0 || ball.y + ball.height >= boardHeight)
			ball.velocityY *= -1

		context.fillRect(ball.x, ball.y, ball.width, ball.height)

		// playerAI()
		// Check if AI paddle has reached the ball position
		if (predictedBallPosition >= 0)
		{
			if (predictedBallPosition >= playerGuest.y && predictBallPosition <= playerGuest.y + playerGuest.height) {
				console.log("AI can stop moving now")
				playerGuest.velocityY = 0
			}
		}
		// COLLISION WITH PADDLE
		// USER
		// if (ball.y + ball.height >= playerUser.y && ball.y <= (playerUser.y + playerUser.height))
		// {
		// 	if (ball.x <= playerUser.x + playerUser.width && ball.x + ball.width >= playerUser.x)
		// 		ball.velocityX *= -1.05
		// }
		// // GUEST
		// if (ball.y + ball.height >= playerGuest.y && ball.y <= (playerGuest.y + playerGuest.height))
		// {
		// 	if (ball.x + ball.width >= playerGuest.x && ball.x <= playerGuest.x + playerGuest.width )
		// 		ball.velocityX *= -1.05
		// }
		// if (detectCollision(ball, playerUser)) {
		// 	if (ball.x <= playerUser.x + playerUser.width) { //left side of ball touches right side of player 1 (left paddle)
		// 		ball.velocityX *= -1.05;   // flip x direction
		// 	}
		// }
		// else if (detectCollision(ball, playerGuest)) {
		// 	if (ball.x + ball.width >= playerGuest.x) { //right side of ball touches left side of player 2 (right paddle)
		// 		ball.velocityX *= -1.05;   // flip x direction
		// 	}
		// }

		// Handle Player-Ball collisions
		if (ball.x - ball.width <= playerUser.x && ball.x >= playerUser.x - playerUser.width) {
			if (ball.y <= playerUser.y + playerUser.height && ball.y + ball.height >= playerUser.y)
			{
				ball.velocityX *= -1.05;
			}
		}

		// Handle ai-ball collision
		if (ball.x - ball.width <= playerGuest.x && ball.x >= playerGuest.x - playerGuest.width) {
			if (ball.y <= playerGuest.y + playerGuest.height && ball.y + ball.height >= playerGuest.y)
			{
				ball.velocityX *= -1.05;
			}
		}

		if (ball.x < 0)
			addScore(playerGuest, "playerGuest")
		else if (ball.x + ball.width > boardWidth)
			addScore(playerUser, "playerUser")
		for (let i = 10; i < board.height; i += 30)
			context.fillRect(board.width / 2 - 4, i, 2, 10)
	}

	function detectCollision(a, b) {
		// Detect collision between the rectangle and the ball
		//  We check the right side of paddle versus left side of ball
		return (a.x < b.x + b.width &&
			a.x + a.width > b.x &&
			a.y < b.y + b.height &&
			a.y + a.height + a.height > b.y
		)
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
