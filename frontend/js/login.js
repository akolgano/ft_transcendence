{
	console.log("SCRIPT LOG IN")

	document.querySelectorAll(".toggle-password").forEach(node => {
		node.addEventListener("click", togglePassword)
	});

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
				console.log("Token: " + data.token);
				console.log("User: " + JSON.stringify(data.user));
				localStorage.setItem("auth", 1);
				localStorage.setItem("user", JSON.stringify(data.user));
				localStorage.setItem("token", data.token);

				alert(translator.translateForKey("auth.login-success", localStorage.getItem("preferred_language") || "en"))
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
			alert(translator.translateForKey("auth.login-ko", localStorage.getItem("preferred_language") || "en"))
			console.log(error.message)
		}
	})
}
