


function addGameResults(game_results) {
	const gameResultsDiv = document.getElementById("game-history-container");

	if (game_results.length == 0) {
		const gameHTML = "<p>No game results yet</p>";
		gameResultsDiv.insertAdjacentHTML("beforeend", gameHTML);
	} else {
		game_results.forEach((game, index) => {
			const result = (game.score[0] > game.score[1] ? "🏆" : "🥀");
			const date = formatDate(game.date_time);
			let opponent;
			if (game.is_ai === true)
				opponent = "🤖 AI";
			else
				opponent = `⛹️‍♀️ ${game.opponent_username}`;

			const gameHTML = `
			<div class="game-card border rounded bg-light w-100 d-inline-block p-1 mb-2 bg-success-subtle" data-index="${index}">
				<div class="d-flex justify-content-between px-2">
					<p class="my-1 me-5">${result}&nbsp;&nbsp;${game.score[0]} - ${game.score[1]}</p>
					<p class="my-1 flex-grow-1">${opponent}</p>
					<p class="my-1">${date}</p>
				</div>
			</div>`;
			gameResultsDiv.insertAdjacentHTML("beforeend", gameHTML);
		});

		// Add hover event to each game card
		document.querySelectorAll('.game-card').forEach((card, index) => {
			card.addEventListener('mouseenter', (event) => {
				const gameData = game_results[index];
				openGameProgressionModal(gameData.progression, index + 1); // Open modal with game progression
			});
		});
	}
}

function updateProfileCard(data)
{
	let points = (data.victories * 10) - (data.losses * 5);
	if (points < 0) points = 0;

	document.querySelector('.card-username').innerHTML = data.username
	document.querySelector(".profile-pic").src = "http://localhost:8000" + data.profile_picture
	document.querySelector(".user-points").innerHTML = `&nbsp;${points}&nbsp;`
	document.querySelector(".user-victories").innerHTML = `&nbsp;${data.victories}&nbsp`
	document.querySelector(".user-losses").innerHTML = `&nbsp;${data.losses}&nbsp`

	if (data.username !== JSON.parse(localStorage.getItem("user")).username)
	{
		const online_text = document.querySelector(".online-status")

		// TO DO delete this line:
		data.online_status = false;

		if (data.online_status === true)
			online_text.setAttribute("data-i18n", "profile.online")
		else
			online_text.setAttribute("data-i18n", "profile.offline")
		translateNewContent(document.getElementById("profile-user-online"))
	}

}

function addResultsToHTML(data) {

	updateProfileCard(data);
	addGameResults(data.game_results);
}

function getArgument() {
	const profileDiv = document.querySelector(".profile-page");
	const user = JSON.parse(localStorage.getItem("user")).username

	if (profileDiv === null) {
		console.log("ERROR")
		return (user)
	}

	let username = profileDiv.getAttribute('data-username');

	if (username === null)
		username = user;

	return (username)
}


async function fetchHistory(urlArgument) {
	removeAlert();

	try {
		const response = await fetch(`https://localhost/api/player/stats/${urlArgument}`, {
			headers: {
				'Authorization': `Token ${localStorage.getItem("token")}`,
				'Accept': 'application/json',
			},
			method: 'GET',
		})

		let data;
		const contentType = response.headers.get('Content-Type');
		if (contentType && contentType.includes('application/json')) {
			data = await response.json();
		} else {
			data = await response.text();
		}

		if (!response.ok) {
			console.log("Error: " + JSON.stringify(data))
			throw new Error(JSON.stringify(data.detail) || 'An error occurred');
		}
		if (data)
		{
			console.log("History data: " + JSON.stringify(data))
			addResultsToHTML(data);
		}
		else
		{
			removeAlert();
			displayAlert("profile.error-load", "danger");
			console.log(data.message);
		}
	} catch (error) {
		removeAlert();
		displayAlert("profile.error-load", "danger");
		console.log(error.message)
	}
}

function profileScript() {
	const urlArgument = getArgument();
	fetchHistory(urlArgument);
}


// Add the modal and chart rendering functions here

function openGameProgressionModal(scoreProgression, gameNumber) {
	const modal = new bootstrap.Modal(document.getElementById('gameProgressionModal'));
	const canvasId = 'scoreProgressionChartModal';

	// Clear the existing chart (if any)
	const canvas = document.getElementById(canvasId);
	const ctx = canvas.getContext('2d');
	if (Chart.getChart(canvasId)) {
		Chart.getChart(canvasId).destroy();
	}

	// Render the progression chart inside the modal
	renderScoreProgressionChart(scoreProgression, canvasId, gameNumber);

	// Open the modal
	modal.show();
}

function renderScoreProgressionChart(scoreProgression, canvasId, gameNumber) {
    const ctxProgression = document.getElementById(canvasId).getContext('2d');

    // Initialize player and opponent score arrays
    let playerProgression = [];
    let opponentProgression = [];

    // Initialize counters for scores
    let playerScore = 0;
    let opponentScore = 0;

    // Go through the progression array
    scoreProgression.forEach(score => {
        if (score === 0) {
            playerScore++;  // User scores
        } else if (score === 1) {
            opponentScore++;  // Opponent scores
        }

        // Push the current score for both player and opponent to their respective arrays
        playerProgression.push(playerScore);
        opponentProgression.push(opponentScore);
    });

    new Chart(ctxProgression, {
        type: 'line',
        data: {
            labels: playerProgression.map((_, index) => `${index + 1}`),  // Labels: Point 1, Point 2, etc.
            datasets: [
                {
                    //label: `You - Game ${gameNumber}`,
                    data: playerProgression,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 4,
                    fill: false,
                    pointStyle: 'line' // Use line style for legend
                },
                {
                    //label: `Opponent - Game ${gameNumber}`,
                    data: opponentProgression,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 4,
                    fill: false,
                    pointStyle: 'line' // Use line style for legend
                }
            ]
        },
        options: {
            scales: {
                x: { ticks: { font: { size: 16 } } },
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: { size: 16 }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    titleFont: { size: 16 },
                    bodyFont: { size: 16 }
                }
            },
            elements: {
                point: {
                    radius: 0 // Keep circular points visible on the chart
                }
            }
        }
    });
}


profileScript()
