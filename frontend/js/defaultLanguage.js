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
			// defaultLanguage.querySelector(".language-error").value = "This is already the current language"
			alert("this is already the default language")
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
			if (!response.ok) {
				// console.log("Data json: " + JSON.stringify(data))
				throw new Error('An error occurred');
			}
			if (data.detail)
			{
				alert("Language changed succesfully")
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
				alert("Unexpected error. Unable to change language.")
				console.log(data.message);
			}
		} catch (error) {
			alert("Error changing language.\n" + error.message)
			console.log(error.message)
		}
	})
}
