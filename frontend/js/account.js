{
	console.log("Account script")

	let user = JSON.parse(localStorage.getItem("user"));
	console.log(user);

	document.querySelector('.input-username').value = user.username
	document.querySelector('.input-email').value = user.email
	document.querySelector(".profile-pic").src = "http://localhost:8000" + user.profile_picture


	const changePassword = document.getElementById("changePassword");

	changePassword.addEventListener("submit", async (e) => {
		e.preventDefault();

		let oldPassword = document.getElementById("old-password").value;
		let newPassword = document.getElementById("new-password").value;
		let repeatPassword = document.getElementById("repeat-password").value;

		if (newPassword !== repeatPassword)
		{
			alert("Passwords do not match");
			return ;
		}

		const formData = new FormData();
		formData.append("old_password", oldPassword);
		formData.append("new_password", newPassword);

		try {
			const response = await fetch("http://127.0.0.1:8000/change_password/", {
				headers: {
					'Authorization': `Token ${localStorage.getItem("token")}`,
				},
				method: 'PATCH',
				body: formData,
			})
			const data = await response.json();
			if (!response.ok) {
				console.log("Data json: " + JSON.stringify(data))
				let errorMessage = "";

				for (let [key, value] of Object.entries(data)) {
					errorMessage += key;
					value.forEach(message => {
						errorMessage += "\n    • ";
						errorMessage += message;
					});
				}

				throw new Error(errorMessage || 'An error occurred');
			}
			if (data.detail)
			{
				alert("Password changed successfully")
				urlRoute({ target: { href: '/account' }, preventDefault: () => {} });
			}
			else
			{
				// TO DO: Get the error message in english, then check what it is, depending on that, translate it.
				// console.log("Language: " + localStorage.getItem("preferred_language"))
				alert("Unexpected error. Unable to change password.")
				console.log(data.message);
			}
		} catch (error) {
			alert("Error changing password.\n" + error.message)
			console.log(error.message)
		}
	})
}


// Error message: {"new_password":["This password is too short. It must contain at least 5 characters.","This password is too common."]}
