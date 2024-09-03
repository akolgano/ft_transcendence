{
	console.log("SCRIPT LOG IN")

	const loginForm = document.getElementById("loginForm");

	loginForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		const formData = new FormData(loginForm);

		console.log("TRYING TO LOG IN")
		try {
			const response = await fetch("http://127.0.0.1:8000/login", {
				method: 'POST',
				body: formData,
			})
			const data = await response.json();
			if (!response.ok) {
				let errorMessage = data.error;
				throw new Error(errorMessage || 'An error occurred');
			}
			if (data.token)
			{
				// console.log("Token: " + data.token);
				// console.log("User: " + data.user);
				alert("Login successful!");
				localStorage.setItem("auth", 1);
				localStorage.setItem("user", data.user.username);
				localStorage.setItem("token", data.token);

				// Change navbar
				const nav = '<li class="nav-item"><p class="navbar-text m-0 px-4">Welcome, Juliette!</p></li><li class="nav-item dropdown"><a href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><img src="./images/profile_pic.jpeg" alt="avatar" class="rounded-circle border-1 avatar"></a><ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item" href="#">Profile</a></li><li><a class="dropdown-item" href="#">Another action</a></li><li><a class="dropdown-item" href="#" id="logout">Logout</a></li></ul>'
				const navbar = document.getElementById("nav-log");
				navbar.innerHTML = nav;

				// Add logout script
				const script = document.createElement("script");
				script.classList.add("logout-script");
				script.src = "../js/logout.js";
				document.body.appendChild(script);

				//  Add eventListener on navbar
				links = navbar.querySelectorAll(".spa");
				links.forEach( link => {
					link.addEventListener("click", spaHandler)
				})

				urlRoute({ target: { href: '/' }, preventDefault: () => {} });
			}
			else
			{
				alert("Login failed: " + data.message);
			}
		} catch (error) {
			alert("Login failed: " + error.message);
		}
	})
}
