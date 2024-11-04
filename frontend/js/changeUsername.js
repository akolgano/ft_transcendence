{
	const changeUsername = document.getElementById("changeUsername");

	changeUsername.addEventListener("submit", async (e) => {
		e.preventDefault();
		if (!checkValidToken())
			return;
		resetErrorField(".username-error")
		if (!validUsername())
			return ;

		const new_username = sanitize(document.getElementById("username").value)
		if (new_username === JSON.parse(localStorage.getItem("user")).username)
		{
			registrationError("account.change-username-same", ".username-error")
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
				throw new Error(data.new_username || 'An error occurred');
			}
			if (data.detail)
			{
				let user = JSON.parse(localStorage.getItem("user"));
				user.username = new_username;
				localStorage.setItem("user", JSON.stringify(user));
				document.querySelector(".navbar-username").innerText = `${user.username}!`;
				displayAlert("account.change-username-success", "success");
			}
			else
			{
				displayAlert("account.change-username-error", "danger");
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
			else if (error.message == "Username already taken.")
				registrationError("account.change-username-taken", ".username-error")
			else if (error.message == "New username is required.")
				registrationError("account.change-username-empty", ".username-error")
			else
				displayAlert("account.change-username-error", "danger");
		}
	})
}
