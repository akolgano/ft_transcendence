{
	console.log("SCRIPT LOG OUT")
	console.log("Token: " + localStorage.token)
	const logout = document.getElementById("logout");

	logout.addEventListener("click", (e) => {
		e.preventDefault();
		alert("Logout successful!");
		localStorage.clear();
		urlRoute({ target: { href: '/' }, preventDefault: () => {} });
	})
}
