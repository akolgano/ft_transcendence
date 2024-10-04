{
	console.log("SCRIPT SIGN UP")

	const signupForm = document.getElementById("signupForm");

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
			const response = await fetch("https://localhost/api/signup", {
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
				alert(translator.translateForKey("auth.sign-up-success", localStorage.getItem("preferred_language") || "en"))
				urlRoute({ target: { href: '/' }, preventDefault: () => {} });
			}
			else
			{
				// TO DO: Get the error message in english, then check what it is, depending on that, translate it.
				// console.log("Language: " + localStorage.getItem("preferred_language"))
				alert(translator.translateForKey("auth.error", localStorage.getItem("preferred_language") || "en") + data.message)
				console.log(data.message);
			}
		} catch (error) {
			alert(translator.translateForKey("auth.error", localStorage.getItem("preferred_language") || "en") + error.message)
			console.log(error.message)
		}
	})
}
