{
	console.log("SCRIPT LOG OUT")
	console.log("Token: " + localStorage.token)

	const logout = document.getElementById("logout");

	logout.addEventListener("click", (e) => {
		e.preventDefault();
		alert("Logout successful!");
		localStorage.clear();
		const nav = '<a class="btn btn-outline-secondary spa" type="button" href="/signup">Sign up</a><a class="btn btn-outline-secondary spa mx-2" type="button" href="/login">Log in</a>'
		document.getElementById("nav-log").innerHTML = nav;

		document.querySelector(".logout-script").remove();

		urlRoute({ target: { href: '/' }, preventDefault: () => {} });
	})
}
