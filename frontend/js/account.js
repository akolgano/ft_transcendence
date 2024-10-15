{
	console.log("Account script")

	document.querySelectorAll(".toggle-password").forEach(node => {
		node.addEventListener("click", togglePassword)
	});

	let user = JSON.parse(localStorage.getItem("user"));
	console.log(user);

	document.querySelector('.input-username').value = user.username
	document.querySelector('.input-email').value = user.email
	document.querySelector(".profile-pic").src = user.profile_picture

	let formLanguage =  document.getElementById("defaultLanguage");
	let options = formLanguage.querySelectorAll(".select-lang");
	options.forEach(option => {
		if (option.getAttribute("value") == user.language) {
			option.setAttribute("selected", "selected");
			return ;
		}
	})
}

// Error message: {"new_password":["This password is too short. It must contain at least 5 characters.","This password is too common."]}
