
function getErrorKeyAddFriend(error)
{
	let errorKey;
	if (error == '"You are already friends with this user."')
		errorKey = "friends.error-already-friend";
	else if (error == '"You cannot add yourself as a friend."')
		errorKey = "friends.error-yourself";
	else if (error == '"No CustomUser matches the given query."')
		errorKey = "friends.error-no-user"
	else if (error == "Username to add is required.")
		errorKey = "friends.error-empty"
	else
		errorKey = "friends.add-error"
	return (errorKey);
}

function addFriendToHTML(user) {
	const friendsList = document.querySelector(".friends-list");

	const userHTML = `
	<div class="friend-card" data-username=${sanitize(user.username)}>
		<div class="border rounded bg-light w-50 mb-2 d-inline-block align-middle">
			<div class="d-flex justify-content-between p-2">
				<div class="d-flex">
					<img src="https://localhost${sanitize_picture(user.profile_picture)}" alt="avatar" class="rounded-circle border-1 avatar-mini object-fit-cover">
					<a class="mb-0 px-2 spa" href="/profile/${sanitize(user.username)}" id ="friend-username">${sanitize(user.username)}</a>
				</div>
				<div><span class="mb-0 me-1">🔥</span><span class="mb-0 me-1">${user.points || 0}</span></div>
			</div>
		</div>

		<div class="d-inline-block">
			<button type="submit" class="btn btn-danger mb-2 removeFriend" data-username=${sanitize(user.username)} data-i18n="friends.remove"></button>
		</div>
	</div>`

	friendsList.insertAdjacentHTML("beforeend", userHTML);

	const newFriendButton = document.querySelector(`.removeFriend[data-username="${user.username}"]`);
	newFriendButton.addEventListener("click", addEventRemoveButton);

	const newFriendCard = document.querySelector(`.friend-card[data-username="${user.username}"]`);
	translateNewContent(newFriendCard);
	addEventSpaLinks(newFriendCard);
	document.getElementById("add-friend-input").value = "";
}

function addFriendEvent() {
	const addFriend = document.getElementById("addFriend");
	addFriend.addEventListener("submit", async (e) => {
		e.preventDefault();
		if (!checkValidToken())
			return;
		const formData = new FormData(addFriend);
		removeAlert();
		try {
			const response = await fetch("https://localhost/api/add_friend/", {
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
				throw new Error(JSON.stringify(data.detail) || 'An error occurred');
			}
			if (data.detail)
			{
				addFriendToHTML(data.friend);
				displayAlert("friends.add-success", "success");
			}
			else
			{
				displayAlert("friends.add-error", "danger");
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
				displayAlert(getErrorKeyAddFriend(error.message), "danger");
		}
	})
}

addFriendEvent();
