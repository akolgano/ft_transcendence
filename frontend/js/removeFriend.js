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
	const button = e.target;
	const username = button.getAttribute("data-username");
	const formData = new FormData();
	formData.append("username_to_remove", username)

	removeAlert();
	try {
		const response = await fetch("https://localhost/api/remove_friend/", {
			headers: {
				'Authorization': `Token ${localStorage.getItem("token")}`,
			},
			method: 'POST',
			body: formData,
		})
		const data = await response.json();
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
