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
        // Initialize game variables...
        // You can keep your existing game logic here

        // Function to show game options
        function showGameOptions() {
		document.getElementById('gameOptions').style.display = 'flex';
		document.getElementById('tourOptions').style.display = 'none';		
		document.getElementById('tourOptions').style.display = 'none';
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

	function startTournament() {
		document.getElementById('gameOptions').style.display = 'none';
		// Hide the player name form
    		document.getElementById('playerNameForm').style.display = 'none';
		document.getElementById('tourOptions').style.display = 'block';
	}

	function getPlayerName(playerCount) {
	    // Hide tournament options and show the player name form
	    document.getElementById('tourOptions').style.display = 'none';
	    document.getElementById('playerNameForm').style.display = 'block';
	    
	    // Get the form element
	    const form = document.getElementById('playerForm');
	    
	    // Clear any existing input fields
	    form.innerHTML = '';
	    
	    // Dynamically create input fields for the number of players
	    for (let i = 1; i <= playerCount; i++) {
		const div = document.createElement('div');
		div.classList.add('form-row');

		const label = document.createElement('label');
		label.for = `player${i}`;
		label.textContent = `Player ${i}:`;

		const input = document.createElement('input');
		input.type = 'text';
		input.placeholder = `Enter Player ${i} Name`;
		input.id = `player${i}`;
		input.name = `player${i}`;

		div.appendChild(label);
		div.appendChild(input);
		form.appendChild(div);
	    }
	}

	function finalisePlayer() {
	    const form = document.getElementById('playerForm');
	    const playerNames = [];
	    
	    // Collect all the player names by iterating over form elements
	    // Only consider input elements (ignore other elements like <br>, <label>)
	    const inputs = form.querySelectorAll('input');
	    
	    inputs.forEach(input => {
		if (input.value.trim() !== '') {  // Ensure that the name is not an empty string
		    playerNames.push(input.value.trim());
		}
	    });
	    
	    // Check if we have all the player names
	    if (playerNames.length === inputs.length) {
		console.log('Starting tournament with players:', playerNames);
		// Call the function to start the tournament with the collected player names
		startTournamentSequence(playerNames);
	    } else {
		alert('Please enter names for all players.');
	    }
	}

let currentMatchIndex = 0;
let winners = [];
let tournamentMatches = [];

function startTournamentSequence(playerNames) {
    // Reset variables
    currentMatchIndex = 0;
    winners = [];
    tournamentMatches = [];
    
    // Check if playerNames is 4 or 8
    if (playerNames.length !== 4 && playerNames.length !== 8) {
        console.error("The tournament can only start with 4 or 8 players.");
        return;
    }

    // Generate initial matchups for the first round
    for (let i = 0; i < playerNames.length; i += 2) {
        tournamentMatches.push([playerNames[i], playerNames[i + 1]]);
    }

    // Show tournament bracket diagram (simple text version, you can enhance it with actual HTML and CSS)
    updateTournamentBracket();

    // Display "Start Match" button to begin the first match
    document.getElementById("startMatchButton").style.display = "block";
}

function updateTournamentBracket() {
    let bracket = "";
    tournamentMatches.forEach((match, index) => {
        bracket += `Match ${index + 1}: ${match[0]} vs ${match[1]}<br>`;
    });
    document.getElementById("tournamentBracket").innerHTML = bracket;
}

// Start the next match in the tournament
function startNextMatch() {
    if (currentMatchIndex < tournamentMatches.length) {
        let match = tournamentMatches[currentMatchIndex];
        let player1 = match[0];
        let player2 = match[1];

        // Call PvP mode, passing the current players
        startPvP(player1, player2);
    } else if (winners.length > 1) {
        // Move to the next round with winners
        tournamentMatches = [];
        for (let i = 0; i < winners.length; i += 2) {
            tournamentMatches.push([winners[i], winners[i + 1]]);
        }
        winners = [];
        currentMatchIndex = 0;
        updateTournamentBracket();
        document.getElementById("startMatchButton").style.display = "block";
    } else {
        // Tournament over, we have a winner
        document.getElementById("winner-name-tournament").innerText = winners[0];
        document.getElementById("tournamentOverModal").style.display = "block";
    }
}

// function startPvP(player1, player2) {
//     // This function should start a PvP match between the two players
//     console.log(`Starting match between ${player1} and ${player2}`);
    
//     // Simulate the match for now (you would replace this with your actual game logic)
//     setTimeout(() => {
//         // Randomly pick a winner for demo purposes
//         let winner = Math.random() > 0.5 ? player1 : player2;
//         console.log(`Winner is ${winner}`);
//         winners.push(winner);
//         currentMatchIndex++;
//         startNextMatch();
//     }, 2000); // Simulated delay for the match
// }        