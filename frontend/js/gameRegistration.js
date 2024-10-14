console.log("GAME SCRIPT")

function checkGuestName(params) {
	const guestName = document.getElementById("opponent-name").value;

	if (guestName === JSON.parse(localStorage.getItem("user")).username){
		const errorGuestName = document.querySelector(".opponent-error");
		let errorTag = document.createElement("p");
		errorTag.innerHTML = translator.translateForKey("game.opponent-name-error", siteLanguage);
		errorGuestName.appendChild(errorTag);
		return (NULL);
	}
	return guestName;
}

function registerOpponent(event) {
	event.preventDefault();

	resetErrorField();
	let guestName;
	const checkbox = document.getElementById("AI-opponent").checked;
	console.log("Checkbox: " + checkbox)

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
