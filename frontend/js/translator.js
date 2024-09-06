// console.log("TRANSLATOR");

let language = "fr"

// var translator = new Translator({
// 	defaultLanguage: "fr",
// 	detectLanguage: false,
// 	selector: "[data-i18n]",
// 	debug: true,
// 	registerGlobally: "__",
// 	persist: true,
// 	persistKey: "preferred_language",
// 	filesLocation: "/i18n"
// });


// translator.fetch(["en", "fr", "es"]).then(() => {
// 	// Calling `translatePageTo()` without any parameters
// 	// will translate to the default language.
// 	translator.translatePageTo();
// 	console.log("Translating page start");
// 	registerLanguageToggle();
// });

// function registerLanguageToggle() {
// 	let select = document.querySelectorAll(".change-language");

// 	select.forEach(link => {
// 		link.addEventListener("click", event => {
// 		var language = event.target.getAttribute('data-language');
// 		// console.log("Event: " + event)
// 		console.log("Translating page to: " + language);
// 		translator.translatePageTo(language);
// 		});
// 	})
// }

//   document.querySelector("button").addEventListener("click", () => {
// 	// Using `translateForKey()` without a target language,
// 	// the current language will be used.
// 	// See: https://github.com/andreasremdt/simple-translator#user-content-translateforkeystring-key-string-language
// 	alert(translator.translateForKey("dialog.content"));

// 	// You can also use the shorthand helper:
// 	console.log(__("dialog.content"));
//   });

// function registerLanguageToggle() {
// 	var select = document.querySelector("select");

// 	select.addEventListener("change", evt => {
// 	  var language = evt.target.value;
// 	  translator.translatePageTo(language);
// 	});
//   }

//   document.querySelector("button").addEventListener("click", () => {
// 	// Using `translateForKey()` without a target language,
// 	// the current language will be used.
// 	// See: https://github.com/andreasremdt/simple-translator#user-content-translateforkeystring-key-string-language
// 	alert(translator.translateForKey("dialog.content"));

// 	// You can also use the shorthand helper:
// 	console.log(__("dialog.content"));
//   });
