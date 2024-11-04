
createTooltip()
function processGameOptions() {
	let gameSettings = {};
	const defaultGame = document.getElementById("default-game").checked;
	gameSettings.progression = []

	if (defaultGame === true)
	{
		gameSettings.paddleSize = 55
		gameSettings.defaultGame = true
		gameSettings.powerUp = false
	}
	else
	{
		gameSettings.defaultGame = false
		gameSettings.powerUp = document.getElementById("power-up").checked;
		if (gameSettings.powerUp)
		{
			gameSettings.powerUpGuest = 3;
			gameSettings.powerUpUser = 3;
		}
		gameSettings.easyMode = document.getElementById("easy-mode").checked;
		paddleOptions = document.getElementsByName("paddle-size")
		for (const option of paddleOptions) {
			if (option.checked)
			{
				gameSettings.paddleSize = option.value
				break ;
			}
		}
		if (!gameSettings.paddleSize)
			gameSettings.paddleSize = 55

	}
	return (gameSettings)
}

function toggleGameOptions(event) {
	const options = document.querySelectorAll(".game-option")
	options.forEach(option => {
		const checked = event.target.checked
		if (checked)
			option.disabled = "disabled"
		else
			option.disabled = ""
	});
}

document.querySelector(".game-default").addEventListener("click", toggleGameOptions)
