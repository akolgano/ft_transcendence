{
	console.log("Account script")

	document.querySelectorAll(".toggle-password").forEach(node => {
		node.addEventListener("click", togglePassword)
	});

	// let user = JSON.parse(localStorage.getItem("user"));
	// console.log(user);

	document.querySelector('.input-username').value = getCookie("username")
	document.querySelector('.input-email').value = getCookie("email")
	document.querySelector(".profile-pic").src = "https://localhost" + getCookie("profile_picture")

	let formLanguage =  document.getElementById("defaultLanguage");
	let options = formLanguage.querySelectorAll(".select-lang");
	options.forEach(option => {
		if (option.getAttribute("value") == getCookie("language")) {
			option.setAttribute("selected", "selected");
			return ;
		}
	})
}

// Error message: {"new_password":["This password is too short. It must contain at least 5 characters.","This password is too common."]}
