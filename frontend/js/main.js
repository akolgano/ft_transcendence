const togglePassword = (event) => {
	event.preventDefault()

	let button = event.currentTarget;
	let passwordId = button.getAttribute("data-password-field")
	let passwordField = document.getElementById(passwordId)

	if (passwordField.type == "password") {
		passwordField.type = "text"
		button.innerHTML = translator.translateForKey("auth.password-hide", siteLanguage)
	}
	else {
		passwordField.type = "password"
		button.innerHTML = translator.translateForKey("auth.password-show", siteLanguage)
	}
}

const displayAlert = (key, type) => {
	const content = document.querySelector("#content");
	const alert = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
	${translator.translateForKey(key, siteLanguage)}
	<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>`
	content.insertAdjacentHTML("beforebegin", alert);
}

const removeAlert = () => {
	const alert = document.querySelector(".alert");
	if (alert)
		alert.remove();
}

function checkPasswordMatch() {
	let newPassword = document.getElementById("password").value;
	let repeatPassword = document.getElementById("confirm-password").value;

	if (newPassword !== repeatPassword)
	{
		const errorPassword = document.querySelector(".repeat-password-error");
		let errorTag = document.createElement("p");
		errorTag.innerHTML = "Passwords do not match";
		errorPassword.appendChild(errorTag);
		return (false);
	}
	return (true);
}

function addErrorToHTML(data) {
	for (const key in data)
	{
		let errorClass;
		if (key == "error" || key == "new_password")
			errorClass = ".password-error";
		else if (key == "old_password")
			errorClass = ".old-password-error"
		else
			errorClass = `.${key}-error`;

		const errorDiv = document.querySelector(errorClass);

		data[key].forEach(message => {
			let errorTag = document.createElement("p");
			errorTag.innerHTML = message;
			errorDiv.appendChild(errorTag);
		});
	}
}

function resetErrorField() {
	const errorDivs = document.querySelectorAll(".form-error");

	errorDivs.forEach(div => {
		div.innerHTML = ""
	});
}
