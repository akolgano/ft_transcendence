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

				siteLanguage = data.user.language;
				localStorage.setItem("token", data.token);

				translator.translatePageTo(siteLanguage);
				alert(translator.translateForKey("auth.login-success", siteLanguage))

				// Change navbar
				updateNavbar(true);
				urlRoute({ target: { href: '/' }, preventDefault: () => {} });
			}
			else
			{
				alert(translator.translateForKey("auth.login-error", siteLanguage))
				console.log(data.message);
			}
		} catch (error) {
			alert(translator.translateForKey("auth.login-ko", siteLanguage))
			console.log(error.message)
		}
	})
}
