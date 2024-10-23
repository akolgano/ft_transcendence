{
	const changePassword = document.getElementById("changePassword");

	changePassword.addEventListener("submit", async (e) => {
		e.preventDefault();

		let oldPassword = document.getElementById("old-password").value;
		let newPassword = document.getElementById("password").value;

		resetErrorField(".password-reset-error");
		if (!checkPasswordMatch())
			return ;

		const formData = new FormData();
		formData.append("old_password", oldPassword);
		formData.append("new_password", newPassword);
		removeAlert()
		let formErrors = 0;

		try {
			const response = await fetch("https://localhost/api/change_password/", {
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
				// console.log("Data json: " + JSON.stringify(data))
				addErrorToHTML(data);
				formErrors = 1;
				throw new Error(JSON.stringify(data) || 'An error occurred');
			}
			if (data.detail)
			{
				displayAlert("account.change-password-success", "success");
				document.getElementById("old-password").value = "";
				document.getElementById("password").value = "";
				document.getElementById("confirm-password").value = "";
			}
			else
			{
				displayAlert("account.change-password-error", "danger");
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
			else if (!formErrors)
				displayAlert("account.change-password-error", "danger");
			console.log(error.message)
		}
	})
}
