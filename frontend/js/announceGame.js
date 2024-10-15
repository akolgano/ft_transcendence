function tournementOverview(params) {

	document.querySelector(".semi-1").innerText = `${gameData.firstSemi[0]} - ${gameData.firstSemi[1]}`
	document.querySelector(".semi-2").innerText = `${gameData.secondSemi[0]} - ${gameData.secondSemi[1]}`

	// if (gameData.currentGame)
	document.querySelector(".mini-finals").innerText = `${gameData.miniFinals[0]} - ${gameData.miniFinals[1]}`
	document.querySelector(".finals").innerText = `${gameData.finals[0]} - ${gameData.finals[1]}`



	document.querySelector(".next-game").innerText = getCurrentGame();
	if (gameData.getCurrentGame === null)
		console.log("WE HAVE A WINNER")
}

tournementOverview()
