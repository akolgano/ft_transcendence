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

	let ball = {
		x : boardWidth / 2,
		y : boardHeight / 2,
		width: ballWidth,
		height: ballHeight,
		velocityX: 1,
		velocityY: 2,
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


	function startGame() {
		document.getElementById("playerUser").innerHTML = 0
		document.getElementById("playerGuest").innerHTML = 0
		board = document.getElementById("pongCanvas");
		board.height = boardHeight;
		board.width = boardWidth;
		context = board.getContext("2d");

		// Draw player 1 and 2
		context.fillStyle = "white";
		context.fillRect(playerUser.x, playerUser.y, playerUser.width, playerUser.height)
		context.fillRect(playerGuest.x, playerGuest.y, playerGuest.width, playerGuest.height)

		requestAnimationFrame(update)
		document.addEventListener("keyup", movePlayer)
	}

	startGame()

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

	function update() {
		if (playerGuest.score == 5 || playerUser.score == 5)
			return ;
		requestAnimationFrame(update);

		context.clearRect(0, 0, boardWidth, boardHeight)
		context.fillStyle = "white";

		//  Calculate new position player user
		let nextPlayerPositionA = playerUser.y + playerUser.velocityY
		if (!outOfBounds(nextPlayerPositionA))
			playerUser.y += playerUser.velocityY
		context.fillRect(playerUser.x, playerUser.y, playerUser.width, playerUser.height)

		//  Calculate new position player guest
		let nextPlayerPositionB = playerGuest.y + playerGuest.velocityY
		if (!outOfBounds(nextPlayerPositionB))
			playerGuest.y += playerGuest.velocityY
		context.fillRect(playerGuest.x, playerGuest.y, playerGuest.width, playerGuest.height)

		// Ball touches top or bottom
		ball.x += ball.velocityX;
		ball.y += ball.velocityY;
		if (ball.y <= 0 || ball.y + ball.height >= boardHeight)
			ball.velocityY *= -1

		context.fillRect(ball.x, ball.y, ball.width, ball.height)

		if (detectCollision(ball, playerUser)) {
			if (ball.x <= playerUser.x + playerUser.width)
				ball.velocityX *= -1
		}
		else if (detectCollision(ball, playerGuest)) {
			if (ball.x + ball.width >= playerGuest.x)
				ball.velocityX *= -1
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

	function movePlayer(event) {
		// Player 1 - USER
		console.log("code: " +  event.code)
		if (event.code == "KeyW")
			playerUser.velocityY = -3;

		if (event.code == "KeyS")
			playerUser.velocityY = 3;

		// Player 2 - GUEST
		if (event.code == "ArrowUp")
			playerGuest.velocityY = -3;

		if (event.code == "ArrowDown")
			playerGuest.velocityY = 3;
	}
}
