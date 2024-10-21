
async function addEventSignUpForm(e) {

	e.preventDefault();
	resetErrorField(".form-error");
	let error = 0
	if (!checkPasswordMatch())
		error = 1
	if (!validUsername())
		error = 1
	if (!validEmail())
		error = 1
	if (error)
		return ;

	const formData = new FormData(signupForm);
	let formErrors = 0;
	removeAlert();
	try {
		const response = await fetch("https://localhost/api/signup", {
			headers: {
				'Accept': 'application/json',
			},
			method: 'POST',
			body: formData,
		})

		let data;
		const contentType = response.headers.get('Content-Type');
		if (contentType && contentType.includes('application/json')) {
			data = await response.json();
		} else {
			data = await response.text();
		}

		if (!response.ok) {
			// console.log("Data from back: " + JSON.stringify(data));
			addErrorToHTML(data);
			formErrors = 1;
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
		}
	} catch (error) {
		console.log(error.message)
		if (!formErrors)
			displayAlert("error-fetch", "danger");
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
