console.log("GAME SCRIPT")

function checkGuestName(params) {
	const guestName = document.getElementById("opponent-name").value;
	let error = 0

	if (guestName.size > 20)
	{
		error = 1
		return registrationError("game.max-size", ".opponent-error");
	}
	if ((!guestName.match(/^[0-9a-zA-Z_]+$/)))
	{
		error = 1
		return registrationError("game.reg-alphanum", ".opponent-error");
	}
	if ( guestName === "AI")
	{
		error = 1
		return registrationError("game.reg-no-ai", ".opponent-error");
	}
	if (guestName === JSON.parse(localStorage.getItem("user")).username)
	{
		error = 1
		return registrationError("game.reg-same-user", ".opponent-error")
	}
	return guestName;
}

function registerOpponent(event) {
	event.preventDefault();

	resetErrorField();
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

	document.getElementById("AI-opponent").addEventListener("click", toggleOpponentsField)
	const registerGuestName = document.getElementById("opponentsNameForm");
	registerGuestName.addEventListener("submit", registerOpponent);
}

SignUpSimpleGame();
