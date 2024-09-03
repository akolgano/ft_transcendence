{
	console.log("SCRIPT LOG OUT")
	console.log("Token: " + localStorage.token)

	const logout = document.getElementById("logout");

	function handleLogout(e) {
		e.preventDefault();
		alert("Logout successful!");
		localStorage.clear();

		const nav = '<a class="btn btn-outline-secondary spa" type="button" href="/signup">Sign up</a><a class="btn btn-outline-secondary spa mx-2" type="button" href="/login">Log in</a>'
		const navbar = document.getElementById("nav-log");
		navbar.innerHTML = nav;

		//  Add eventListener on navbar
		links = navbar.querySelectorAll(".spa");
		links.forEach( link => {
			link.addEventListener("click", spaHandler)
		})

		urlRoute({ target: { href: '/' }, preventDefault: () => {} });
	}

	// logout.removeEventListener("click", spaHandler)
	logout.addEventListener("click", handleLogout);
}
