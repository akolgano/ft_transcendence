{
	const changeUsername = document.getElementById("changeUsername");

	changeUsername.addEventListener("submit", async (e) => {
		e.preventDefault();
		resetErrorField(".username-error")
		if (!validUsername())
			return ;

		const new_username = document.getElementById("username").value
		if (new_username === JSON.parse(localStorage.getItem("user")).username)
			{
				displayAlert("account.change-username-same", "danger");
				return ;
			}
		const formData = new FormData();
		formData.append("new_username", new_username);
		removeAlert();

		try {
			const response = await fetch("https://localhost/api/change_username/", {
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
				console.log("Data json: " + JSON.stringify(data))
				throw new Error(data.new_username || 'An error occurred');
			}
			if (data.detail)
			{
				let user = JSON.parse(localStorage.getItem("user"));
				user.username = new_username;
				localStorage.setItem("user", JSON.stringify(user));
				console.log(JSON.parse(localStorage.getItem("user")))
				document.querySelector(".navbar-username").innerHTML = `${user.username}!`;
				displayAlert("account.change-username-success", "success");
			}
			else
			{
				displayAlert("account.change-username-error", "danger");
				console.log(data.message);
			}
		} catch (error) {
			if (error.message == "Username already taken.")
				registrationError("account.change-username-taken", ".username-error")
			else if (error.message == "New username is required.")
				registrationError("account.change-username-empty", ".username-error")
			else
				displayAlert("account.change-username-error", "danger");
			console.log(error.message)
		}
	})
}
