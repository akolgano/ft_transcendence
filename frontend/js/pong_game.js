console.log("GAME SCRIPT")
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
	    
	// Function to show game options
	function showGameOptions() {
	document.getElementById('gameOptions').style.display = 'flex';
	document.getElementById('tourOptions').style.display = 'none';		
	document.getElementById('gameContainerAI').style.display = 'none';
	document.getElementById('gameContainerPP').style.display = 'none';
	document.getElementById('tournamentContainer').style.display = 'none';
	document.getElementById('tournamentOverModal').style.display = 'none';
	tournamentMode = false;	
	}

	function setActiveCanvas(canvasId) {
		activeCanvas = document.getElementById(canvasId);  // Assign the active canvas
		ctx = activeCanvas.getContext('2d');  // Set the context for the active canvas
		activeCanvas.width = 800;  // Set width
		activeCanvas.height = 400; // Set height
	}

	function showGameOverModalAI() {
		const gameOverModal = document.querySelector('.game-over-modalAI');
		gameOverModal.style.display = 'block'; 
		const winnerName = document.getElementById('winner-name-ai');
		winnerName.textContent = winner;
	}
	
	function showGameOverModalPP() {
		const gameOverModal = document.querySelector('.game-over-modalPP');
		gameOverModal.style.display = 'block'; 
		const winnerName = document.getElementById('winner-name-pp');
		winnerName.textContent = winner;
	}

	function showGameOverModalTournament() {
		document.getElementById('gameOverModalTournament').style.display = 'block'; 
		document.getElementById('winner-name-ppt').textContent = winner;
	}

	function setPlayerNames(p1, p2) {
		document.getElementById('player2Name').textContent = p2;
		document.getElementById('player1Name').textContent = p1;
	}

	async function startPvPpractice() {
	    // This function should start a PvP match between the two players
	    console.log(`Starting practice match between Player1 and Player2`);
	    document.getElementById("tournamentContainer").style.display = "none";
	    document.getElementById('gameOverModalTournament').style.display = 'none';
	    tournamentMode = false;
	    gameOver = true;
		cancelAnimationFrame(gameLoopId); // Stop the existing game loop	        
	    startPlayerVsPlayer();
	}

    // Function to start Player vs Player game
	function startPlayerVsPlayer(p1, p2) {
		document.getElementById('gameOptions').style.display = 'none';
		document.getElementById('gameContainerPP').style.display = 'flex';
		setActiveCanvas('pongGameCanvasPP');  // Use the Player vs Player canvas
		ctx = activeCanvas.getContext('2d');           

		document.getElementById('gameOverModalPP').style.display = 'none';
		const gameOverModal = document.querySelector('.game-over-modalPP');                
		gameOverModal.style.display = 'none'; // Hide modal

		wPressed = false;
		sPressed = false;
		ArrowUpPressed = false;
		ArrowDownPressed = false; 
		isPlayerAI = false;
		
		gameOver = false;
		isPaused = false;
		readyKickoff = false;      
		winner = '';
		gameLoopId = null;

		ball = {
			x: activeCanvas.width / 2,
			y: activeCanvas.height / 2,
			radius: 10,
			velocityX: 5,
			velocityY: 5,
			speed: 5,
			color: "#FFF"
		};

		player1 = {
			name: "Player 1",
			x: activeCanvas.width - 15,
			y: (activeCanvas.height - 100) / 2,
			width: 15,
			height: 100,
			score: 0,
			color: "#FFF"
		};
	
		player2 = {
			name: "Player 2",
			x: 0,
			y: (activeCanvas.height - 100) / 2,
			width: 15,
			height: 100,
			score: 0,
			color: "#FFF"
		};

		// You can replace these with dynamic names, e.g., from a form or input field
		if (tournamentMode) {
			player2.name = p2;
			player1.name = p1;
			setPlayerNames(p1, p2);
			} else {
			setPlayerNames('Player1', 'Player2');
			document.getElementById("matchLabel").textContent = `Practice Match`;			
			}
		
		console.log("Initializing", player1.name, "vs", player2.name, "game");
		document.addEventListener('keydown', keyDownHandler);
		document.addEventListener('keyup', keyUpHandler);
		console.log(document.getElementById("matchLabel").textContent);
		console.log(ball, player1, player2, playerAI);  // Debug to check their state before update
		countdownToStart(3);
	}

    // Function to start Player vs AI game
    function startPlayerVsAI() {
		cancelAnimationFrame(gameLoopId); // Stop the existing game loop    	
		document.getElementById('gameOptions').style.display = 'none';
		document.getElementById('gameContainerAI').style.display = 'flex';
		setActiveCanvas('pongGameCanvasAI');  // Use the Player vs AI canvas
		ctx = activeCanvas.getContext('2d');

		document.getElementById('gameOverModalAI').style.display = 'none';
		console.log("Initializing Player vs AI game");
		const gameOverModal = document.querySelector('.game-over-modalAI');                
		gameOverModal.style.display = 'none'; // Hide modal

		wPressed = false;
		sPressed = false;
		ArrowUpPressed = false;
		ArrowDownPressed = false; 
		isPlayerAI = true;

		gameOver = false;
		isPaused = false;
		readyKickoff = false;      
		winner = '';
		gameLoopId = null;

		lastUpdateTime = 0;
		updateInterval = 1000;  // AI "sees" the ball every 1 second
		predictedY = activeCanvas.height / 2;

		ball = {
			x: activeCanvas.width / 2,
			y: activeCanvas.height / 2,
			radius: 10,
			velocityX: 5,
			velocityY: 5,
			speed: 5,
			color: "#FFF"
		};

		playerAI = {
			x: 0,
			y: (activeCanvas.height - 100) / 2,
			width: 15,
			height: 100,
			score: 0,
			color: "#FFF"
		};

		player1 = {
			x: activeCanvas.width - 15,
			y: (activeCanvas.height - 100) / 2,
			width: 15,
			height: 100,
			score: 0,
			color: "#FFF"
		};

		document.addEventListener('keydown', keyDownHandler);
		document.addEventListener('keyup', keyUpHandler);

		countdownToStart(3);
		}
