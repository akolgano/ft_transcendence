console.log("REMOVE FRIEND SCRIPT")

function removeFriendFromHTML(username) {
	const userDiv = document.querySelector(`.friend-card[data-username="${username}"]`);
	if (userDiv)
		userDiv.remove();
	displayAlert("friends.remove-success", "success");
}

async function addEventRemoveButton(e) {

	e.preventDefault();
	removeAlert();
	const button = e.target;
	const username = button.getAttribute("data-username");
	const formData = new FormData();
	formData.append("username_to_remove", username)

	try {
		const response = await fetch("http://localhost:8000/remove_friend/", {
			headers: {
				'Authorization': `Token ${localStorage.getItem("token")}`,
			},
			method: 'POST',
			body: formData,
		})
		const data = await response.json();
		if (!response.ok) {
			console.log("Error: " + JSON.stringify(data))
			throw new Error(JSON.stringify(data.detail) || 'An error occurred');
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
		displayAlert("friends.remove-error", "danger");
		console.log(error.message)
	}

}

function removeFriendScript(params) {
const removeButtons = document.querySelectorAll(".removeFriend");
removeButtons.forEach(button => {
	button.addEventListener("click", addEventRemoveButton)
});
}
