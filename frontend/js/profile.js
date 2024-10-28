function addGameResults(game_results) {
	document.querySelector(".profile-page").classList.remove("d-none")
	const gameResultsDiv = document.getElementById("game-history-container")

	if (game_results.length == 0)
	{
		const gameHTML = `<p data-i18n="profile.game-no-result"></p>`
		gameResultsDiv.insertAdjacentHTML("beforeend", gameHTML);
		translateNewContent(gameResultsDiv)
	}
	else
	{
		game_results.forEach((game, index) => {
			const result = (game.score[0] > game.score[1] ? "🏆" : "🥀")
			const date = formatDate(game.date_time)
			let opponent;
			if (game.is_ai === true)
				opponent = "🤖 AI"
			else
				opponent = `⛹️‍♀️ ${sanitize(game.opponent_username)}`

			const gameHTML = `
		    <div class="game-card border rounded bg-light w-100 d-inline-block p-1 mb-2 bg-success-subtle">
		        <div class="d-flex justify-content-between align-items-center px-2">
		            <div class="d-flex">
		                <p class="my-1 me-5">${result}&nbsp;&nbsp;${game.score[0]} - ${game.score[1]}</p>
		                <p class="my-1">${opponent}</p>
		            </div>
		            <div class="d-flex ms-auto align-items-center">
		                <p class="my-1 me-3">${date}</p>
		                <button class="btn btn-link p-0 text-decoration-none show-chart-btn" data-index="${index}">
		                    📊
		                </button>
		            </div>
		        </div>
		    </div>`;
			gameResultsDiv.insertAdjacentHTML("beforeend", gameHTML);
		});

		// Attach event listeners to "Show Progression" buttons after rendering the game cards
		document.querySelectorAll('.show-chart-btn').forEach((button) => {
			button.addEventListener('click', (event) => {
				if (!checkValidToken())
					return;
				const index = event.target.getAttribute('data-index');
				const gameData = game_results[index];
				openGameProgressionModal(gameData.progression, parseInt(index) + 1); // Open modal with game progression
			});
		});
	}
}

function updateProfileCard(data)
{
	document.querySelector('.card-username').innerText = sanitize(data.username)
	document.querySelector(".profile-pic").src = "https://localhost" + sanitize_picture(data.profile_picture)
	document.querySelector(".user-points").innerText = data.points
	document.querySelector(".user-victories").innerText = data.victories
	document.querySelector(".user-losses").innerText = data.losses

	if (data.username !== JSON.parse(localStorage.getItem("user")).username)
	{
		const online_text = document.querySelector(".online-status")
		if (data.online === true)
			online_text.setAttribute("data-i18n", "profile.online")
		else
			online_text.setAttribute("data-i18n", "profile.offline")
		translateNewContent(document.getElementById("profile-user-online"))
	}
}

function addTournamentResults(tournaments, user) {

	let tournamentResultsDiv = document.querySelector(".tournament-history-container")

	if (tournaments.length === 0) {
		const tournamentHTML = `<p data-i18n="profile.tour-no-result">No tournament results yet</p>`
		tournamentResultsDiv.insertAdjacentHTML("beforeend", tournamentHTML);
		translateNewContent(tournamentResultsDiv)
		return ;
	}

	tournaments.forEach(result => {
		const nickname = result.nickname;
		const resultHTML = `
		<div class="d-flex justify-content-between align-items-baseline w-100 mb-4">
			<div class="date-card rounded bg-light w-25 mb-2 py-1 px-3 bg-info-subtle border-info">
				<p class="my-1">${formatDate(result.date_time)}</p>
			</div>

			<div class="ranking-container w-70 d-flex flex-column">
				<div class="rounded bg-light mb-2 py-1 px-3 bg-warning-subtle d-flex justify-content-start ${sanitize(result.results[0]) === sanitize(nickname) ? "border border-warning border-2" : ""}">
					<p class="my-1">🥇&nbsp;</p>
					<p class="w-40 my-1" data-i18n="profile.first"></p>
					<p class="my-1"><b>${sanitize(result.results[0])}${sanitize(result.results[0]) === sanitize(nickname) ? "&nbsp;(" + user + ")" : ""}</b></p>
				</div>
				<div class="rounded bg-light mb-2 py-1 px-3 bg-warning-subtle d-flex justify-content-start ${sanitize(result.results[1]) === sanitize(nickname) ? "border border-warning border-2" : ""}">
					<p class="my-1">🥈&nbsp;</p>
					<p class="w-40 my-1" data-i18n="profile.second"></p>
					<p class="my-1"><b>${sanitize(result.results[1])}${sanitize(result.results[1]) === sanitize(nickname) ? "&nbsp;(" + user + ")" : ""}</b></p>
				</div>
				<div class="rounded bg-light mb-2 py-1 px-3 bg-warning-subtle d-flex justify-content-start ${sanitize(result.results[2]) === sanitize(nickname) ? "border border-warning border-2" : ""}">
					<p class="my-1">🥉&nbsp;</p>
					<p class="w-40 my-1" data-i18n="profile.third"></p>
					<p class="my-1"><b>${sanitize(result.results[2])}${sanitize(result.results[2]) === sanitize(nickname) ? "&nbsp;(" + user + ")" : ""}</b></p>
				</div>
				<div class="rounded bg-light mb-2 py-1 px-3 bg-warning-subtle d-flex justify-content-start ${sanitize(result.results[3]) === sanitize(nickname) ? "border border-warning border-2" : ""}">
					<p class="my-1">🪨&nbsp;</p>
					<p class="w-40 my-1" data-i18n="profile.fourth"></p>
					<p class="my-1"><b>${sanitize(result.results[3])}${sanitize(result.results[3]) === sanitize(nickname) ? "&nbsp;(" + user + ")" : ""}</b></p>
				</div>
			</div>
		</div>`
		tournamentResultsDiv.insertAdjacentHTML("beforeend", resultHTML);
	});
	translateNewContent(tournamentResultsDiv)
}

function addResultsToHTML(data) {

	updateProfileCard(data);
	addGameResults(data.game_results);
	addTournamentResults(data.tournaments, data.username)
}

function getArgument() {
	const profileDiv = document.querySelector(".profile-page");
	const user = JSON.parse(localStorage.getItem("user")).username

	if (profileDiv === null)
		return (user)

	let username = profileDiv.getAttribute('data-username');

	if (username === null)
		username = user;

	return (username)
}


async function fetchHistory(urlArgument) {
	removeAlert();

	try {
		const response = await fetch(`https://localhost/api/player/stats/${urlArgument}/`, {
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
			if (data.error === "User not found")
			{
				let content = document.querySelector("#content")
				content.innerText = ""
				let errorTag = document.createElement("p");
				errorTag.setAttribute("data-i18n", "friends.error-no-user")
				content.appendChild(errorTag)
				translateNewContent(content)
			}
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
		if (error.message === '"Invalid token."') {
			localStorage.removeItem("user")
			localStorage.removeItem("token")
			localStorage.removeItem("expiry_token")
			updateNavbar(false)
			urlRoute({ target: { href: '/login' }, preventDefault: () => {} });
			displayAlert("auth.login-again", "danger");
		}
		else
			displayAlert("profile.error-load", "danger");
		// console.log(error.message)
	}
}

function profileScript() {
	const urlArgument = getArgument();
	// console.log("urlArgument: " +  urlArgument);
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
