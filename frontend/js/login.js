
async function login(e) {

	e.preventDefault();
	const formData = new FormData(loginForm);

	removeAlert();
	try {
		const response = await fetch("https://localhost/api/login", {
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
			throw new Error("auth.login-error");
		}
		if (data.token)
		{
			data.user.username = sanitize(data.user.username)
			data.user.email = sanitize(data.user.email)
			data.user.profile_picture = sanitize_picture(data.user.profile_picture)
			localStorage.setItem("user", JSON.stringify(data.user));
			let expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
			localStorage.setItem("expiry_token", expiry)


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
		if (error instanceof TypeError && error.message.includes('Failed to fetch'))
		{
				displayAlert("auth.cert-error", "danger");
				location.reload();
		}
		else
		{
			if (error.message === "auth.login-error")
				displayAlert(error.message, "danger");
			else
				displayAlert("error-fetch", "danger");
		}
	}
}

function loginScript () {
	document.querySelectorAll(".toggle-password").forEach(node => {
		node.addEventListener("click", togglePassword)
	});

	const loginForm = document.getElementById("loginForm");
	loginForm.addEventListener("submit", login);
}

loginScript();
