{
	console.log("SCRIPT LOG IN")

	const loginForm = document.getElementById("loginForm");

	loginForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		const formData = new FormData(loginForm);

		console.log("TRYING TO LOG IN")
		try {
			// let errorMessage = "";
			const response = await fetch("http://127.0.0.1:8000/login", {
				method: 'POST',
				body: formData,
			})
			const data = await response.json();
			if (!response.ok) {
				// console.log("Error response body error:", data.error);
				// if (Array.isArray(data.error)) {
				// 	data.error.forEach((message, index) => {
				// 		errorMessage += "\n • ";
				// 		errorMessage += message;
				// 	});
				// }
				// else
				let errorMessage = data.error;
				throw new Error(errorMessage || 'An error occurred');
			}
			if (data.token)
			{
				// console.log("Token: " + data.token);
				// console.log("User: " + data.user);
				alert("Login successful!");
				localStorage.setItem("auth", 1);
				localStorage.setItem("user", data.user.username);
				localStorage.setItem("token", data.token);
				urlRoute({ target: { href: '/' }, preventDefault: () => {} });
			}
			else
			{
				alert("Login failed: " + data.message);
			}
		} catch (error) {
			alert("Login failed: " + error.message);
		}
	})
}
