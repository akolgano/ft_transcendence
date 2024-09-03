// To make it SPA
// ADD your new page in the urlRoutes, and and the spa class to link.


// Make it more efficient by NOT putting the event listener on every click of the document.
// BUT make sure the content added to the DOM will be inside the class we used for capturing events.

// --> When I add an element to the DOM, I add an eventListener to it

// document.addEventListener("click", (e) => {
	// 	const target = e.target;
	// 	if (!target.classList.contains("spa"))
	// 		return;
// 	e.preventDefault();
// 	urlRoute(e);
// })
// document.addEventListener("click", spaHandler)


if (localStorage.getItem("token"))
{
		const nav = '<li class="nav-item"><p class="navbar-text m-0 px-4">Welcome, Juliette!</p></li><li class="nav-item dropdown"><a href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><img src="./images/profile_pic.jpeg" alt="avatar" class="rounded-circle border-1 avatar"></a><ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item" href="#">Profile</a></li><li><a class="dropdown-item" href="#">Another action</a></li><li><a class="dropdown-item" href="#" id="logout">Logout</a></li></ul>'
		document.getElementById("nav-log").innerHTML = nav;
		const script = document.createElement("script");
		script.src = "../js/logout.js";

		document.body.appendChild(script);
}
else
{
	const nav = '<a class="btn btn-outline-secondary spa" type="button" href="/signup">Sign up</a><a class="btn btn-outline-secondary spa mx-2" type="button" href="/login">Log in</a>'
	document.getElementById("nav-log").innerHTML = nav;
}

function spaHandler(e) {
	const target = e.target;
	e.preventDefault();
	urlRoute(e);
}

function makeItSpa() {

	let nav = document.querySelectorAll(".spa")

	nav.forEach( link => {
		link.addEventListener("click", spaHandler)
	})
}

makeItSpa();

console.log("ROUTER");


// Function that watches the url and calls the urlLocationHandler
const urlRoute = (event) => {
	if (localStorage.getItem("token") == null && urlRoutes[window.location.pathname].auth == true)
		href = "http://localhost:3000/login"

	window.history.pushState({}, "", event.target.href);
	urlLocationHandler();
};

// Function that handles the url location
const urlLocationHandler = async () => {

	let location = window.location.pathname;

	if (location.length == 0)
		location = "/";

	// Not logged in and route needs authentication
	if (localStorage.getItem("token") == null && urlRoutes[location].auth == true) // User is logged out
	{
		console.log("Needs to be logged in")
		location = "/login"
	}

	// Get the route, get the html, add it to the div
	const route = urlRoutes[location] || urlRoutes["404"];
	content.innerHTML = route.content;

	//  Add eventListener on new content
	links = content.querySelectorAll(".spa");
	links.forEach( link => {
		link.addEventListener("click", spaHandler)
	})

	// Load scripts
	loadScripts(route.scriptContent || []);

	// metadata
	document.title = route.title;
	document
	.querySelector('meta[name="description"]')
	.setAttribute("content", route.description);
};

const addScripts = (scripts) => {
	scripts.forEach(scriptSrc => {
		const script = document.createElement("script");
		script.dataset.pageScript = "";
		script.textContent = scriptSrc;
		document.body.appendChild(script);
	});
}


const loadScripts = (scripts) => {
	// Remove old scripts
	const existingScripts = document.querySelectorAll("script[data-page-script]");
	existingScripts.forEach(script => script.remove());

	// Add new scripts
	addScripts(scripts)
};

// Ensures correct routing when using back/forward buttons from history
window.onpopstate = urlLocationHandler;

// Make the urlRoute function globally accessible.
window.route = urlRoute;

// call the urlLocationHandler function to handle the initial url
const urlRoutes = {
	404: {
		template: "./404.html",
		title: "404",
		description: "Page not found",
		scripts: [],
		auth: false,
	},
	"/": {
		template: "./play.html",
		title: "Home",
		description: "Home page",
		scripts: [],
		auth: true,
	},
	"/friends": {
		template: "./friends.html",
		title: "About Us",
		description: "All your friends",
		scripts: ["../js/friends.js"],
		auth: true,
	},
	"/history": {
		template: "./history.html",
		title: "History",
		description: "Game history",
		scripts: [],
		auth: false,
	},
	"/signup": {
		template: "./signup.html",
		title: "Sign up",
		description: "Sign up to play pong",
		scripts: ["../js/signup.js"],
		auth: false,
	},
	"/login": {
		template: "./login.html",
		title: "Log in",
		description: "Log in to play pong",
		scripts: ["../js/login.js"],
		auth: false,
	},
};

let logoutScript;

// Fetch all the pages already to have everything on the client side.
const fetchTemplate = async (route) => {
	try {
		const response = await fetch(route.template);
		const html = await response.text()
		route.content = html;

		route.scriptContent = []

		for (let script of route.scripts) {
			const scriptResponse = await fetch(script)
			const scriptText = await scriptResponse.text()
			route.scriptContent.push(scriptText);
		}


	} catch (error) {
		console.log("Error fetching " + route.title + error)
	}

	const logoutResponse = await fetch("../js/logout.js")
	logoutScript = await logoutResponse.text()
}

const fetchPages = async () => {
	for (let route in urlRoutes) {
		await fetchTemplate(urlRoutes[route])
	}
	urlLocationHandler();
}

fetchPages();
