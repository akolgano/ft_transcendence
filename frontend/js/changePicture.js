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
			if (!response.ok) {
				console.log("Data json: " + JSON.stringify(data))
				let errorMessage = Object.entries(data);

				throw new Error(errorMessage || 'An error occurred');
			}
			if (data.user)
			{
				localStorage.setItem("user", JSON.stringify(data.user));
				document.querySelector('.avatar-sm').src = "http://localhost:8000" + JSON.parse(localStorage.getItem("user")).profile_picture;
				document.querySelector(".profile-pic").src = "http://localhost:8000" + JSON.parse(localStorage.getItem("user")).profile_picture;
				alert("Picture changed successfully")
			}
			else
			{
				// TO DO: Get the error message in english, then check what it is, depending on that, translate it.
				// console.log("Language: " + siteLanguage)
				alert("Unexpected error. Unable to change profile picture.")
				console.log(data.message);
			}
		} catch (error) {
			alert("Error changing profile picture.\n" + error.message)
			console.log(error.message)
		}
	})
}

// Unexpected error. Unable to change profile picture.
