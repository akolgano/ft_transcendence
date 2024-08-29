
console.log("SCRIPT SIGN UP")

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	const formData = new FormData(signupForm);

	try {
		const response = await fetch("http://127.0.0.1:8000/signup", {
			method: 'POST',
			body: formData,
		})

		const data = await response.json();
		console.log("RESPONSE: " + response);
		if (!response.ok) {
			// console.log(`Error ${response.status}: ${response.statusText}`);
			console.log("Error response body:", data);
			throw new Error(data.error || 'An error occurred');
		}
		console.log("Data: " + data);
		if (data.token)
		{
			console.log("Sign up successful!");
			alert("Sign up successful!");
			// window.location.href = "index.html";
			// const event = new MouseEvent('click', { bubbles: true, cancelable: true});
			// const link = document.createElement('a');
			// link.href = "/friends";
			// link.classList.add("spa");
			// link.dispatchEvent(event);
			document.getElementById("content").innerHTML = "<p>Sign up successful</p>"

			// urlRoute({ target: { href: '/friends' } });
		}
		else
		{
			alert("Sign up failed: " + data.message);
		}
	} catch (error) {
		alert("Sign up failed: " + error);
	}
})
