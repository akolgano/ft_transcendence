console.log("DefaultLanguage")

{
	const defaultLanguage = document.getElementById("defaultLanguage");

	defaultLanguage.addEventListener("submit", async (e) => {
		e.preventDefault();

		let selectElement = document.getElementById("selectLanguage")
		let selectedLanguage = selectElement.options[selectElement.selectedIndex].value;
		// console.log("selected value: " + selectedLanguage)

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
				urlRoute({ target: { href: '/account' }, preventDefault: () => {} });
			}
			else
			{
				// TO DO: Get the error message in english, then check what it is, depending on that, translate it.
				// console.log("Language: " + localStorage.getItem("preferred_language"))
				console.log("check 7")
				alert("Unexpected error. Unable to change language.")
				console.log(data.message);
				console.log("check 8")
			}
		} catch (error) {
			alert("Error changing language.\n" + error.message)
			console.log(error.message)
		}
	})
}
