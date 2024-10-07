{
	console.log("SCRIPT LOG IN")
	async function login(e) {

		e.preventDefault();
		const formData = new FormData(loginForm);

		try {
			const response = await fetch("https://localhost/api/login", {
				method: 'POST',
				body: formData,
			})
			const data = await response.json();
			removeAlert();

			if (!response.ok) {
				throw new Error("auth.login-error");
			}
			if (data.token)
			{
				console.log("User: " + JSON.stringify(data.user));

				localStorage.setItem("auth", 1);
				localStorage.setItem("user", JSON.stringify(data.user));

				siteLanguage = data.user.language;
				localStorage.setItem("token", data.token);

				translator.translatePageTo(siteLanguage);

				updateNavbar(true);

				if (last_page == "/login")
					last_page = "/"
				urlRoute({ target: { href: last_page }, preventDefault: () => {} });
				displayAlert("auth.login-success", "success");
			}
			else
			{
				displayAlert("auth.login-error", "danger");
			}
		} catch (error) {
			displayAlert(error.message, "danger");
		}
	}

	const loginScript = () => {
		document.querySelectorAll(".toggle-password").forEach(node => {
			node.addEventListener("click", togglePassword)
		});

		const loginForm = document.getElementById("loginForm");
		loginForm.addEventListener("submit", login);
	}

	loginScript();
}

// Data from back: {"detail":"No CustomUser matches the given query."}
