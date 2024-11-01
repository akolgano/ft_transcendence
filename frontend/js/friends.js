
function displayFriends(data) {
	const friendsList = document.querySelector(".friends-list");

	data.forEach(user => {
		const userHTML = `
	<div class="friend-card" data-username=${sanitize(user.username)}>
		<div class="border rounded bg-light w-50 mb-2 d-inline-block align-middle">
			<div class="d-flex justify-content-between p-2">
				<div class="d-flex">
					<img src="https://localhost${sanitize_picture(user.profile_picture)}" alt="avatar" class="rounded-circle border-1 avatar-mini object-fit-cover">
					<a class="mb-0 px-2 spa" href="/profile/${sanitize(user.username)}" id ="friend-username">${sanitize(user.username)}</a>
				</div>
				<div><span class="mb-0 me-1">🔥</span><span class="mb-0 me-1">${user.points}</span></div>
			</div>
		</div>

		<div class="d-inline-block">
			<button type="submit" class="btn btn-danger mb-2 removeFriend" data-username=${sanitize(user.username)} data-i18n="friends.remove"></button>
		</div>
	</div>`
		friendsList.insertAdjacentHTML("beforeend", userHTML);
	});
	translateNewContent(friendsList);
	addEventSpaLinks(friendsList);
}

async function fetchFriends() {
	try {
		const response = await fetch("https://localhost/api/get_friends/", {
			headers: {
				'Authorization': `Token ${localStorage.getItem("token")}`,
				'Accept': 'application/json',
			},
			method: 'GET',
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
		if (error.message === '"Invalid token."') {
			localStorage.removeItem("user")
			localStorage.removeItem("token")
			localStorage.removeItem("expiry_token")
			updateNavbar(false)
			urlRoute({ target: { href: '/login' }, preventDefault: () => {} });
			displayAlert("auth.login-again", "danger");
		}
		else
			displayAlert("friends.error-load", "danger");
		console.log(error.message)
	}
}

document.getElementById("add-friend-input").placeholder = translator.translateForKey("auth.username", siteLanguage);
fetchFriends().then(removeFriendScript);
