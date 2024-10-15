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
		score: 0,
		name: JSON.parse(localStorage.getItem("user")).username
	}

	let playerGuest = {
		x: boardWidth - playerWidth - 10,
		y : boardHeight / 2,
		width: playerWidth,
		height: playerHeight,
		velocityY: playerVelocityY,
		score: 0,
		name : localStorage.getItem("guestName")
	}

	function stopGame() {
		console.log("Canceling Animation frame")
		if (gameLoopId) {

			cancelAnimationFrame(gameLoopId);
			gameLoopId = null
		}
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
		gameLoopId = requestAnimationFrame(update)

		document.querySelector(".space-start").remove()
		document.querySelectorAll("a").forEach(link => {
			link.addEventListener("click", stopGame)
		})
		document.addEventListener("keyup", movePlayerOnce)
		document.addEventListener("keydown", movePlayerContinuous)
	}

	function gameSetUp() {
		if (playerGuest.name == null) {
			document.getElementById("content").innerHTML = "<p>You need to register first</p>"
			return ;
		}
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

		document.addEventListener("keyup", startGame)
	}

	gameSetUp()

	function outOfBounds(yPosition) {
		if (yPosition < 0 || yPosition + playerHeight > boardHeight)
			return true;
		return false;
	}

	function addScore(user, userId) {
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

	function endOfGame() {
		document.querySelector(".modalEndOfGame").style.display = "block";
		const winner = playerGuest.score > playerUser.score ? playerGuest.name : playerUser.name
		const looser = (winner == playerGuest.name ? playerUser.name : playerGuest.name)
		document.querySelector(".modal-title-winner").innerHTML = winner
		document.querySelector(".modal-score").innerHTML = `${playerUser.score} - ${playerGuest.score}`
		document.querySelector(".modal-looser").innerHTML = looser

		localStorage.removeItem("guestName");
		document.querySelector(".play-again").addEventListener("click", event => {
			urlRoute({ target: { href: "/gameRegistration" }, preventDefault: () => {} });
		})
		document.removeEventListener("keyup", movePlayerOnce);
		document.removeEventListener("keydown", movePlayerContinuous);
		document.querySelectorAll("a").forEach(link => {
			link.removeEventListener("click", stopGame)
		})
	}

	function playerAI() {
		if (ball.velocityX > 0)
		{
			if ((playerGuest.y + playerGuest.height / 2) * computerLevel  > ball.y)
				playerGuest.velocityY = -3;
			if ((playerGuest.y + playerGuest.height / 2) * computerLevel < ball.y)
				playerGuest.velocityY = 3;
		}
		else
			playerGuest.velocityY = 0;
	}

	function update() {
		if (playerGuest.score == 5 || playerUser.score == 5)
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

		if (playerGuest.name === "AI")
			playerAI()

		// COLLISION WITH PADDLE
		if (ball.y + ball.height >= playerUser.y && ball.y <= (playerUser.y + playerUser.height))
		{
			if (ball.x <= playerUser.x + playerUser.width && ball.x + ball.width >= playerUser.x)
			{

				ball.velocityX *= -1.05
			}
		}

		if (ball.y + ball.height >= playerGuest.y && ball.y <= (playerGuest.y + playerGuest.height))
		{
			// console.log("COLLISION???")
			if (ball.x + ball.width >= playerGuest.x && ball.x <= playerGuest.x + playerGuest.width )
			{
				ball.velocityX *= -1.05

			}
		}

		if (ball.x < 0)
			addScore(playerGuest, "playerGuest")
		else if (ball.x + ball.width > boardWidth)
			addScore(playerUser, "playerUser")

		for (let i = 10; i < board.height; i += 30)
		{
			context.fillRect(board.width / 2 - 4, i, 2, 10)
		}
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
