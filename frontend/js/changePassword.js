{
	const changePassword = document.getElementById("changePassword");

	changePassword.addEventListener("submit", async (e) => {
		e.preventDefault();

		let oldPassword = document.getElementById("old-password").value;
		let newPassword = document.getElementById("password").value;

		resetErrorField();
		if (!checkPasswordMatch())
			return ;

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
			removeAlert()
			if (!response.ok) {
				// console.log("Data json: " + JSON.stringify(data))
				addErrorToHTML(data);
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
			console.log(error.message)
		}
	})
}