//
    function keyDownHandler(event) {
      switch(event.key) {
	case 'p':
	    isPaused =!isPaused;  // Toggle pause state
	    break; 
        case 'w':
           wPressed = true;
           break;
        case 's':
            sPressed = true;
            break;
		case 'i':
			ArrowUpPressed = true;
			break;
		case 'k': 
			ArrowDownPressed = true;
			break;
     }
   }

    function keyUpHandler(event) {
      switch(event.key) {
        case 'w':
            wPressed = false;
            break;
        case 's':
            sPressed = false;
            break;
		case 'i':
			ArrowUpPressed = false;
			break;
		case 'k': 
			ArrowDownPressed = false;	
	    	break;
      }
    }
//
    function drawRect(x, y, width, height, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
    }
//
    function drawCircle(x, y, radius, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI*2, false);
	ctx.closePath();
	ctx.fill();
    }
//
    function drawText(text, x, y, color = '#FFF') {
	ctx.fillStyle = color;
	ctx.font = '50px Arial';
	ctx.fillText(text, x, y);
    }
//
    function kickOff() {
	console.log("Kickoff! Ball position:", ball.x, ball.y);
	ball.x = activeCanvas.width / 2;
	ball.y = activeCanvas.height / 2;
	player1.y = activeCanvas.height / 2 - player1.height / 2;
	if (isPlayerAI) {
        playerAI.y = activeCanvas.height / 2 - 100 / 2;
        } else {
        player2.y = activeCanvas.height / 2 - 100 / 2;
        } 		
	ball.velocityX = -ball.velocityX;
	ball.speed = 5;
        ball.velocityX = ball.velocityX > 0 ? ball.speed : -ball.speed;
        ball.velocityY = ball.velocityY > 0 ? ball.speed : -ball.speed;		

	// Stop the ball's movement and pause the game
	isPaused = true;
	readyKickoff = true;
	// Use setTimeout to resume the game after 1 second (1000 milliseconds)
	setTimeout(() => {
		isPaused = false;
		readyKickoff = false;  // Unpause the game after 1 second
	}, 1000);  // 1000 milliseconds = 1 second
    }
