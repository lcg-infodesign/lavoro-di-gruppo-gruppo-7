//immagini team
let team = [
  { name: 'Camilla Costato', image: 'foto/camilla.png' },
  { name: 'Christian B. Giannarelli', image: 'foto/christian.png' },
  { name: 'Emma Troni', image: 'foto/emma.png' },
  { name: 'Federica Casartelli', image: 'foto/federica.png' },
  { name: 'Giacomo Assi', image: 'foto/giacomo.png' },
  { name: 'Sofia Rainone', image: 'foto/sofia.png' },
  { name: 'Veronica Bedin', image: 'foto/veronica.png' }
];

let images = [];
let buttons = [];

function preload() {
  team.forEach(member => images.push(loadImage(member.image)));
}

//bottoni nel setup 
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
      btn.style('background-color', '#984E4E');
      btn.style('color', 'white');
    });
    // ritorna al colore di sfondo trasparente
    btn.mouseOut(() => {
      btn.style('background-color', 'transparent');
      btn.style('color', '#984E4E');
    });
  });
}
// team griglia e testi
function Team() {
  let spacingX = width / 5;
  let spacingY = height / 4;
  let startY = height * 0.6;

  textAlign(CENTER);
  images.forEach((img, i) => {
    let row = i < 4 ? 0 : 1;
    let col = row === 0 ? i : i - 4;
    let colsInRow = row === 0 ? 4 : 3;

    let totalWidth = colsInRow * spacingX;
    let offsetX = (width - totalWidth) / 2 + spacingX / 2;

    let x = offsetX + col * spacingX;
    let y = startY + row * spacingY;

    let imgSize = Math.min(width, height) * 0.1;
    let aspectRatio = img.width / img.height;

    imageMode(CENTER);
    image(img, x, y - imgSize / (2 * aspectRatio), imgSize, imgSize / aspectRatio);

    fill('#984E4E');
    textSize(width * 0.011);
    text(team[i].name, x, y + height * 0.01);
  });
}


function draw() {
  background('#FFF2E4');

  // style titoli
  fill('#984E4E');
  textFont('Georgia');
  textAlign(LEFT, TOP);
  textSize(width * 0.015);
  textStyle(BOLD);
  text('Our project', width * 0.1, height * 0.1);
  text('Our team', width * 0.55, height * 0.1);
  
  // style paragrafi
  textStyle(NORMAL);
  textSize(width * 0.011);
  textWrap(WORD);
  text('Our goal is to leverage the "Cost and Affordability of a Healthy Diet" (CoAHD) dataset from FAOStat to analyze and better understand the global issue of food inaccessibility. By adopting an evidence-based approach, we strive to contribute to the creation of a fairer and more inclusive food system that guarantees the right to food for all.', width * 0.1, height * 0.17, width * 0.35);
  text('We are a team of seven students from Politecnico di Milano, united by a passion for data analysis and its potential to address global challenges. Our goal is to apply a rigorous approach to dataset analysis, transforming complex data into actionable knowledge to create a positive and transformative impact.', width * 0.55, height * 0.17, width * 0.35);


  // linea divisoria
  stroke('#984E4E');
  strokeWeight(1);
  line(width * 0.5, height * 0.1, width * 0.5, height * 0.3);
  noStroke();

  Team();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateButton(); // aggorna la posizione e dimensione dei bottoni
  redraw();
}
