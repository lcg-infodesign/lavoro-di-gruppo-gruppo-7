/*
   utilizzo della modalità ad istanze di p5.js* in modo da garantire l'inserimento
   di più sketch all'interno di un'unica pagina

   *attraverso la notazione p.
*/

// costanti dei colori
const BG_COLOR = "#FFF2E4";
const FG_COLOR = "#984E4E";
const STAIN_COLOR1 = "#D38EA6";
const STAIN_COLOR2 = "#9a4267";

// costanti delle dimensioni
const AXIS_START = 150;
const TOP_MARGIN = 150;
const SIDE_MARGIN = 150;
const ARROW_OFFSET = 155;
const SMALL_CIRCLE_SIZE = 20;
const MEDIUM_CIRCLE_SIZE = 50;
const BIG_CIRCLE_SIZE = 100;
const STAIN_SPACING = 50;

// fattore di ridimensionamento
let rf;

// es
let example = {
	country: "India",
	year: "2019",
	nua: "789.3M",
	income: "Lower middle"
}

// bottone scroll
function createScrollButton(p) {
	p.stroke(FG_COLOR);
	p.strokeWeight(3);
	p.line(p.width/2 - 60, p.height - 80, p.width/2, p.height - 40);
	p.line(p.width/2 + 60, p.height - 80, p.width/2, p.height - 40);
}

// primo sketch
function sketch0(p) {
	p.setup = () => {
		let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
		canvas.parent("sketch0");
		rf = p.map(p.windowWidth, 600, 1200, 0.5, 1);
		p.noLoop();
	}

	p.draw = () => {
		p.background(BG_COLOR);
		p.textFont("Georgia");
		p.fill(FG_COLOR);
		p.noStroke();

		// titolo
		p.textSize(60 * rf);
		p.textAlign(p.CENTER, p.CENTER);
		p.text("Cost and Unaffordability\nof a Healthy Diet", p.width/2, p.height/2);

		// sottotitolo
		p.textSize(18 * rf);
		p.text("FAOSTAT • 2019 - 2022", p.width/2, p.height/2 + 100 * rf);

		createScrollButton(p);
	}

	// resize responsive
	p.windowResized = () => {
		rf = p.map(p.windowWidth, 600, 1200, 0.5, 1);
		rf = p.constrain(rf, 0.5, 1);
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	}
}
new p5(sketch0);

// secondo sketch
function sketch1(p) {
	p.setup = () => {
		let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
		canvas.parent("sketch1");
		p.noLoop();
	}

	p.draw = () => {
		p.background(BG_COLOR);
		p.textFont("Georgia");
		p.noStroke();
		p.fill(FG_COLOR);

		// paragrafi di testo
		p.textSize(24 * rf);
		p.textAlign(p.CENTER, p.CENTER);
		p.text(
			"Each year millions of people do not have access\n" +
			"to a healthy and balanced diet.\n\nBetween 2019 and 2022, Covid-19 worsened " +
			"the situation,\nsince then access to a sustainable diet\nhas been one of the main goals " +
			"of Agenda 2030.\n\nFollows a chart that shows\npercentage of access and costs of a " +
			"healthy diet\nduring that time.",
			p.width/2, p.height/2
		);

		createScrollButton(p);
	}

	// resize responsive
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	}
}
new p5(sketch1);

// terzo sketch
function sketch2(p) {
	p.setup = () => {
		let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
		canvas.parent("sketch2");
		p.noLoop();
	}

	p.draw = () => {
		p.background(BG_COLOR);
		p.textFont("Georgia");
		p.noStroke();
		p.fill(FG_COLOR);

		// descrizione
		p.textSize(24 * rf);
		p.textAlign(p.CENTER, p.CENTER);
		p.text("Each stain inside the chart depicts a country", p.width/2, p.height/2 - 120 * rf);

		// nome paese
		p.textSize(50 * rf);
		p.text(example.country, p.width/2, p.height/2 - 40 * rf);

		// glifo semplice
		p.circle(p.width/2, p.height/2 + 50 * rf, SMALL_CIRCLE_SIZE * rf);

		createScrollButton(p);
	}

	// resize responsive
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	}
}
new p5(sketch2);

