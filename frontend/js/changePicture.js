{
	const changeProfilePic = document.getElementById("changePicture");

	changeProfilePic.addEventListener("submit", async (e) => {
		e.preventDefault();
		if (!checkValidToken())
			return;
		const formData = new FormData(changeProfilePic);
		removeAlert();

		try {
			const response = await fetch("https://localhost/api/change_profile_picture/", {
				headers: {
					'Authorization': `Token ${localStorage.getItem("token")}`,
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

			if (response.status === 413)
			{
				throw new Error("File too large");
			}
			if (!response.ok) {
				console.log("Data json: " + JSON.stringify(data))
				throw new Error(data.error || 'An error occurred');
			}
			if (data.user)
			{
				localStorage.setItem("user", JSON.stringify(data.user));
				document.querySelector('.avatar-sm').src = "https://localhost" + JSON.parse(localStorage.getItem("user")).profile_picture;
				document.querySelector(".profile-pic").src = "https://localhost" + JSON.parse(localStorage.getItem("user")).profile_picture;
				displayAlert("account.change-pic-success", "success");
				document.getElementById("profile_picture").value = "";
			}
			else
			{
				displayAlert("account.change-pic-error", "danger");
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
			else if (error.message == "No profile picture uploaded.")
				displayAlert("account.change-pic-empty", "danger");
			else if (error.message == "File too large")
				displayAlert("account.change-pic-too-large", "danger");
			else
				displayAlert("account.change-pic-error", "danger");
			console.log(error.message)
		}
	})
}

// Unexpected error. Unable to change profile picture.
