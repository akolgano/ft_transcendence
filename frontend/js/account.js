{
	console.log("Account script")

	let user = JSON.parse(localStorage.getItem("user"));
	console.log(user);

	document.querySelector('.input-username').value = user.username
	document.querySelector('.input-email').value = user.email
	document.querySelector(".profile-pic").src = "http://localhost:8000" + user.profile_picture



	// const changeUsername = document.getElementById("changeUsername");

	// changeUsername.addEventListener("submit", async (e) => {
	// 	e.preventDefault();
	// 	const formData = new FormData(changeUsername);
	// 	try {
	// 		let errorMessage = "";
	// 		const response = await fetch("http://127.0.0.1:8000/signup", {
	// 			method: 'PATCH',
	// 			body: formData,
	// 		})
	// 		const data = await response.json();
	// 		if (!response.ok) {
	// 			// console.log("Data from back: " + Object.values(data));
	// 			let errors_array = Object.values(data);
	// 			errors_array.forEach((message, index) => {
	// 				errorMessage += "\n • ";
	// 				errorMessage += message;
	// 			});
	// 			throw new Error(errorMessage || 'An error occurred');
	// 		}
	// 		if (data.token)
	// 		{
	// 			alert(translator.translateForKey("auth.sign-up-success", localStorage.getItem("preferred_language") || "en"))
	// 			urlRoute({ target: { href: '/' }, preventDefault: () => {} });
	// 		}
	// 		else
	// 		{
	// 			// TO DO: Get the error message in english, then check what it is, depending on that, translate it.
	// 			// console.log("Language: " + localStorage.getItem("preferred_language"))
	// 			alert(translator.translateForKey("auth.error", localStorage.getItem("preferred_language") || "en") + data.message)
	// 			console.log(data.message);
	// 		}
	// 	} catch (error) {
	// 		alert(translator.translateForKey("auth.error", localStorage.getItem("preferred_language") || "en") + error.message)
	// 		console.log(error.message)
	// 	}
	// })
}
