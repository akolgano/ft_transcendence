{
	console.log("Account script")

	let user = JSON.parse(localStorage.getItem("user"));
	console.log(user);

	document.querySelector('.input-username').value = user.username
	document.querySelector('.input-email').value = user.email
	document.querySelector(".profile-pic").src = "http://localhost:8000" + user.profile_picture
}

// Error message: {"new_password":["This password is too short. It must contain at least 5 characters.","This password is too common."]}
