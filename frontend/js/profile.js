
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
		game_results.forEach(game => {
			const result = (game.score[0] > game.score[1] ? "🏆" : "🥀")
			const date = formatDate(game.date_time)
			let opponent;
			if (game.is_ai === true)
				opponent = "🤖 AI"
			else
				opponent = `⛹️‍♀️ ${game.opponent_username}`

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

function addTournamentResults(tournaments) {

	let tournamentResultsDiv = document.querySelector(".tournament-history-container")
	const user = JSON.parse(localStorage.getItem("user")).username;

	if (tournaments.length === 0) {
		const tournamentHTML = `<p data-i18n="profile.tour-no-result">No tournament results yet</p>`
		tournamentResultsDiv.insertAdjacentHTML("beforeend", tournamentHTML);
		translateNewContent(tournamentResultsDiv)
		return ;
	}

	tournaments.forEach(result => {
		const resultHTML = `
		<div class="d-flex justify-content-between align-items-baseline w-100 mb-4">
			<div class="date-card rounded bg-light w-25 mb-2 py-1 px-3 bg-info-subtle border-info">
				<p class="my-1">${formatDate(result.date_time)}</p>
			</div>

			<div class="ranking-container w-70 d-flex flex-column">
				<div class="rounded bg-light mb-2 py-1 px-3 bg-warning-subtle d-flex justify-content-start ${result.results[0] === user ? "border border-warning" : ""}">
					<p class="my-1">🥇&nbsp;</p>
					<p class="w-20 my-1" data-i18n="profile.first"></p>
					<p class="my-1"><b>${result.results[0]}</b></p>
				</div>
				<div class="rounded bg-light mb-2 py-1 px-3 bg-warning-subtle d-flex justify-content-start ${result.results[1] === user ? "border border-warning" : ""}">
					<p class="my-1">🥈&nbsp;</p>
					<p class="w-20 my-1" data-i18n="profile.second"></p>
					<p class="my-1"><b>${result.results[1]}</b></p>
				</div>
				<div class="rounded bg-light mb-2 py-1 px-3 bg-warning-subtle d-flex justify-content-start ${result.results[2] === user ? "border border-warning" : ""}">
					<p class="my-1">🥉&nbsp;</p>
					<p class="w-20 my-1" data-i18n="profile.third"></p>
					<p class="my-1"><b>${result.results[2]}</b></p>
				</div>
				<div class="rounded bg-light mb-2 py-1 px-3 bg-warning-subtle d-flex justify-content-start ${result.results[3] === user ? "border border-warning" : ""}">
					<p class="my-1">🪨&nbsp;</p>
					<p class="w-20 my-1" data-i18n="profile.fourth"></p>
					<p class="my-1"><b>${result.results[3]}</b></p>
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
	addTournamentResults(data.tournaments)
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
			if (data.error === "User not found")
				document.querySelector("#content").innerHTML = "<p>No user found with this username</p>"
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
		// console.log(error.message)
	}
}

function profileScript() {
	const urlArgument = getArgument();
	console.log("urlArgument: " +  urlArgument);
	fetchHistory(urlArgument);
}

profileScript()


// History data: {"username":"alex","profile_picture":"/media/profile_pictures/redpanda.jpg","victories":0,"losses":0,"online":true,"points":-5,"game_results":[],"tournaments":[{"results":["p1","p2","alex","p4"],"date_time":"2024-10-16T08:07:43.237261Z"}]}
