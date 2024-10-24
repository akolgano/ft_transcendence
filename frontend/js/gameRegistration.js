console.log("GAME SCRIPT")

function checkGuestName(params) {
	const guestName = document.getElementById("opponent-name").value;
	let error = 0
	if (guestName.length > 20)
	{
		error = 1
		console.log("HERE")
		registrationError("game.max-size", ".opponent-error");
	}
	if (guestName != guestName.trim())
	{
		error = 1
		registrationError("game.trailing-spaces", ".opponent-error");
	}
	if ((!guestName.match(/^[\p{L}\d_]+$/u)))
	{
		error = 1
		registrationError("game.reg-alphanum", ".opponent-error");
	}
	if ( guestName === "AI")
	{
		error = 1
		registrationError("game.reg-no-ai", ".opponent-error");
	}
	if (guestName === JSON.parse(localStorage.getItem("user")).username)
	{
		error = 1
		registrationError("game.reg-same-user", ".opponent-error")
	}
	return (error ? null : guestName)
}

function gameOptions(event) {
	event.preventDefault();
	if (!checkValidToken())
		return;

	guestName = registerOpponent()
	if (!guestName)
		return;

	let gameSettings = {};
	gameSettings.guestName = guestName;
	const defaultGame = document.getElementById("default-game").checked;

	if (defaultGame === true)
	{
		gameSettings.defaultGame = true
	}
	else
	{
		gameSettings.defaultGame = false
		gameSettings.powerUp = document.getElementById("power-up").checked;
		gameSettings.attack = document.getElementById("attack").checked;
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
	console.log(gameSettings);
	localStorage.setItem("gameSettings", JSON.stringify(gameSettings));

	urlRoute({ target: { href: "/pong" }, preventDefault: () => {} });
}

function registerOpponent() {

	resetErrorField(".opponent-error");
	let guestName;
	const checkbox = document.getElementById("AI-opponent").checked;

	if (checkbox === true)
		guestName = "AI"
	else {
		guestName = checkGuestName()
		if (!guestName)
			return (null);
	}
	return (guestName);
}

function toggleOpponentsField(event) {
	const nameField = document.getElementById("opponent-name")
	const checked = event.target.checked
	if (checked)
	{
		nameField.value = ""
		nameField.disabled = "disabled"
	}
	else
		nameField.disabled = ""

}

function SignUpSimpleGame() {

	document.querySelector(".user-versus").innerText = `${JSON.parse(localStorage.getItem("user")).username} vs.`
	document.getElementById("AI-opponent").addEventListener("click", toggleOpponentsField)
	const registerGuestName = document.getElementById("opponentsNameForm");
	registerGuestName.addEventListener("submit", gameOptions);
}

SignUpSimpleGame();
