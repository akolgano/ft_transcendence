
console.log("SCRIPT SIGN UP")

const signupForm = document.getElementById("signupForm");
console.log("HELLO\n");
signupForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const formData = new FormData(signupForm);

	fetch("http://127.0.0.1:8000/signup", {
		method: 'POST',
		body: formData,
	})
	.then(response => {
		if (response.ok) {
			return (response.json());
		} else {
			return response.json().then(data => {
                throw new Error(data.message || 'An error occurred'); // Use data.message or a default error message
            });
		}
	})
	.then(data => {
		console.log(data);
		if (data.token)
		{
			console.log("Sign up successful!");
			alert("Sign up successful!");
			window.location.href = "index.html";
		}
		else
		{
			alert("Sign up failed: " + data.message);
		}
	})
	.catch(error=> {
		console.error('Error: ', error);
	})
})
