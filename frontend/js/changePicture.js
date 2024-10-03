{
	const changeProfilePic = document.getElementById("changePicture");

	changeProfilePic.addEventListener("submit", async (e) => {
		e.preventDefault();

		const formData = new FormData(changeProfilePic);

		try {
			const response = await fetch("http://127.0.0.1:8000/change-profile-picture/", {
				headers: {
					'Authorization': `Token ${localStorage.getItem("token")}`,
				},
				method: 'POST',
				body: formData,
			})
			const data = await response.json();
			removeAlert();
			if (!response.ok) {
				console.log("Data json: " + JSON.stringify(data))
				throw new Error(data.error || 'An error occurred');
			}
			if (data.user)
			{
				localStorage.setItem("user", JSON.stringify(data.user));
				document.querySelector('.avatar-sm').src = "http://localhost:8000" + JSON.parse(localStorage.getItem("user")).profile_picture;
				document.querySelector(".profile-pic").src = "http://localhost:8000" + JSON.parse(localStorage.getItem("user")).profile_picture;
				displayAlert("account.change-pic-success", "success");
			}
			else
			{
				displayAlert("account.change-pic-error", "danger");
				console.log(data.message);
			}
		} catch (error) {
			if (error.message == "No profile picture uploaded.")
				displayAlert("account.change-pic-empty", "danger");
			else
				displayAlert("account.change-pic-error", "danger");
			console.log(error.message)
		}
	})
}

// Unexpected error. Unable to change profile picture.
