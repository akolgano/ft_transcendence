{
	console.log("SCRIPT SIGN UP")

	const signupForm = document.getElementById("signupForm");

	document.querySelectorAll(".toggle-password").forEach(node => {
		node.addEventListener("click", togglePassword)
	});

	signupForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		let newPassword = document.getElementById("password").value;
		let repeatPassword = document.getElementById("confirm-password").value;

		if (newPassword !== repeatPassword)
		{
			alert("Passwords do not match");
			return ;
		}

		const formData = new FormData(signupForm);
		try {
			let errorMessage = "";
			const response = await fetch("http://127.0.0.1:8000/signup", {
				method: 'POST',
				body: formData,
			})
			const data = await response.json();
			if (!response.ok) {
				// console.log("Data from back: " + Object.values(data));
				let errors_array = Object.values(data);
				errors_array.forEach((message, index) => {
					errorMessage += "\n • ";
					errorMessage += message;
				});
				throw new Error(errorMessage || 'An error occurred');
			}
			if (data.token)
			{
				alert(translator.translateForKey("auth.sign-up-success", siteLanguage))
				urlRoute({ target: { href: '/' }, preventDefault: () => {} });
			}
			else
			{
				// TO DO: Get the error message in english, then check what it is, depending on that, translate it.
				// console.log("Language: " + siteLanguage)
				alert(translator.translateForKey("auth.error", siteLanguage) + data.message)
				console.log(data.message);
			}
		} catch (error) {
			alert(translator.translateForKey("auth.error", siteLanguage) + error.message)
			console.log(error.message)
		}
	})
}