//
function isContact(ball, paddle) {
    // Define the ball's bounds
    let ballTop = ball.y - ball.radius;
    let ballBottom = ball.y + ball.radius;
    let ballLeft = ball.x - ball.radius;
    let ballRight = ball.x + ball.radius;

    // Define the paddle's bounds
    let paddleTop = paddle.y;
    let paddleBottom = paddle.y + paddle.height;
    let paddleLeft = paddle.x;
    let paddleRight = paddle.x + paddle.width;

    // Check for collision
    return ballRight > paddleLeft && ballBottom > paddleTop &&
           ballLeft < paddleRight && ballTop < paddleBottom;
}
//
	function bounceAngle(b, p) {
		let contactPt = b.y - (p.y + p.height / 2);
		contactPt = contactPt / (p.height / 2); // normalise it -1 to 1
		let angleShift = (Math.PI / 4) * contactPt;	// convert to -45deg to 45 deg
		let direction = (b.x < activeCanvas.width / 2) ? 1 : -1;
		b.velocityX = direction * b.speed * Math.cos(angleShift);
		b.velocityY = b.speed * Math.sin(angleShift);

		// Ensure there is always some vertical movement
		if (Math.abs(b.velocityY) < 1) {
			b.velocityY = b.velocityY < 0 ? -1 : 1;
		}
		// Ensure there is always some horizontal movement
		if (Math.abs(b.velocityX) < 1) {
			b.velocityX = b.velocityX < 0 ? -1 : 1;			
		}
	}

	function countdownToStart(seconds) {
		if(seconds > 0) {
//		console.log(`Countdown: ${seconds}`);
		ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; 
		ctx.fillRect(0, 0, activeCanvas.width, activeCanvas.height);

		ctx.fillStyle = "#FFF"; 
		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		ctx.fillText(`Starting: ${seconds}`, activeCanvas.width/2, activeCanvas.height/2);	          
		setTimeout(function() {
		console.log(`Countdown: ${seconds}`);  // Debug             
		countdownToStart(seconds - 1);
		}, 1000);
		}  else {              
		console.log("Starting game loop");  // Debug to check their state before update
		gameLoop();  // Start the game loop
		}
	}

	function update() {
		// how to do this only at every second - requiremnt
		// AI tracking the ball
		let currentTime = performance.now();
		if (currentTime - lastUpdateTime > updateInterval) {
		     predictedY = predictBallPosition(ball);
		     lastUpdateTime = currentTime;
		}
		let paddleSpeed = 8;
		let aiBuffer = 30;


		if (ArrowUpPressed && player1.y > 0) player1.y -= paddleSpeed;
		if (ArrowDownPressed && (player1.y + player1.height) < activeCanvas.height) player1.y += paddleSpeed;
			
		if (isPlayerAI) {			
			if ((Math.abs(predictedY - (playerAI.y + playerAI.height / 2)) > aiBuffer) && ball.velocityX < 0)
			{
			    let playerAIDirection = predictedY < playerAI.y + playerAI.height / 2 ? -1 : 1;
			    playerAI.y += playerAIDirection * 20;  // Adjust the speed to make it smoother
			}

			// Ensure the AI paddle stays within the canvas boundaries
			playerAI.y = Math.max(Math.min(playerAI.y, activeCanvas.height - playerAI.height), 0);
		} else {
		if (wPressed && player2.y > 0) player2.y -= paddleSpeed;
		if (sPressed && (player2.y + player2.height) < activeCanvas.height) player2.y += paddleSpeed;
		}
		// keep the ball moving
		ball.x += ball.velocityX; 
		ball.y += ball.velocityY;

		// rebounce off the top or bottom of canvas
		if(ball.y - ball.radius < 0 || ball.y + ball.radius > activeCanvas.height) {
		    ball.velocityY = -ball.velocityY;
		    if (Math.abs(ball.velocityY) < 1) {
			ball.velocityY = ball.velocityY < 0 ? -1 : 1;
		    }
		}

		let player = player1;
		if (isPlayerAI) {
			player = (ball.x < activeCanvas.width / 2) ? playerAI : player1;
		} else {
			player = (ball.x < activeCanvas.width / 2) ? player2 : player1;
		}
//		console.log(ball, player, player1, player2, playerAI); 
		if(isContact(ball, player)) {
	    	    ball.speed += 0.5; // Increase speed with every paddle hit
		    bounceAngle(ball, player);
		}

		if(ball.x - ball.radius < 0) {
		    player1.score++;
		    kickOff();
		} else if(ball.x + ball.radius > activeCanvas.width) {
		    if (isPlayerAI) {	
		    playerAI.score++;
		    } else {
		    player2.score++;}
		    kickOff();
		}
		
		if (isPlayerAI) {
		if(playerAI.score === 1 || player1.score === 1) {
		    gameOver = true;
		    winner = playerAI.score === 1 ? 'Player AI' : 'Player 1';
		    console.log("WinnerAI:", winner);  // Debugging to see what the winner is
		}} else {
		if(player2.score === 1 || player1.score === 1) {
		    gameOver = true;
		    winner = player2.score === 1 ? player2.name : player1.name;
		    console.log("WinnerPP:", winner);  // Debugging to see what the winner is
		}}
	}
