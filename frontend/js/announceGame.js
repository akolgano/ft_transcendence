function addWinner(name, selector) {
	const winner = document.querySelector(selector)
	winner.innerText = name;
}


function tournamentOverview(gameSettings) {

	document.querySelector(".semi-1").innerText = ` ${gameSettings.firstSemi[0]} 🆚 ${gameSettings.firstSemi[1]}`
	document.querySelector(".semi-2").innerText = ` ${gameSettings.secondSemi[0]} 🆚 ${gameSettings.secondSemi[1]}`
	if (gameSettings.currentGame)
		document.querySelector(".play-btn").classList.remove("d-none")
	if (gameSettings.currentGame === SEMI1 )
	{
		document.querySelector(".semi-1-container").classList.add("border", "border-3", "border-warning")
	}

	else if (gameSettings.currentGame === SEMI2 )
	{
		document.querySelector(".semi-2-container").classList.add("border", "border-3", "border-warning")
		addWinner(gameSettings.finals[0], ".semi-1-winner")

		document.querySelector(".mini-finals").innerText = ` ${gameSettings.miniFinals[0]} 🆚 ?`
		document.querySelector(".finals").innerText = ` ${gameSettings.finals[0]} 🆚 ?`
	}
	else if (gameSettings.currentGame === MINIFINALS)
	{
		addWinner(gameSettings.finals[0], ".semi-1-winner")
		addWinner(gameSettings.finals[1], ".semi-2-winner")

		document.querySelector(".mini-finals-container").classList.add("border", "border-3", "border-warning")

		document.querySelector(".mini-finals").innerText = ` ${gameSettings.miniFinals[0]} 🆚 ${gameSettings.miniFinals[1]}`
		document.querySelector(".finals").innerText = ` ${gameSettings.finals[0]} 🆚 ${gameSettings.finals[1]}`
	}
	else if (gameSettings.currentGame === FINALS)
	{
		addWinner(gameSettings.finals[0], ".semi-1-winner")
		addWinner(gameSettings.finals[1], ".semi-2-winner")
		addWinner(gameSettings.third, ".mini-finals-winner")

		document.querySelector(".finals-container").classList.add("border", "border-3", "border-warning")

		document.querySelector(".mini-finals").innerText = ` ${gameSettings.miniFinals[0]} 🆚 ${gameSettings.miniFinals[1]}`
		document.querySelector(".finals").innerText = ` ${gameSettings.finals[0]} 🆚 ${gameSettings.finals[1]}`
	}
	else if (gameSettings.currentGame == null)
	{
		addWinner(gameSettings.finals[0], ".semi-1-winner")
		addWinner(gameSettings.finals[1], ".semi-2-winner")
		addWinner(gameSettings.third, ".mini-finals-winner")
		addWinner(gameSettings.first, ".finals-winner")
		addWinner(gameSettings.first, ".congrats-winner")

		document.querySelector(".mini-finals").innerText = ` ${gameSettings.miniFinals[0]} 🆚 ${gameSettings.miniFinals[1]}`
		document.querySelector(".finals").innerText = ` ${gameSettings.finals[0]} 🆚 ${gameSettings.finals[1]}`
		document.querySelector(".tournament-results").classList.remove("d-none")
		document.querySelector(".result-first").innerText = gameSettings.first;
		document.querySelector(".result-second").innerText = gameSettings.second;
		document.querySelector(".result-third").innerText = gameSettings.third;
		document.querySelector(".result-fourth").innerText = gameSettings.fourth;
		localStorage.removeItem("gameSettings")
	}
}

function initialPage(gameSettings)
{
	const tournamentBoard =  document.querySelector(".tournament-container")

	if (gameSettings === null)
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

function announceGameScript() {

	let gameSettings = JSON.parse(localStorage.getItem("gameSettings"))

	if (!initialPage(gameSettings))
		tournamentOverview(gameSettings)
}

announceGameScript()
