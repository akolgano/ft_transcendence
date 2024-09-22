console.log("GAME SCRIPT")
        let ball, player1, player2, player3, player4, playerAI;  // Declare ball globally
    
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
        // Initialize game variables...
        // You can keep your existing game logic here

        // Function to show game options
        function showGameOptions() {
		document.getElementById('gameOptions').style.display = 'flex';
		document.getElementById('gameContainerAI').style.display = 'none';
		document.getElementById('gameContainerPP').style.display = 'none';
        }

	function setActiveCanvas(canvasId) {
		activeCanvas = document.getElementById(canvasId);  // Assign the active canvas
		ctx = activeCanvas.getContext('2d');  // Set the context for the active canvas
		activeCanvas.width = 800;  // Set width
		activeCanvas.height = 400; // Set height
	}

        // Function to start Player vs Player game
	function startPlayerVsPlayer() {
		document.getElementById('gameOptions').style.display = 'none';
		document.getElementById('gameContainerPP').style.display = 'flex';
		setActiveCanvas('pongGameCanvasPP');  // Use the Player vs Player canvas
		ctx = activeCanvas.getContext('2d');           
		startPvP();  // Call your PvP game logic
        }

        // Function to start Player vs AI game
        function startPlayerVsAI() {
		document.getElementById('gameOptions').style.display = 'none';
		document.getElementById('gameContainerAI').style.display = 'flex';
		setActiveCanvas('pongGameCanvasAI');  // Use the Player vs AI canvas
		ctx = activeCanvas.getContext('2d');
		startPvAI();  // Call your AI game logic
        }

	function showGameOverModalAI() {
		const gameOverModal = document.getElementById('gameOverModalAI');
		gameOverModal.style.display = 'block'; 
		document.getElementById('winner-name-ai').textContent = winner;
	}

	function showGameOverModalPP() {
		const gameOverModal = document.getElementById('gameOverModalPP');
		gameOverModal.style.display = 'block'; 
		document.getElementById('winner-name-pp').textContent = winner;
	}

	// Function to restart the AI game
	function startPvAI() {
		document.getElementById('gameOverModalAI').style.display = 'none';
		showPongAIvPGamePage();  // Reset AI game logic
	}

	// Function to restart the PvP game
	function startPvP() {
		document.getElementById('gameOverModalPP').style.display = 'none';
		showPongPvPGamePage();  // Reset PvP game logic
	}

	function startTournament() {
		// Initialize Tournament mode
		hideOptions();
		// Call the game initialization function here
		console.log("Starting Pong Tournament...");
	}

	function showPongTournamentGamePage(){
		console.log("Initializing Tournament game");
	}

	function showPongPvPGamePage(){
		console.log("Initializing Player vs Player game");
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

		player2 = {
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
        
	function showPongAIvPGamePage(){
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
	case 'ArrowUp':
	    ArrowUpPressed = true;
	    break;
	case 'ArrowDown': 
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
	case 'ArrowUp':
	    ArrowUpPressed = false;
	    break;
	case 'ArrowDown': 
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
    function isContact(b, p) {
	b.top = b.y - b.radius;
	b.bottom = b.y + b.radius;
	b.left = b.x - b.radius;
	b.right = b.x + b.radius;

	p.top = p.y;
	p.bottom = p.y + p.height;
	p.left = p.x;
	p.right = p.x + p.width;

	return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
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
		console.log(`Countdown: ${seconds}`);
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
		console.log("Starting game loop");  // Debug
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
		if(playerAI.score === 7 || player1.score === 7) {
		    gameOver = true;
		    winner = playerAI.score === 7 ? 'Player AI' : 'Player 1';
		    console.log("WinnerAI:", winner);  // Debugging to see what the winner is
		}} else {
		if(player2.score === 7 || player1.score === 7) {
		    gameOver = true;
		    winner = player2.score === 7 ? 'Player 2' : 'Player 1';
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
//
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
//
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
			if (isPlayerAI) {
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