//
	function predictBallPosition(ball) {
		let timeToReachAI = ball.x / Math.abs(ball.velocityX);
		let predictedY = ball.y + ball.velocityY * timeToReachAI;
		while (predictedY < 0 || predictedY > activeCanvas.height) {
			if (predictedY < 0) {
			    predictedY = -predictedY;
			} else if (predictedY > activeCanvas.height) {
			    predictedY = 2 * activeCanvas.height - predictedY;
			}
		}
		return predictedY;
	}
//
	function render() {
		
		drawRect(0, 0, activeCanvas.width, activeCanvas.height, '#000'); // outer-perimeter	
		drawRect(activeCanvas.width/2 - 2, 0, 4, activeCanvas.height, '#FFF'); // centre-line
		drawCircle(ball.x, ball.y, ball.radius, ball.color);
		drawRect(player1.x, player1.y, player1.width, player1.height, player1.color);
		if (isPlayerAI) {
		drawRect(playerAI.x, playerAI.y, playerAI.width, playerAI.height, playerAI.color);
		drawText(playerAI.score, activeCanvas.width / 4, 40);
		} else { 
		drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);
		drawText(player2.score, activeCanvas.width / 4, 40);
		}
		drawText(player1.score, 3 * activeCanvas.width / 4, 40);
	}

	function gameLoop() {
		console.log("Game loop running");  // Debugging log
		if(!gameOver && !isPaused) {
			update();
			render();
		} else if (isPaused) {
			render();
			if (readyKickoff) {
			ctx.fillStyle = "#FFF"; 
			ctx.font = "30px Arial";
			ctx.textAlign = "center";
			ctx.fillText(`Get Ready!`, activeCanvas.width/2 + 22, activeCanvas.height/2 - 40);
		}
		else {
			ctx.fillStyle = "#FFF"; 
			ctx.font = "30px Arial";
			ctx.textAlign = "center";
			ctx.fillText(`Game Paused!`, activeCanvas.width/2 + 15, activeCanvas.height/2 - 40);
		}	
		}
		if (gameOver) {
			console.log("Winner:", winner);  // Debugging to see what the winner is
			if (tournamentMode) {
			showGameOverModalTournament();
			console.log(`Winner of this match is ${winner}`);
			winners.push(winner);
			matchIndex++;
			console.log(winners, matchIndex);
			}
			else if (isPlayerAI) {
			showGameOverModalAI();
			} else {
			showGameOverModalPP();
			}
			cancelAnimationFrame(gameLoopId); // Stop the existing game loop
			return;
		}
		gameLoopId = requestAnimationFrame(gameLoop);
	}
	
	// Show options on page load
        showGameOptions();