// quarto sketch
function sketch3(p) {
	p.setup = () => {
		let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
		canvas.parent("sketch3");
		p.noLoop();
	}

	p.draw = () => {
		p.background(BG_COLOR);
		p.textFont("Georgia");
		p.noStroke();
		p.fill(FG_COLOR);

		// descrizione
		p.textSize(24 * rf);
		p.textAlign(p.CENTER, p.CENTER);
		p.text(
			"Its size is determined by how many people\n" +
			"do not have access to a healthy diet",
			p.width/2, p.height/2 - 120 * rf
		);

		// nome paese
		p.textSize(50 * rf);
		p.text(example.country, p.width/2, p.height/2 - 40 * rf);

		// glifo semplice
		p.circle(p.width/2, p.height/2 + 50 * rf, BIG_CIRCLE_SIZE * rf);

		// nua
		p.textSize(30 * rf);
		p.text(example.nua, p.width/2, p.height/2 + 140 * rf);

		createScrollButton(p);
	}

	// resize responsive
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	}
}
new p5(sketch3);

// quinto sketch
function sketch4(p) {
	p.setup = () => {
		let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
		canvas.parent("sketch4");
		p.noLoop();
	}

	p.draw = () => {
		p.background(BG_COLOR);
		p.textFont("Georgia");
		p.noStroke();
		p.fill(FG_COLOR);

		// descrizione
		p.textSize(24 * rf);
		p.textAlign(p.CENTER, p.CENTER);
		p.text(
			"There are four income levels rappresented\nby four different colors",
			p.width/2, p.height/2 - 120 * rf
		);

		// nome paese
		p.textSize(50 * rf);
		p.text(example.country, p.width/2, p.height/2 - 40 * rf);

		// glifo finale
		stain(p, p.width/2, p.height/2 + 50 * rf, MEDIUM_CIRCLE_SIZE * rf, STAIN_COLOR1, STAIN_COLOR2);

		// income
		p.fill(FG_COLOR);
		p.textSize(30 * rf);
		p.text(example.income, p.width/2, p.height/2 + 140 * rf);

		createScrollButton(p);
	}

	// resize responsive
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	}
}
new p5(sketch4);

// posizionamento del glifo
let glyphPosition = { x: 0, y: 0 };

// sesto sketch
function sketch5(p) {
	p.setup = () => {
		let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
		canvas.parent("sketch5");
		p.noLoop();
	}

	p.draw = () => {
		p.background(BG_COLOR);
		p.textFont("Georgia");

		// asse x (con punta a freccia)
		p.stroke(FG_COLOR);
		p.strokeWeight(1);
		p.line(AXIS_START * rf, TOP_MARGIN * rf, p.width - SIDE_MARGIN * rf, TOP_MARGIN * rf);
		p.line(p.width - ARROW_OFFSET * rf, (TOP_MARGIN - 5) * rf, p.width - SIDE_MARGIN * rf, TOP_MARGIN * rf);
		p.line(p.width - ARROW_OFFSET * rf, (TOP_MARGIN + 5) * rf, p.width - SIDE_MARGIN * rf, TOP_MARGIN * rf);

		// etichetta asse
		p.noStroke();
		p.fill(FG_COLOR);
		p.textSize(15 * rf);
		p.textAlign(p.CENTER);
		p.text("COST (USD)", (p.width - SIDE_MARGIN * rf + AXIS_START * rf)/2, TOP_MARGIN * rf - 20 * rf);

		// etichette estremi asse
		p.textAlign(p.LEFT);
		p.text("0 USD", AXIS_START * rf, TOP_MARGIN * rf - 20 * rf);
		p.textAlign(p.RIGHT);
		p.text("7 USD", p.width - SIDE_MARGIN * rf, TOP_MARGIN * rf - 20 * rf);
		p.textAlign(p.CENTER);

		let centerX = p.width/2;
		let centerY = p.height/2;

		// calcolo larghezza titolo e sottotitolo
		p.textSize(30 * rf);
		let titleWidth = p.textWidth("Horizontal axis");
		p.textSize(18 * rf);
		let descWidth = p.textWidth("Daily cost of a healthy diet per person");

		// calcolo posizionamenti
		let textWidth = Math.max(titleWidth, descWidth);
		let glyphWidth = MEDIUM_CIRCLE_SIZE * rf;
		let spacing = STAIN_SPACING * rf;
		let groupWidth = glyphWidth + spacing + textWidth;

		let offsetX = centerX - groupWidth / 2;
		let offsetY = centerY;

		// collegamento glifo-asse
		p.stroke(FG_COLOR);
		p.strokeWeight(1);
		p.line(offsetX, TOP_MARGIN * rf, offsetX, offsetY);

		p.push();
		p.translate(offsetX, offsetY);

		// glifo finale
		p.noStroke();
		stain(p, 0, 0, glyphWidth, STAIN_COLOR1, STAIN_COLOR2);

		// titolo
		p.noStroke();
		p.textAlign(p.LEFT, p.TOP);
		p.fill(FG_COLOR);
		p.textSize(30 * rf);
		p.text("Horizontal axis", glyphWidth + spacing, -44 * rf);

		// sottotitolo
		p.textSize(18 * rf);
		p.text(
			"Daily cost of a healthy diet per person\nin International Dollars (CoHD)",
			glyphWidth + spacing, 10 * rf
		);

		p.pop();

		// salvataggio coordinate glifo
		glyphPosition.x = offsetX;
		glyphPosition.y = offsetY;

		createScrollButton(p);
	}

	// resize responsive
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	}
}
new p5(sketch5);

