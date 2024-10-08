
function addBaseDataHistory(params) {
	let user = JSON.parse(localStorage.getItem("user"));
	console.log(user);

	document.querySelector('.card-username').innerHTML = user.username
	document.querySelector(".profile-pic").src = "http://localhost:8000" + user.profile_picture
}

function addResultsToHTML(data) {
	let points = (data.victories * 10) - (data.losses * 5);
	if (points < 0) points = 0;

	document.querySelector(".user-points").innerHTML = `&nbsp;${points}&nbsp;`
	document.querySelector(".user-victories").innerHTML = `&nbsp;${data.victories}&nbsp`
	document.querySelector(".user-losses").innerHTML = `&nbsp;${data.losses}&nbsp`
}


async function fetchHistory() {
	removeAlert();
	try {
		const response = await fetch("https://localhost/api/player/stats/", {
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
