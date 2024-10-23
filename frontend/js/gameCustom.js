console.log("Game customization script")
createTooltip()

 function toggleGameOptions(event) {
	const options = document.querySelectorAll(".game-option")
	options.forEach(option => {
		const checked = event.target.checked
		if (checked)
		{
			option.value = ""
			option.disabled = "disabled"
		}
		else
			option.disabled = ""
	});

}

document.querySelector(".game-default").addEventListener("click", toggleGameOptions)
