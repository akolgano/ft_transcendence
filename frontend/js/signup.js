
async function addEventSignUpForm(e) {

	e.preventDefault();
	resetErrorField();
	if (!checkPasswordMatch())
		return ;

	const formData = new FormData(signupForm);
	try {
		const response = await fetch("https://localhost/api/signup", {
			method: 'POST',
			body: formData,
		})
		const data = await response.json();
		removeAlert();
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
