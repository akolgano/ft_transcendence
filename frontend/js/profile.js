
function addBaseDataHistory(params) {
	let user = JSON.parse(localStorage.getItem("user"));
	console.log(user);

	document.querySelector('.card-username').innerHTML = user.username
	document.querySelector(".profile-pic").src = "http://localhost:8000" + user.profile_picture
}

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

function addResultsToHTML(data) {
	let points = (data.victories * 10) - (data.losses * 5);
	if (points < 0) points = 0;

	document.querySelector(".user-points").innerHTML = `&nbsp;${points}&nbsp;`
	document.querySelector(".user-victories").innerHTML = `&nbsp;${data.victories}&nbsp`
	document.querySelector(".user-losses").innerHTML = `&nbsp;${data.losses}&nbsp`
	const gameResults = document.getElementById("game-history-container")


	data.game_results.forEach(game => {
		const result = (game.score[0] > game.score[1] ? "🏆" : "🥀")
		const date = formatDate(game.date_time)

		const gameHTML = `
		<div class="game-card border rounded bg-light w-100 d-inline-block p-1 mb-2 bg-success-subtle">
			<div class="d-flex justify-content-between px-2">
				<p class="my-1 me-5">${result}&nbsp;&nbsp;${game.score[0]} - ${game.score[1]}</p>
				<p class="my-1 flex-grow-1">${game.opponent_username}</p>
				<p class="my-1">${date}</p>
			</div>
		</div>`
		gameResults.insertAdjacentHTML("beforeend", gameHTML);

	});
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


async function fetchHistory() {
	removeAlert();
	const urlArgument = getArgument();
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

addBaseDataHistory();
fetchHistory();
