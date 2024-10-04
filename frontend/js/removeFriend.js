console.log("REMOVE FRIEND SCRIPT")

function removeFriendFromHTML(username) {
	const userDiv = document.querySelector(`.friend-card[data-username="${username}"]`);
	if (userDiv)
		userDiv.remove()
}

async function addEventRemoveButton(e) {

	e.preventDefault();
	const button = e.target;
	const username = button.getAttribute("data-username");
	const formData = new FormData();
	formData.append("username_to_remove", username)

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
			throw new Error(JSON.stringify(data.detail) || 'An error occurred');
		}
		if (data.detail)
		{
			alert("Friend removed")
			// TO DO: add the new friend to the list instead of doing a full page refresh
			removeFriendFromHTML(username);
			console.log("Data: " + JSON.stringify(data));
			// urlRoute({ target: { href: '/friends' }, preventDefault: () => {} });
		}
		else
		{
			alert("Unexpected error. Unable to remove friend.")
			console.log(data.message);
		}
	} catch (error) {
		alert("Error adding friend.\n" + error.message)
		console.log(error.message)
	}

}

function removeFriendScript(params) {
const removeButtons = document.querySelectorAll(".removeFriend");
removeButtons.forEach(button => {
	button.addEventListener("click", addEventRemoveButton)
});
}
