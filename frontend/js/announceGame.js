function tournementOverview(params) {
	console.log("first game: " + gameData.firstSemi);
	console.log("players: " + gameData.players);

	document.querySelector(".semi-1").innerText = `${gameData.firstSemi[0]} - ${gameData.firstSemi[1]}`
	document.querySelector(".semi-2").innerText = `${gameData.secondSemi[0]} - ${gameData.secondSemi[1]}`

	// if (gameData.currentGame)
	document.querySelector(".mini-finals").innerText = `${gameData.miniFinals[0]} - ${gameData.miniFinals[1]}`
	document.querySelector(".finals").innerText = `${gameData.finals[0]} - ${gameData.finals[1]}`

	let nextGame;
	switch (gameData.currentGame) {
		case SEMI1:
			nextGame = "Semi-finals 1"
			break;
		case SEMI2:
			nextGame =  "Semi-finals 2"
			break;
		case MINIFINALS:
			nextGame =  "Mini finals"
			break;
		case FINALS:
			nextGame = "Finals"
			break;
		default: "Others"
			break;
	}

	document.querySelector(".next-game").innerText = nextGame;
}

tournementOverview()
