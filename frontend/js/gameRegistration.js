console.log("GAME SCRIPT")

function checkGuestName(params) {
	const guestName = document.getElementById("opponent-name").value;
	let error = 0
	console.log("Checking guest name")
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

function registerOpponent(event) {
	event.preventDefault();
	if (!checkValidToken())
		return;
	resetErrorField(".opponent-error");
	let guestName;
	const checkbox = document.getElementById("AI-opponent").checked;

	if (checkbox === true)
		guestName = "AI"
	else {
		guestName = checkGuestName()
		if (!guestName)
			return ;
	}

	localStorage.setItem("guestName", guestName);
	urlRoute({ target: { href: "/pong" }, preventDefault: () => {} });

	// opponentsNameForm = document.getElementById("opponentsNameForm")
	// const formData = new FormData(opponentsNameForm);
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
	registerGuestName.addEventListener("submit", registerOpponent);
}

SignUpSimpleGame();
