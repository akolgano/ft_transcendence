// To make it SPA
// ADD your new page in the urlRoutes, and and the spa class to link.

// Make it more efficient by NOT putting the event listener on every click of the document.
// BUT make sure the content added to the DOM will be inside the class we used for capturing events.
// --> When I add an element to the DOM, I add an eventListener to it
// console.log("ROUTER");

// ---------------------------------------- TRANSLATOR ----------------------------------------

let siteLanguage = "en"
let last_page = "/"

var translator = new Translator({
	defaultLanguage: "fr",
	detectLanguage: false,
	selector: "[data-i18n]",
	debug: true,
	registerGlobally: "__",
	persist: true,
	persistKey: "preferred_language",
	filesLocation: "/i18n"
});

translator.fetch(["en", "fr", "es"]).then(() => {
	translator.translatePageTo(siteLanguage);
	console.log("Translating page start");
	registerLanguageToggle();
});

function registerLanguageToggle() {
	let select = document.querySelectorAll(".change-language");

	select.forEach(link => {
		link.addEventListener("click", event => {
		event.preventDefault();
		siteLanguage = event.target.getAttribute('data-language');
		console.log("Translating page to: " + siteLanguage);
		translator.translatePageTo(siteLanguage);
		const placeholderUsername = document.getElementById("add-friend-input")
		if (placeholderUsername)
			placeholderUsername.placeholder = translator.translateForKey("auth.username", siteLanguage);
		});
	})
}

// ---------------------------------------- VARIABLES FOR SPA ----------------------------------------

const urlRoutes = {
	404: {
		template: "static/404.html",
		title: "404",
		description: "Page not found",
		scripts: [],
		auth: false,
	},
	"/": {
		template: "static/play.html",
		title: "Home",
		description: "Home page",
		scripts: ["../js/game.js"],
		auth: true,
	},
	"/play": {
		template: "static/play.html",
		title: "Home",
		description: "Home page",
		scripts: ["../js/game.js"],
		auth: true,
	},
	"/friends": {
		template: "static/friends.html",
		title: "Friends",
		description: "All your friends",
		scripts: ["../js/removeFriend.js", "../js/friends.js", "../js/addFriend.js"],
		auth: true,
	},
	"/profile": {
		template: "static/profile.html",
		title: "profile",
		description: "Game profile",
		scripts: ["../js/profile.js"],
		auth: true,
	},
	"/profile/:username": {
		template: "static/profile.html",
		title: "profile",
		description: "Game profile",
		scripts: ["../js/profile.js"],
		auth: true,
	},
	"/signup": {
		template: "static/signup.html",
		title: "Sign up",
		description: "Sign up to play pong",
		scripts: ["../js/signup.js"],
		auth: false,
	},
	"/login": {
		template: "static/login.html",
		title: "Log in",
		description: "Log in to play pong",
		scripts: ["../js/login.js"],
		auth: false,
	},
	"/account": {
		template: "static/account.html",
		title: "account",
		description: "Your account",
		scripts: ["../js/account.js", "../js/changePassword.js", "../js/changePicture.js", "../js/defaultLanguage.js", "../js/changeUsername.js"],
		auth: true,
	},
	"/dashboard": {
		template: "static/dashboard.html",
		title: "dashboard",
		description: "Your dashboard",
		scripts: ["../js/dashboard.js"],
		auth: true,
	},
};

let logoutScript;

// ---------------------------------------- FUNCTIONS ----------------------------------------

function spaHandler(e) {
	const target = e.target;
	e.preventDefault();
	urlRoute(e);
}

// Function that watches the url and calls the urlLocationHandler
const urlRoute = (event) => {
	window.history.pushState({}, "", event.target.href);
	urlLocationHandler();
};

const translateNewContent = (node) => {
	node.querySelectorAll("[data-i18n]").forEach(element => {
		let data = element.getAttribute('data-i18n')
		// console.log("Preferred language: " + siteLanguage)
		let translation = translator.translateForKey(data, siteLanguage)
		element.innerText = translation
	});
}

