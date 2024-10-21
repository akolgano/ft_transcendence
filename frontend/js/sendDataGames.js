async function sendSimpleGameData(opponent, scoreUser, scoreGuest, duration, progression) {
	let formData = new FormData()
	const is_ai = ((opponent === "AI") ? true : false)

	try {
		const response = await fetch("https://localhost/api/game/result/", {
			headers: {
				'Authorization': `Token ${localStorage.getItem("token")}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				"opponent_username": opponent,
				"score": [scoreUser, scoreGuest],
				"game_duration": duration,
				"progression": progression,
				"is_ai": is_ai
			}),
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
		if (data.detail)
		{
			console.log("Data saved successfully: " + JSON.stringify(data));
		}
		else
		{
			console.log("Error saving data: " + data.message);
		}
	} catch (error) {

		console.log(error.message)
	}
}



async function sendTournamentData(results, nickname) {
	let formData = new FormData()
	formData.append("results", results)
	formData.append("nickname", nickname)
	// console.log("Results: " + results)
	// console.log("nickname: " + nickname)
	try {
		const response = await fetch("https://localhost/api/tournament/result/", {
			headers: {
				'Authorization': `Token ${localStorage.getItem("token")}`,
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({"results": results, "nickname": nickname}),
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
		if (data.detail)
		{
			console.log("Data saved successfully: " + JSON.stringify(data));
		}
		else
		{
			console.log("Error saving data: " + data.message);
		}
	} catch (error) {
		console.log(error.message)
	}
}
