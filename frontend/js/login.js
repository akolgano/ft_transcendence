{
	console.log("SCRIPT LOG IN")

	const loginForm = document.getElementById("loginForm");

	loginForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		const formData = new FormData(loginForm);

		console.log("TRYING TO LOG IN")
		try {
			const response = await fetch("http://127.0.0.1:8000/login", {
				method: 'POST',
				body: formData,
			})
			const data = await response.json();
			if (!response.ok) {
				let errorMessage = data.error;
				throw new Error(errorMessage || 'An error occurred');
			}
			if (data.token)
			{
				// console.log("Token: " + data.token);
				// console.log("User: " + data.user);
				alert(translator.translateForKey("auth.login-success", localStorage.getItem("preferred_language") || "en"))
				localStorage.setItem("auth", 1);
				localStorage.setItem("user", data.user.username);
				localStorage.setItem("token", data.token);

				// Change navbar
				updateNavbar(true);

				urlRoute({ target: { href: '/' }, preventDefault: () => {} });
			}
			else
			{
				alert(translator.translateForKey("auth.login-error", localStorage.getItem("preferred_language") || "en"))
				console.log(data.message);
			}
		} catch (error) {
			alert(translator.translateForKey("auth.login-error", localStorage.getItem("preferred_language") || "en"))
			console.log(error.message)
		}
	})
}
