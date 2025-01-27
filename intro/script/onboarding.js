// in caso di aggiornamento della pagina questa viene riportata all'inizio
if(sessionStorage.getItem("visited")) {
	window.scrollTo(0, 0);
} else {
	sessionStorage.setItem("visited", "false");
}

// tracciamento degli sketch
let currentSketch = 0;
const totalSketches = 6;

// array degli sketch
let sketches = document.getElementsByClassName("sketch");

// bottone per lo sketch seguente
let forwardButton = document.getElementById("forward");
forwardButton.addEventListener("click", () => {
	changeSketch(currentSketch + 1);    
});

// gestione della pressione dei tasti freccia giù e freccia su
function arrows(event) {
	if (event.repeat) return;
	if (event.key === 'ArrowDown' && currentSketch < totalSketches) {
		changeSketch(currentSketch + 1);
	} else if (event.key === "ArrowUp" && currentSketch > 0) {
		changeSketch(currentSketch - 1);
	}
}
document.addEventListener("keydown", arrows);

// array degli indicatori di selezione sketch
let sketchButtons = document.getElementsByClassName("sketch-button");
sketchButtons[currentSketch].style.backgroundColor = "var(--fgColor)";
Array.from(sketchButtons).forEach((sketchButton, i) => {
	sketchButton.addEventListener("click", () => {
		changeSketch(i);
	});
});

// bottone per abbandonare la narrazione
let leaveButton = document.getElementById("leave");

// funzione per il cambio di sketch
function changeSketch(selectedSketch) {
	if(selectedSketch !== currentSketch && selectedSketch <= totalSketches) {
		// gestione bottone di accesso alla data visualization
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

		// disattivazione bottone per lo sketch seguente + indicatori + frecce
		forwardButton.disabled = true;
		Array.from(sketchButtons).forEach((sketchButton) => {
			sketchButton.disabled = true;
		});
		document.removeEventListener("keydown", arrows);

		// rimozione sketch precedente
		setTimeout(() => {
			// sketch precedente nascosto
			sketches[currentSketch].hidden = true;

			// disattivo animazioni
			sketches[currentSketch].classList.remove("fade-out-class");
		}, 650);


		// verifica del completamento animazione
		setTimeout(() => {
			sketches[selectedSketch].classList.remove("fade-in-class");

			// aggiornamento sketch corrente
			currentSketch = selectedSketch;
		}, 700);

		// riattivazione bottone + indicatori + frecce
		setTimeout(() => {
			forwardButton.disabled = false;
			Array.from(sketchButtons).forEach((sketchButton, index) => {
				sketchButton.disabled = false;
			});
			document.addEventListener("keydown", arrows);
		}, 1000);
	}
}