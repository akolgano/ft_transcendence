const togglePassword = (event) => {
	event.preventDefault()

	let button = event.currentTarget;
	let passwordId = button.getAttribute("data-password-field")
	let passwordField = document.getElementById(passwordId)

	if (passwordField.type == "password") {
		passwordField.type = "text"
		button.innerText = translator.translateForKey("auth.password-hide", siteLanguage)
	}
	else {
		passwordField.type = "password"
		button.innerText = translator.translateForKey("auth.password-show", siteLanguage)
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

function checkPasswordMatch() {
	let newPassword = document.getElementById("password").value;
	let repeatPassword = document.getElementById("confirm-password").value;

	if (newPassword !== repeatPassword)
	{
		const errorPassword = document.querySelector(".repeat-password-error");
		let errorTag = document.createElement("p");
		errorTag.innerText = translator.translateForKey("auth.password-no-match", siteLanguage);
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
			errorTag.innerText = message;
			errorDiv.appendChild(errorTag);
		});
	}
}

function resetErrorField() {
	const errorDivs = document.querySelectorAll(".form-error");

	errorDivs.forEach(div => {
		div.innerText = ""
	});
}

const escapeHTML = (str) => str
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#39;');

function sanitize(param) {
	let parser = new DOMParser();
	let doc = parser.parseFromString(param, 'text/html');
	let sanitized = doc.body.textContent || "";
	return (escapeHTML(sanitized.trim()));  // Return trimmed content
}

function sanitize_picture(picture) {
	let profile_pic = "http://localhost:8000" + picture;
	if (sanitize(profile_pic) !== profile_pic)
		profile_pic = "http://localhost:8000/default.jpg"
	return (profile_pic);
}

// function sanitizeFormData(formData) {
// 	let sanitizedFormData = new FormData();

// 	for (const [key, value] of formData.entries()) {
// 		if (key === "password") {
// 			sanitizedFormData.append(key, value);
// 			console.log("No sanitizing password");
// 		}
// 		sanitizedFormData.append(key, sanitize(value));
// 		console.log("sanitizing")
// 	}
// 	return (sanitizedFormData);
// }

// console.log("sanitized 1: " + sanitize("<script>alert(1)<script>"))
// console.log("sanitized 2: " + sanitize(`<img src="x" onerror="alert('XSS attacks!')">`))
// console.log("sanitized 3: " + sanitize("hello juliette"))
