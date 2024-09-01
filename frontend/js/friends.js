
const checkIfLoggedIn2 = async () => {
	if (localStorage.getItem("token") == null)
		{
			console.log("NOT LOGGED IN");
			console.log("Token: " + localStorage.token)
		// Add login form
		const response = await fetch("../templates/login.html")
		let html = await response.text()
		document.getElementById("content").innerHTML = html;
		// loadScripts(["../js/login.js"])

		// Change navbar
		html = '<a class="btn btn-outline-secondary spa" type="button" href="/signup">Sign up</a><a class="btn btn-outline-secondary spa mx-2" type="button" href="/login">Log in</a>'
		document.getElementById("nav-log").innerHTML = html;
		console.log("in friends");
	}
}

checkIfLoggedIn2();
