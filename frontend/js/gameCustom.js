console.log("Game customization script")

createTooltip()
function processGameOptions() {
	let gameSettings = {};
	const defaultGame = document.getElementById("default-game").checked;

	if (defaultGame === true)
	{
		gameSettings.paddleSize = 50
		gameSettings.defaultGame = true
	}
	else
	{
		gameSettings.defaultGame = false
		gameSettings.powerUp = document.getElementById("power-up").checked;
		// gameSettings.attack = document.getElementById("attack").checked;
		gameSettings.easyMode = document.getElementById("easy-mode").checked;
		paddleOptions = document.getElementsByName("paddle-size")
		for (const option of paddleOptions) {
			if (option.checked)
			{
				gameSettings.paddleSize = option.value
				break ;
			}
		}
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
