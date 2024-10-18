function addWinner(name, selector) {
	const winner = document.querySelector(selector)
	winner.innerText = name;
}


function tournamentOverview(params) {

	document.querySelector(".semi-1").innerText = ` ${gameData.firstSemi[0]} 🆚 ${gameData.firstSemi[1]}`
	document.querySelector(".semi-2").innerText = ` ${gameData.secondSemi[0]} 🆚 ${gameData.secondSemi[1]}`
	if (gameData.currentGame)
		document.querySelector(".play-btn").classList.remove("d-none")
	if (gameData.currentGame === SEMI1 )
	{
		document.querySelector(".semi-1-container").classList.add("border", "border-3", "border-warning")
	}

	else if (gameData.currentGame === SEMI2 )
	{
		document.querySelector(".semi-2-container").classList.add("border", "border-3", "border-warning")
		addWinner(gameData.finals[0], ".semi-1-winner")

		// FInals and mini
		document.querySelector(".mini-finals").innerText = ` ${gameData.miniFinals[0]} 🆚 ?`
		document.querySelector(".finals").innerText = ` ${gameData.finals[0]} 🆚 ?`
	}
	else if (gameData.currentGame === MINIFINALS)
	{
		addWinner(gameData.finals[0], ".semi-1-winner")
		addWinner(gameData.finals[1], ".semi-2-winner")

		document.querySelector(".mini-finals-container").classList.add("border", "border-3", "border-warning")

		document.querySelector(".mini-finals").innerText = ` ${gameData.miniFinals[0]} 🆚 ${gameData.miniFinals[1]}`
		document.querySelector(".finals").innerText = ` ${gameData.finals[0]} 🆚 ${gameData.finals[1]}`
	}
	else if (gameData.currentGame === FINALS)
	{
		addWinner(gameData.finals[0], ".semi-1-winner")
		addWinner(gameData.finals[1], ".semi-2-winner")
		addWinner(gameData.third, ".mini-finals-winner")

		document.querySelector(".finals-container").classList.add("border", "border-3", "border-warning")

		document.querySelector(".mini-finals").innerText = ` ${gameData.miniFinals[0]} 🆚 ${gameData.miniFinals[1]}`
		document.querySelector(".finals").innerText = ` ${gameData.finals[0]} 🆚 ${gameData.finals[1]}`
	}
	else if (gameData.currentGame == null)
	{
		addWinner(gameData.finals[0], ".semi-1-winner")
		addWinner(gameData.finals[1], ".semi-2-winner")
		addWinner(gameData.third, ".mini-finals-winner")
		addWinner(gameData.first, ".finals-winner")
		addWinner(gameData.first, ".congrats-winner")

		document.querySelector(".mini-finals").innerText = ` ${gameData.miniFinals[0]} 🆚 ${gameData.miniFinals[1]}`
		document.querySelector(".finals").innerText = ` ${gameData.finals[0]} 🆚 ${gameData.finals[1]}`
		document.querySelector(".tournament-results").classList.remove("d-none")
		document.querySelector(".result-first").innerText = gameData.first;
		document.querySelector(".result-second").innerText = gameData.second;
		document.querySelector(".result-third").innerText = gameData.third;
		document.querySelector(".result-fourth").innerText = gameData.fourth;
	}
}

function initialPage()
{
	const tournamentBoard =  document.querySelector(".tournament-container")

	if (Object.keys(gameData).length === 0)
	{
		const content = document.getElementById("content");
		let error = document.createElement("p");
		error.setAttribute("data-i18n", "game.not-registered")
		content.appendChild(error)
		translateNewContent(content)
		return (1)
	}
	else
		tournamentBoard.classList.remove("d-none")
	return (0)
}

if (!initialPage())
	tournamentOverview()
