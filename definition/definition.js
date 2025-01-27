let datasetLink;
let columnWidth;
let rowSpacing;
let startY;

let buttons = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

let buttonLabels = ['About', 'Definitions', 'Show Chart', 'Introduction'];
let buttonLinks = [
  '../about/about.html',
  '../definition/definition.html',
  '../chart/chart.html',
  '../index.html'
];

buttonLabels.forEach((label, i) => {
  let btn = createButton(label);
  btn.mousePressed(() => (window.location.href = buttonLinks[i]));
  buttons.push(btn);
});
updateButton();
link();


}

function updateButton() {
  // valori % da moltiplicare alla larghezza dello schermo
  spacing = 0.08 + 0.01; // p1-p2 = spacing
  p1 = 1-spacing;
  let p2 = p1 - spacing;
  let p4 = 1-p1; 
  let p3 = spacing + p4;
  // posizioni bottone che parte da sinistra
  let positions = [p1, p2, p3, p4];
  buttons.forEach((btn, i) => {
    let btnWidth = width * 0.08;
    let btnHeight = height * 0.04;
    let fontSize = width * 0.010; 
    btn.style('color', '#984E4E');
    btn.style('font-family', 'Georgia, serif'); 
    btn.style('font-size', `${fontSize}px`);
    btn.position(width * positions[i] - btnWidth / 2, height * 0.03);
    btn.size(btnWidth, btnHeight);
    btn.style('border-radius', `${width * 0.005}px`);
    btn.style('border', `${width * 0.001}px solid #984E4E`);
    btn.style('background-color', 'transparent');
    btn.mouseOver(() => {
      btn.style('background-color', '#984E4E'); //  colore di sfondo al passaggio del mouse
      btn.style('color', 'white'); 
    });

    btn.mouseOut(() => {
      btn.style('background-color', 'transparent'); // torno al colore di sfondo trasparente
      btn.style('color', '#984E4E'); 
    });
  });
}

function link(){

  // link in basso con posizionamento CSS fisso
  datasetLink = createA('https://www.fao.org/faostat/en/#data/CAHD', 'Full dataset is available here', '_blank');//collegamento
  datasetLink.style('position', 'absolute');
  datasetLink.style('bottom', `${width * 0.023}px`);
  datasetLink.style('left', '50%');
  datasetLink.style('transform', 'translateX(-50%)');
  datasetLink.style('font-family', 'Georgia');
  datasetLink.style('font-size', `${width * 0.011}px`);
  datasetLink.style('color', '#984E4E');
  updateLink();
}
function updateLink() {
  datasetLink.style('font-size', `${width * 0.011}px`);
}

function draw() {
  background(color('#FFF2E4'));

  textFont('Georgia');
  fill(color('#984E4E'));

  let columnWidth = width * 0.35;
  let rowSpacing = height * 0.05;
  let startY = height * 0.1;
  let titles = [
    "CoHD: Cost of a Healthy Diet",
    "PUA: Prevalence of Unaffordability",
    "NUA: People Unable to Afford Healthy Diet",
    "USD: United States Dollar",
    "Income: Income Levels",
    "No Data: Countries with no Values",
  ];

  let paragraphs = [
    "The cost of a healthy diet indicator is the cost of purchasing the least expensive locally available foods to meet requirements for energy and food-based dietary guidelines (FBDGs), for a representative person within energy balance at 2330 kcal/day. The unit of measurement is dollars per person per day.",
    "The indicator measures the percentage of people whose disposable income, after covering basic non-food necessities, is insufficient to afford the least-cost healthy diet. It is calculated by adding the cost of a healthy diet (CoHD) to the cost of basic non-food goods and services to set a threshold.",
    "The indicator estimates the total number of people who are unable to afford a healthy diet. The NUA indicator is computed by multiplying PUA by the reference population size taken from the 2022 revision of the World Population Prospects.",
    "The cost of a healthy diet is converted to international dollars using purchasing power parity (PPP).",
    "Countries are categorized into four income levels: low-income, lower-middle-income, upper-middle-income, and high-income. Each level reflects the country's ability to provide access to resources like a healthy diet, with lower-income nations facing greater challenges.",
    "The values for CoHD, PUA, or NUA are missing for some countries in the dataset, so they are represented outside of our chart.",
  ];
  // riga
  for (let row = 0; row < 3; row++) {
    let yOffset = startY + row * (height * 0.25 + rowSpacing);
  //due colonne per riga
    for (let col = 0; col < 2; col++) {
      let index = row * 2 + col;

      let xOffset = col === 0 ? width * 0.1 : width * 0.55;
      let title = titles[index];
      let paragraph = paragraphs[index];

      // titoli
      textAlign(LEFT, TOP);
      textSize(width * 0.015);
      textStyle(BOLD);
      text(title, xOffset, yOffset);

      // paragrafi
      textStyle(NORMAL);
      textSize(width * 0.011);
      textWrap(WORD);
      text(paragraph, xOffset, yOffset + height * 0.07, columnWidth);

      // linee divisorie
      if (col === 0) {
        stroke('#984E4E');
        strokeWeight(1);
        line(width * 0.5, yOffset, width * 0.5, yOffset + height * 0.2);
        noStroke();
      }
    }
  }


}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateButton(); // Aggiorna posizione e dimensione dei bottoni
  redraw(); // Ridisegna il canvas
  updateLink();
}