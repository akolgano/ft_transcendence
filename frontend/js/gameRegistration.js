console.log("GAME SCRIPT")

function checkGuestName(params) {
	const guestName = document.getElementById("opponent-name").value;

	if (guestName === JSON.parse(localStorage.getItem("user")).username){
		const errorGuestName = document.querySelector(".opponent-error");
		let errorTag = document.createElement("p");
		errorTag.innerHTML = translator.translateForKey("game.opponent-name-error", siteLanguage);
		errorGuestName.appendChild(errorTag);
		return (false);
	}
	return true;
}

function registerOpponent(event) {
	event.preventDefault();

	resetErrorField();
	if (!checkGuestName())
		return ;

	urlRoute({ target: { href: "/pong" }, preventDefault: () => {} });

	// opponentsNameForm = document.getElementById("opponentsNameForm")
	// const formData = new FormData(opponentsNameForm);

}

function SignUpSimpleGame() {

	const registerGuestName = document.getElementById("opponentsNameForm");
	registerGuestName.addEventListener("submit", registerOpponent);
}

SignUpSimpleGame();
