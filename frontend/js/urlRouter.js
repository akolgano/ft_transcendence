
// create document click that watches the nav links only
document.addEventListener("click", (e) => {
	const target = e.target;
	if (!target.classList.contains("spa"))
		return;
	e.preventDefault();
	urlRoute();
});

console.log("ROUTER");

const urlRoutes = {
	404: {
		template: "../templates/404.html",
		title: "404",
		description: "Page not found",
		scripts: [],
	},
	"/": {
		template: "../templates/index.html",
		title: "Home",
		description: "Home page",
		scripts: [],
	},
	"/friends": {
		template: "../templates/friends.html",
		title: "About Us",
		description: "All your friends",
		scripts: [],
	},
	"/history": {
		template: "../templates/history.html",
		title: "History",
		description: "Game history",
		scripts: [],
	},
	"/signup": {
		template: "../templates/signup.html",
		title: "Sign up",
		description: "Sign up to play pong",
		scripts: ["../js/signup.js"]
	},
	"/login": {
		template: "../templates/login.html",
		title: "Log in",
		description: "Log in to play pong",
		scripts: ["../js/login.js"]
	},
};

// create a function that watches the url and calls the urlLocationHandler
const urlRoute = (event) => {
	event = event || window.event; // get window.event if event argument not provided
	event.preventDefault();
	window.history.pushState({}, "", event.target.href);
	urlLocationHandler();
};

// create a function that handles the url location
const urlLocationHandler = async () => {
	const location = window.location.pathname; // get the url path
	if (location.length == 0) {
		location = "/";
	}
	// Get the route, get the html, add it to the div
	const route = urlRoutes[location] || urlRoutes["404"];
	const html = await fetch(route.template).then((response) => response.text());
	document.getElementById("content").innerHTML = html;

	// Load scripts
	loadScripts(route.scripts || []);

	// metadata
	document.title = route.title;
	document
		.querySelector('meta[name="description"]')
		.setAttribute("content", route.description);
};

// Function to load and execute scripts
const loadScripts = (scripts) => {
	// Remove old scripts
	const existingScripts = document.querySelectorAll("script[data-page-script]");
	existingScripts.forEach(script => script.remove());

	// Add new scripts
	scripts.forEach(scriptSrc => {
		const script = document.createElement("script");
		script.src = scriptSrc;
		script.dataset.pageScript = ""; // Custom attribute to identify scripts
		document.body.appendChild(script);
	});
};

// add an event listener to the window that watches for url changes
window.onpopstate = urlLocationHandler;
window.route = urlRoute;
// call the urlLocationHandler function to handle the initial url
urlLocationHandler();
