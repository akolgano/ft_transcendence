
function formatDate(date) {

	const utcDate = new Date(date)

	const options = {
		timeZone: 'Asia/Singapore',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	};

	// Get the formatted date and time string
	const formattedDate = utcDate.toLocaleString('en-GB', options);
	return (formattedDate);
}

function addGameResults(game_results) {

	const gameResultsDiv = document.getElementById("game-history-container")

	if (game_results.length == 0)
	{
		const gameHTML = "<p>No game results yet</p>"
		gameResultsDiv.insertAdjacentHTML("beforeend", gameHTML);
	}
	else
	{
		game_results.forEach(game => {
			const result = (game.score[0] > game.score[1] ? "🏆" : "🥀")
			const date = formatDate(game.date_time)
			let opponent;
			if (game.is_ai === true)
				opponent = "🤖 AI"
			else
				opponent = `⛹️‍♀️ ${sanitize(game.opponent_username)}`

			const gameHTML = `
			<div class="game-card border rounded bg-light w-100 d-inline-block p-1 mb-2 bg-success-subtle">
				<div class="d-flex justify-content-between px-2">
					<p class="my-1 me-5">${result}&nbsp;&nbsp;${game.score[0]} - ${game.score[1]}</p>
					<p class="my-1 flex-grow-1">${opponent}</p>
					<p class="my-1">${date}</p>
				</div>
			</div>`
			gameResultsDiv.insertAdjacentHTML("beforeend", gameHTML);
		});
	}
}

function updateProfileCard(data)
{
	let points = (data.victories * 10) - (data.losses * 5);
	if (points < 0) points = 0;

	document.querySelector('.card-username').innerText = data.username
	document.querySelector(".profile-pic").src = sanitize_picture(data.profile_picture)
	document.querySelector(".user-points").innerText = ` ${points}`
	document.querySelector(".user-victories").innerText = ` ${data.victories} `
	document.querySelector(".user-losses").innerText = ` ${data.losses} `

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

profileScript()
