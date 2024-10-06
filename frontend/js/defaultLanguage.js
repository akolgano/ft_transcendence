console.log("DefaultLanguage")

{
	const defaultLanguage = document.getElementById("defaultLanguage");

	defaultLanguage.addEventListener("submit", async (e) => {
		e.preventDefault();

		let selectElement = document.getElementById("selectLanguage")
		let selectedLanguage = selectElement.options[selectElement.selectedIndex].value;

		const formData = new FormData();
		formData.append("language", selectedLanguage);

		if (selectedLanguage == JSON.parse(localStorage.getItem("user")).language)
		{
			removeAlert();
			displayAlert("account.already-language", "warning");
			return ;
		}

		try {
			const response = await fetch("http://127.0.0.1:8000/change_language/", {
				headers: {
					'Authorization': `Token ${localStorage.getItem("token")}`,
				},
				method: 'PATCH',
				body: formData,
			})
			const data = await response.json();
			removeAlert();
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
			if (error.message == "Language is required.")
				displayAlert("account.change-language-empty", "danger");
			else if (error.message == "Unsupported language.")
				displayAlert("account.change-language-unsupported", "danger");
			else
				displayAlert("account.change-language-error", "danger");
			console.log(error.message)
		}
	})
}