const addEventSpaLinks = (node) => {
	let links = node.querySelectorAll(".spa");
	links.forEach( link => {
		link.addEventListener("click", spaHandler)
	})
}

function handleDynamicRoutes(location) {
	let split_location = location.split("/");
	if (split_location.length == 3 && split_location[1] == "profile")
	{
		let param = split_location[2];
		let route = "/profile/:username";
		console.log("Dynamic route");
		console.log("Param: " + param);
		return { "route": route, "param": param}
	}
	else
		return null;
}

// Function that handles the url location
const urlLocationHandler = async () => {

	let location = window.location.pathname;
	last_page = window.location.pathname;

	// Logged in but user tries to go to login or sign up
	if (localStorage.getItem("token") && (location == "/login" || location == "/signup"))
		location = "/";

	if (location.length == 0)
		location = "/";

	// Not logged in and route needs authentication
	if (localStorage.getItem("token") == null && urlRoutes[location] && urlRoutes[location].auth == true)
		location = "/login"

	// Get the route, get the html, add it to the div
	let dynamic = handleDynamicRoutes(location)
	if (dynamic)
		location = dynamic.route;

	const route = urlRoutes[location] || urlRoutes["404"];
	content = document.getElementById("content")
	content.innerHTML = route.content;

	if (dynamic)
	{
		let profileDiv = document.querySelector(".profile-page");
		if (profileDiv)
			profileDiv.setAttribute("data-username", dynamic.param);
	}

	// Translate only new content.
	translateNewContent(content)
	addEventSpaLinks(content)

	loadScripts(route.scriptContent || []);

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
}

const fetchPages = async () => {
	for (let route in urlRoutes) {
		await fetchTemplate(urlRoutes[route])
	}
	const logoutResponse = await fetch("../js/logout.js")
	logoutScript = await logoutResponse.text()

	// call the urlLocationHandler function to handle the initial url
	urlLocationHandler();
}

const updateNavbar = (loggedIn) => {

	// HTML
	let navContent;
	if (loggedIn)
		navContent = `<li class="nav-item"><p class="navbar-text d-inline" data-i18n="navbar.welcome"></p><p class="navbar-text navbar-username d-inline m-0 pe-4"></p></li><li class="nav-item dropdown"><a href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><img src="./images/profile_pic.jpeg" alt="avatar" class="rounded-circle border-1 avatar-sm object-fit-cover"></a><ul class="dropdown-menu dropdown-menu-end"><li><a class="dropdown-item spa" href="/account" data-i18n="account.title">Account</a></li><li><a class="dropdown-item" href="#">Another action</a></li><li><a class="dropdown-item" href="#" id="logout" data-i18n="auth.log-out"></a></li></ul>`
	else
		navContent = '<a class="btn btn-outline-secondary spa" type="button" href="/signup" data-i18n="auth.sign-up"></a><a class="btn btn-outline-secondary spa mx-2" type="button" href="/login" data-i18n="auth.log-in"></a>'

	const navbar = document.getElementById("nav-log");
	navbar.innerHTML = navContent;

	addEventSpaLinks(navbar)
	translateNewContent(navbar)

	if (loggedIn)
	{
		let welcome = translator.translateForKey("navbar.welcome", siteLanguage)
		navbar.querySelector(".navbar-text").innerText = welcome;
		navbar.querySelector(".navbar-username").innerText = `${JSON.parse(localStorage.getItem("user")).username}!`;
		navbar.querySelector('.avatar-sm').src = "http://localhost:8000" + JSON.parse(localStorage.getItem("user")).profile_picture;

		// Add logout script
		const script = document.createElement("script");
		script.textContent = logoutScript;
		document.body.appendChild(script);
	}
}

// ---------------------------------------- EXECUTION ----------------------------------------

const run = async () => {
	await fetchPages();

	if (localStorage.getItem("token"))
			updateNavbar(true)
	else
		updateNavbar(false)

	addEventSpaLinks(document);
	window.onpopstate = urlLocationHandler; // Ensures correct routing when using back/forward buttons from history
	window.route = urlRoute; // Make the urlRoute function globally accessible.
}

run()
