function formatDate(date) {

	const utcDate = new Date(date)

	const options = {
		timeZone: 'Asia/Singapore',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	};

	// Get the formatted date and time string
	const formattedDate = utcDate.toLocaleString('en-GB', options);
	return (formattedDate);
}

let gameData = {};

const togglePassword = (event) => {
	event.preventDefault()

	let button = event.currentTarget;
	let passwordId = button.getAttribute("data-password-field")
	let passwordField = document.getElementById(passwordId)
	const passwordDiv = document.querySelector(".set-password")
	let togglePassword = document.querySelector(`[data-password-field="${passwordId}"]`)

	if (passwordField.type == "password") {
		passwordField.type = "text"
		togglePassword.setAttribute("data-i18n", "auth.password-hide")
		translateNewContent(passwordDiv)
	}
	else {
		passwordField.type = "password"
		togglePassword.setAttribute("data-i18n", "auth.password-show")
		translateNewContent(passwordDiv)
	}
}

const displayAlert = (key, type) => {
	// Previous alert should be already deleted before, but just to make sure
	removeAlert()
	if (key === null)
		key = "error-fetch";
	const content = document.querySelector("#content");
	const alert = `<div class="alert alert-${type} alert-dismissible fade show position-absolute" role="alert">
	<span data-i18n="${key}"></span>
	<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`
	content.insertAdjacentHTML("beforebegin", alert);
	translateNewContent(document.querySelector(".alert"));
}

const removeAlert = () => {
	const alert = document.querySelector(".alert");
	if (alert)
		alert.remove();
}

function validUsername() {
	const username = document.getElementById("username").value
	let error = 0
	if (username.length > 20)
	{
		error = 1
		return (registrationError("auth.username-too-long", ".username-error"))
	}
	else if (!username.match(/^[\p{L}\d_]+$/u))
	{
		error = 1
		return (registrationError("auth.username-invalid-char", ".username-error"))
	}
	return (error ? false : true)
}

function checkPasswordMatch() {
	let newPassword = document.getElementById("password").value;
	let repeatPassword = document.getElementById("confirm-password").value;
	let error = 0

	if (newPassword.length < 8)
	{
		error = 1
		registrationError("auth.password-too-short", ".repeat-password-error")
	}

	if (newPassword !== repeatPassword)
	{
		error = 1
		registrationError("auth.password-no-match", ".repeat-password-error")
	}
	return (error === 1 ? false : true)
}

function registrationError(translation, selector) {
	const errorGuestName = document.querySelector(selector);
	let errorTag = document.createElement("p");
	errorTag.setAttribute("data-i18n", translation)
	errorGuestName.appendChild(errorTag)
	translateNewContent(errorGuestName)
	return (null);
}

function addErrorToHTML(data) {
	for (const key in data)
	{
		let errorClass;
		if (key == "error" || key == "new_password")
			errorClass = ".password-error";
		else if (key == "old_password")
			errorClass = ".old-password-error"
		else if (key == "detail")
		{
			removeAlert();
			displayAlert("error-fetch", "danger");
			console.log(data)
			return ;
		}
		else
			errorClass = `.${key}-error`;

		const errorDiv = document.querySelector(errorClass);
		if (errorDiv == null)
			return ;

		data[key].forEach(message => {
			let errorTag = document.createElement("p");
			errorTag.innerHTML = message;
			errorDiv.appendChild(errorTag);
		});
	}
}

function resetErrorField(selector) {
	const errorDivs = document.querySelectorAll(selector);

	errorDivs.forEach(div => {
		div.innerHTML = ""
	});
}

const hasDuplicates = (arr) => arr.length !== new Set(arr).size;

function getCurrentGame() {

	let nextGame;
	switch (gameData.currentGame) {
		case SEMI1:
			nextGame = "Semi-finals 1"
			break;
		case SEMI2:
			nextGame =  "Semi-finals 2"
			break;
		case MINIFINALS:
			nextGame =  "Mini finals"
			break;
		case FINALS:
			nextGame = "Finals"
			break;
		default: "Others"
			break;
	}
	return (nextGame)
}

const SEMI1 = 1;
const SEMI2 = 2;
const MINIFINALS = 3;
const FINALS = 4;
