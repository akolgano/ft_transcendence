
function resetErrorField() {
	const errorDivs = document.querySelectorAll(".form-error");

	errorDivs.forEach(div => {
		div.innerHTML = ""
	});
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
		if (key == "error")
			errorClass = ".password-error";
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

async function addEventSignUpForm(e) {

	e.preventDefault();
	resetErrorField();
	if (!checkPasswordMatch())
		return ;

	const formData = new FormData(signupForm);
	try {
		const response = await fetch("http://127.0.0.1:8000/signup", {
			method: 'POST',
			body: formData,
		})
		const data = await response.json();
		if (!response.ok) {
			// console.log("Data from back: " + JSON.stringify(data));
			addErrorToHTML(data);
			throw new Error(JSON.stringify(data) || 'An error occurred');
		}
		if (data.token)
		{
			displayAlert("auth.sign-up-success", "success");
			urlRoute({ target: { href: '/' }, preventDefault: () => {} });
		}
		else
		{
			displayAlert("auth.error", "danger");
			console.log(data.message);
		}
	} catch (error) {
		console.log(error.message)
	}
}

function signUpScript() {
	console.log("SCRIPT SIGN UP")

	const signupForm = document.getElementById("signupForm");

	document.querySelectorAll(".toggle-password").forEach(node => {
		node.addEventListener("click", togglePassword)
	});
	signupForm.addEventListener("submit", addEventSignUpForm);
}

signUpScript();


// Data from back: {"username":["A user with that username already exists."],"email":["Enter a valid email address."]}
