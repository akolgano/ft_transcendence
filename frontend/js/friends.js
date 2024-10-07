
console.log("FRIENDS SCRIPT");

function displayFriends(data) {
	const friendsList = document.querySelector(".friends-list");

	data.forEach(user => {
		const userHTML = `
	<div class="friend-card" data-username=${user.username}>
		<div class="border rounded bg-light w-50 mb-2 d-inline-block align-middle">
			<div class="d-flex justify-content-between p-2">
				<div class="d-flex">
					<img src="http://localhost:8000${user.profile_picture}" alt="avatar" class="rounded-circle border-1 avatar-mini object-fit-cover">
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
	});
	translateNewContent(friendsList);
}

async function fetchFriends() {
	try {
		const response = await fetch("https://localhost/api/get_friends/", {
			headers: {
				'Authorization': `Token ${localStorage.getItem("token")}`,
			},
			method: 'GET',
		})
		const data = await response.json();
		if (!response.ok) {
			console.log("Error: " + JSON.stringify(data))
			throw new Error(JSON.stringify(data.detail) || 'An error occurred');
		}
		if (data)
		{
			displayFriends(data.friends);
		}
		else
		{
			removeAlert();
			displayAlert("friends.error-load", "danger");
			console.log(data.message);
		}
	} catch (error) {
		removeAlert();
		displayAlert("friends.error-load", "danger");
		console.log(error.message)
	}
}

fetchFriends().then(removeFriendScript);
