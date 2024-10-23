console.log("DEFAULT LANG SCRIPT")

{
	const defaultLanguage = document.getElementById("defaultLanguage");

	defaultLanguage.addEventListener("submit", async (e) => {
		e.preventDefault();

		let selectElement = document.getElementById("selectLanguage")
		let selectedLanguage = selectElement.options[selectElement.selectedIndex].value;

		const formData = new FormData();
		formData.append("language", selectedLanguage);

		removeAlert();
		if (selectedLanguage == JSON.parse(localStorage.getItem("user")).language)
		{
			displayAlert("account.already-language", "warning");
			return ;
		}

		try {
			const response = await fetch("https://localhost/api/change_language/", {
				headers: {
					'Authorization': `Token ${localStorage.getItem("token")}`,
					'Accept': 'application/json',
				},
				method: 'PATCH',
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
				// console.log("Data json: " + JSON.stringify(data))
				throw new Error(data.error || 'An error occurred');
			}
			if (data.detail)
			{
				displayAlert("account.change-language-success", "success");
				translator.translatePageTo(selectedLanguage);

				// Update current site language
				siteLanguage = selectedLanguage;

				// Update user instance of preferred language
				let user = JSON.parse(localStorage.getItem('user'));
				user.language = selectedLanguage;
				localStorage.setItem("user", JSON.stringify(user));
				console.log("USER: " + user);
			}
			else
			{
				displayAlert("account.change-language-error", "danger");
				console.log(data.message);
			}
		} catch (error) {
			if (error.message === '"Invalid token."') {
				localStorage.removeItem("user")
				localStorage.removeItem("token")
				localStorage.removeItem("expiry_token")
				updateNavbar(false)
				urlRoute({ target: { href: '/login' }, preventDefault: () => {} });
				displayAlert("auth.login-again", "danger");
			}
			else if (error.message == "Language is required.")
				displayAlert("account.change-language-empty", "danger");
			else if (error.message == "Unsupported language.")
				displayAlert("account.change-language-unsupported", "danger");
			else
				displayAlert("account.change-language-error", "danger");
			console.log(error.message)
		}
	})
}
