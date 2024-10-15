
console.log("SCRIPT LOG OUT")

async function handleLogout(e) {
	e.preventDefault();

	const formData = new FormData();
	formData.append("username", JSON.parse(localStorage.getItem("user")).username);

	removeAlert();
	try {
		const response = await fetch("https://localhost/api/logout", {
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

		if (!response.ok) {
			console.log("Error: " + JSON.stringify(data))
			throw new Error(JSON.stringify(data.detail) || 'An error occurred');
		}
		if (data)
		{
			console.log("Data: " + JSON.stringify(data));
			displayAlert("auth.logout-success", "success");

			localStorage.removeItem("auth")
			localStorage.removeItem("user")
			localStorage.removeItem("token")
			updateNavbar(false)
			urlRoute({ target: { href: '/' }, preventDefault: () => {} });
		}
		else
		{
			displayAlert("auth.logout-error", "danger");
			console.log(data.message);
		}
	} catch (error) {
		displayAlert("auth.logout-error", "danger");
		console.log(error.message)
	}
}

function logoutUser(params) {

	const logout = document.getElementById("logout");
	logout.addEventListener("click", handleLogout);
}

logoutUser();


// CSRF Failed: CSRF token missing.
