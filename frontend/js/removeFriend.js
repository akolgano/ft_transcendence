console.log("REMOVE FRIEND SCRIPT")

function getErrorKeyRemoveFriend(error)
{
	let errorKey;

	if (error == "Username to remove is required.")
		errorKey = "friends.error-empty";
	else if (error == "No CustomUser matches the given query.")
		errorKey = "friends.error-no-user"
	else if (error == "You are not friends with this user.")
		errorKey = "friends.error-not-friend"
	else
		errorKey = "friends.remove-error"
	return (errorKey);
}

function removeFriendFromHTML(username) {
	const userDiv = document.querySelector(`.friend-card[data-username="${username}"]`);
	if (userDiv)
		userDiv.remove();
	displayAlert("friends.remove-success", "success");
}

async function addEventRemoveButton(e) {
	e.preventDefault();
	if (!checkValidToken())
		return;
	const button = e.target;
	const username = button.getAttribute("data-username");
	const formData = new FormData();
	formData.append("username_to_remove", username)

	removeAlert();
	try {
		const response = await fetch("https://localhost/api/remove_friend/", {
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
			throw new Error(data.detail || 'An error occurred');
		}
		if (data.detail)
		{
			removeFriendFromHTML(username);
			console.log("Data: " + JSON.stringify(data));
		}
		else
		{
			displayAlert("friends.remove-error", "danger");
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
		else
			displayAlert(getErrorKeyRemoveFriend(error.message), "danger");
		console.log(error.message)
	}

}

function removeFriendScript(params) {
const removeButtons = document.querySelectorAll(".removeFriend");
removeButtons.forEach(button => {
	button.addEventListener("click", addEventRemoveButton)
});
}
