// In caso di aggiornamento della pagina questa viene riportata all'inizio
if(sessionStorage.getItem("visited")) {
	window.scrollTo(0, 0);
} else {
	sessionStorage.setItem("visited", "false");
}

// Tracciamento degli sketch
let currentSketch = 0;
const totalSketches = 6;

// Array degli sketch
let sketches = document.getElementsByClassName("sketch");

// Bottone per lo sketch seguente
let forwardButton = document.getElementById("forward");
forwardButton.addEventListener("click", () => {
	changeSketch(currentSketch + 1);    
});

// Gestione della pressione del tasto freccia giù
function arrows(event) {
	if (event.repeat) return;
	if (event.key === 'ArrowDown' && currentSketch < totalSketches) {
		changeSketch(currentSketch + 1);
	} else if (event.key === "ArrowUp" && currentSketch > 0) {
		changeSketch(currentSketch - 1);
	}
}
document.addEventListener("keydown", arrows);

// Array degli indicatori di selezione sketch
let sketchButtons = document.getElementsByClassName("sketch-button");
sketchButtons[currentSketch].style.backgroundColor = "var(--fgColor)";
Array.from(sketchButtons).forEach((sketchButton, i) => {
	sketchButton.addEventListener("click", () => {
		changeSketch(i);
	});
});

// Bottone per abbandonare la narrazione
let leaveButton = document.getElementById("leave");

// Funzione per il cambio di sketch
function changeSketch(selectedSketch) {
	if(selectedSketch !== currentSketch && selectedSketch <= totalSketches) {
		if(selectedSketch === 6) {
			forwardButton.style.display = "none";
			leaveButton.style.display = "block";
			leaveButton.classList.add("fade-in-class");
		} else {
			forwardButton.style.display = "block";
			leaveButton.classList.add("fade-out-class");
			leaveButton.style.display = "none";
		}

		// aggiorno indicatore
		sketchButtons[currentSketch].style.backgroundColor = "var(--bgColor)";
		sketchButtons[selectedSketch].style.backgroundColor = "var(--fgColor)";

		// sketch selezionato non più nascosto
		sketches[selectedSketch].hidden = false;

		// avvio animazioni
		sketches[currentSketch].classList.add("fade-out-class");
		sketches[selectedSketch].classList.add("fade-in-class");

		// disattivazione bottone per lo sketch seguente + indicatori
		forwardButton.disabled = true;
		Array.from(sketchButtons).forEach((sketchButton) => {
			sketchButton.disabled = true;
		});
		document.removeEventListener("keydown", arrows);

		// rimozione sketch precedente
		setTimeout(() => {
			// sketch precedente  nascosto
			sketches[currentSketch].hidden = true;

			// disattivo animazioni
			sketches[currentSketch].classList.remove("fade-out-class");
		}, 650);


		// verifica del completamento animazione
		setTimeout(() => {
			sketches[selectedSketch].classList.remove("fade-in-class");

			currentSketch = selectedSketch;
		}, 700);

		// riattivazione  bottone + indicatori
		setTimeout(() => {
			forwardButton.disabled = false;
			Array.from(sketchButtons).forEach((sketchButton, index) => {
				sketchButton.disabled = false;
			});
			document.addEventListener("keydown", arrows);
		}, 1000);
	}
}

leaveButton.addEventListener("click", () => {
	window.location = "chart/2019/index2019.html"
})