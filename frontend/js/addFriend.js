console.log("ADD FRIEND SCRIPT")

// function addFriendToHTML(data) {

// }

{
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
				// TO DO: add the new friend to the list instead of doing a full page refresh
				// addFriendToHTML()
				console.log("Data: " + JSON.stringify(data));
				urlRoute({ target: { href: '/friends' }, preventDefault: () => {} });
			}
			else
			{
				// TO DO: Get the error message in english, then check what it is, depending on that, translate it.
				// console.log("Language: " + localStorage.getItem("preferred_language"))
				alert("Unexpected error. Unable to add friend.")
				console.log(data.message);
			}
		} catch (error) {
			alert("Error adding friend.\n" + error.message)
			console.log(error.message)
		}
	})

}

// function addFriend() {

// }
