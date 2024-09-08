{
	console.log("Profile")

	let user = JSON.parse(localStorage.getItem("user"));

	document.querySelector(".profile-username").innerHTML += user.username
	document.querySelector(".profile-email").innerHTML += user.email

	// console.log("username: " + username)
	// console.log("email: " + email)

}