// settimo sketch
function sketch6(p) {
	p.setup = () => {
		let canvas = p.createCanvas(p.windowWidth, p.windowHeight);
		canvas.parent("sketch6");
		p.noLoop();
	}

	p.draw = () => {
		p.background(BG_COLOR);
		p.textFont("Georgia");

		let centerY = p.height/2;

		// asse y (con punta a freccia)
		p.stroke(FG_COLOR);
		p.strokeWeight(1);
		p.line(AXIS_START * rf, TOP_MARGIN * rf, AXIS_START * rf, p.height - SIDE_MARGIN * rf);
		p.line((AXIS_START - 5) * rf, p.height - ARROW_OFFSET * rf, AXIS_START * rf, p.height - SIDE_MARGIN * rf);
		p.line((AXIS_START + 5) * rf, p.height - ARROW_OFFSET * rf, AXIS_START * rf, p.height - SIDE_MARGIN * rf);

		// etichetta asse
		p.noStroke();
		p.fill(FG_COLOR);
		p.textSize(15 * rf);
		p.textAlign(p.CENTER, p.CENTER);
		p.push();
		p.translate((AXIS_START - 20) * rf, (p.height - SIDE_MARGIN * rf + TOP_MARGIN * rf)/2);
		p.rotate(-p.PI/2);
		p.text("UNAFFORDABILITY (%)", 0, 0);
		p.pop();

		// etichette estremi asse
		p.textAlign(p.RIGHT, p.TOP);
		p.text("0 %", AXIS_START * rf - 20 * rf, TOP_MARGIN * rf);
		p.textAlign(p.RIGHT, p.BOTTOM);
		p.text("100 %", AXIS_START * rf - 20 * rf, p.height - SIDE_MARGIN * rf);

		// collegamento glifo-asse
		p.stroke(FG_COLOR);
		p.strokeWeight(1);
		p.line(AXIS_START * rf, centerY, glyphPosition.x, centerY);

		p.push();
		p.translate(glyphPosition.x, glyphPosition.y);

		// glifo finale
		p.noStroke();
		stain(p, 0, 0, MEDIUM_CIRCLE_SIZE * rf, STAIN_COLOR1, STAIN_COLOR2);

		// titolo
		p.noStroke();
		p.textAlign(p.LEFT, p.TOP);
		p.fill(FG_COLOR);
		p.textSize(30 * rf);
		p.text("Vertical axis", MEDIUM_CIRCLE_SIZE * rf + STAIN_SPACING * rf, -44 * rf);

		// sottotitolo
		p.textSize(18 * rf);
		p.text(
		    "Percentage of people who do not\nhave access to a healthy diet (PUA)",
		    MEDIUM_CIRCLE_SIZE * rf + STAIN_SPACING * rf, 10 * rf
		);
		p.pop();
	}

	// resize responsive
	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	}
}
new p5(sketch6);