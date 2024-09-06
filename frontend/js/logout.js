{
	console.log("SCRIPT LOG OUT")
	console.log("Token: " + localStorage.token)

	const logout = document.getElementById("logout");

	function handleLogout(e) {
		e.preventDefault();
		alert(translator.translateForKey("auth.logout-success", localStorage.getItem("preferred_language") || "en"))
		localStorage.removeItem("auth")
		localStorage.removeItem("user")
		localStorage.removeItem("token")

		updateNavbar(false)

		urlRoute({ target: { href: '/' }, preventDefault: () => {} });
	}
	logout.addEventListener("click", handleLogout);
}
