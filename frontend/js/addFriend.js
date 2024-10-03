console.log("ADD FRIEND SCRIPT")

function addFriendToHTML(user) {
	const friendsList = document.querySelector(".friends-list");

	const userHTML = `
	<div class="friend-card" data-username=${user.username}>
		<div class="border rounded bg-light w-50 mb-2 d-inline-block align-middle">
			<div class="d-flex justify-content-between p-2">
				<div class="d-flex">
					<img src="http://localhost:8000${user.profile_picture}" alt="avatar" class="rounded-circle border-1 avatar-mini">
					<a class="mb-0 px-2" href="/" id ="friend-username">${user.username}</a>
				</div>
				<p class="mb-0">Level 3</p>
			</div>
		</div>

		<div class="d-inline-block">
			<button type="submit" class="btn btn-danger mb-2 removeFriend" data-username=${user.username} data-i18n="friends.remove"></button>
		</div>
	</div>`

	friendsList.insertAdjacentHTML("beforeend", userHTML);

	const newFriendButton = document.querySelector(`.removeFriend[data-username="${user.username}"]`);
	newFriendButton.addEventListener("click", addEventRemoveButton);

	const newFriendCard = document.querySelector(`.friend-card[data-username="${user.username}"]`);
	translateNewContent(newFriendCard);
}

function addFriendEvent() {
	const addFriend = document.getElementById("addFriend");

	addFriend.addEventListener("submit", async (e) => {
		e.preventDefault();
		const formData = new FormData(addFriend);

		try {
			const response = await fetch("http://localhost:8000/add_friend/", {
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
				alert("Friend added")
				addFriendToHTML(data.friend);
				console.log("Data: " + JSON.stringify(data));
			}
			else
			{
				// TO DO: Get the error message in english, then check what it is, depending on that, translate it.
				// console.log("Language: " + siteLanguage)
				alert("Unexpected error. Unable to add friend.")
				console.log(data.message);
			}
		} catch (error) {
			alert("Error adding friend.\n" + error.message)
			console.log(error.message)
		}
	})
}

addFriendEvent();
