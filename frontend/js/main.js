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
