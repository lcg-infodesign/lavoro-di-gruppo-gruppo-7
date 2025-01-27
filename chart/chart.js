// importare dataset
let table;
let tableObj;
let nRows;
let years = ["2019", "2020", "2021", "2022"]
let year = years[0];
let font = "Georgia";
// parametri 
let Cohd;
let minCohd;
let maxCohd;
let Pua;
let Nua;
let minNua;
let maxNua;
let minPua;
let maxPua;
let selectedCountry = null;
let hoveringCountry = null;
// tavola di disegno
let x0;
let y0;
let titleWidth;
let xAxes;
let yAxes;
// liste / oggetti
let buttons = [];
let dataSaved = [];
let countriesByYear = [];
let yearData;
let legendShapes = [];
let cemeteryShapes = [];
//bottoni
let btnWidth;
let btnHeight;
let txtSize;
let bPadding;
let totalWidth;
let startX;
let yPadding;
let yB;
let xB;
let bdRadius;
let isMouseOver;
let xClose;
let sClose;
let yClose;
let spacing;
let p1;

// colori
let bgColor = ("#FFF2E4");
let titleColor = ("#794242");
let baseColor = ("#984E4E")
let incomeColors = [["#be7fb6", "#7c2b82"], ["#D38EA6", "#9a4267"], ["#F6AD7A", "#d3741c"], ["#fede7a", "#f0c715"]];
let strokeIncomeColors = ["#6a2775", "#8b4062", "#ad6936", "#dab61c"]
let noDataColor = ["#FFFFFF", "#ced0d4", "#939393"];
let puaColor = ("#FFFFFF80");

// valori per il glifo di sfondo sul focus
let focusShapePoints;
let focusGradientPoints;
let focusGrainDots;

let focusGlyphX;
let focusGlyphY;
let focusGlyphD;

let legendX;
let legendSize;

function preload() {
  table = loadTable("../assets/datadef.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60)


  // bottoni di navigazione
  buttons.forEach(btn => btn.remove());
  buttons = [];
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

  // stile dei bottoni di navigazione tra le pagine
  btnWidth = width * 0.08;
  btnHeight = height * 0.04;
  txtSize = width * 0.010;
  // padding (spazio tra i bottoni) = 0.01*width
  spacing = 0.08 + 0.01; // p1-p2 = spacing
  p1 = 1 - spacing;
  let p2 = p1 - spacing;
  let p4 = 1 - p1;
  let p3 = spacing + p4;
  updateNavButtons(p1, p2, p3, p4, btnWidth, btnHeight, txtSize);

  // converto csv 
  tableObj = table.getObject();
  nRows = table.getRowCount();
  manageData();
  manageAxes();
  manageCountry();
  calculateGradient();
  manageLegend();

  // macchia focus
  manageFocus()
}
function updateNavButtons(p1, p2, p3, p4, w, h, txtSize) {
  //posizione bottone che parte da sinistra
  // valori % da moltiplicare alla larghezza dello schermo
  let pos = [p1, p2, p3, p4];
  buttons.forEach((btn, i) => {
    btn.style('color', '#984E4E');
    btn.style('font-family', font);
    btn.style('font-size', `${txtSize}px`);
    btn.position(width * pos[i] - w / 2, height * 0.03);
    btn.size(w, h);
    btn.style('border-radius', `${width * 0.005}px`);
    btn.style('border', `${1}px solid #984E4E`);
    btn.style('background-color', 'transparent');
    btn.mouseOver(() => {
      btn.style('background-color', '#984E4E');
      btn.style('color', bgColor);
    });
    // ritorna al colore di sfondo trasparente
    btn.mouseOut(() => {
      btn.style('background-color', 'transparent');
      btn.style('color', '#984E4E');
    });
  });
}
function manageFocus() {
  focusGlyphX = width / 2;
  focusGlyphY = height / 2;

  if (width < 800) {
    focusGlyphD = width / 0.7;
  } else {
    focusGlyphD = width / 1.2;
  }
  focusShapePoints = calculateShapePoints(focusGlyphX, focusGlyphY, focusGlyphD);
  focusGradientPoints = calculateGradient(focusGlyphD);
  // gradiente grana sfondo focus
  let focusGrayScale = 110;
  let focusAlpha = 20;
  focusGrainDots = calculateGrain(focusGlyphX, focusGlyphY, focusGlyphD, focusShapePoints, focusGrayScale, focusAlpha);
}
function manageData() {
  // min max costo
  minCohd = Number(tableObj[0].cohd);
  maxCohd = Number(tableObj[0].cohd);
  minNua = Infinity;
  maxNua = 0;
  minPua = Infinity;
  maxPua = 0;
  // cerco minimo e massimo delle colonne del dataset utili a mappare gli elemnenti:
  for (let row of table.rows) {
    Cohd = row.getNum('cohd');
    Pua = row.getNum('pua');
    Nua = row.getNum('nua');

    minCohd = min(minCohd, Cohd);
    maxCohd = max(maxCohd, Cohd);
    if ((Nua != 0) && (Nua < minNua)) {
      minNua = Nua;
    }
    if (Nua > maxNua) {
      maxNua = Nua;
    }
    if ((Pua != 0) && (Pua < minPua)) {
      minPua = Pua;
    }
    if (Pua > maxPua) {
      maxPua = Pua;
    }
  }
}
function manageAxes() {
  // allineo x0 al bottone di navi
  x0 = (1 - p1) * width - btnWidth / 2;
  //coeff di y0 preso proporzionalmente dalla base di progetto realizzata su Figma 
  y0 = 0.122 * windowHeight;
  //asse x: la sua dimensione dipende dalla dimensioen del titolo
  textFont("Georgia")
  drawTitle();

  xAxes = width / 2 + titleWidth / 2;
  //asse y 
  yAxes = windowHeight - y0 / 2 - 30;
}
function manageCountry() {
  yearData = new countryFilter(tableObj, minCohd, maxCohd, minNua, maxNua, x0, xAxes, y0, yAxes);
  // filtra i paesi per l'year 2019
  countriesByYear = yearData.filterCountriesByYear(year);
  countriesByYear.sort(function (a, b) { return b.d - a.d });

  // calcolo i parametri delle forme da disegnare
  for (let country of countriesByYear) {
    // associo una proprietà aggiuntiva a ciascun oggetto country 
    // per contenere i punti della macchia  
    country.shapePoints = calculateShapePoints(country.x, country.y, country.d);
    country.gradientPoints = calculateGradient(country.d);
    country.grayScale = 100;
    country.alpha = 40;
    country.grainDots = calculateGrain(country.x, country.y, country.d, country.shapePoints, country.grayScale, country.alpha);
  }
}
function calculateShapePoints(x, y, d) {
  let points = [];
  let noiseScale = 0.25;
  let radius = d / 2;
  // per emma: prova a farlo in 2D 
  for (let angle = 0; angle < TWO_PI; angle += 0.1) {

    let dx = cos(angle) * radius;
    let dy = sin(angle) * radius;
    // aggiungo una randomicità ai valori dati a noise per far si che le macchie non siano speculari rispetto all'asse y
    let noiseFactor = map(noise(dx * noiseScale + random(-1, 1), dy * noiseScale + random(-1, 1)), 0, 1, 1, 1.1);
    points.push({
      x: x + dx * noiseFactor,
      y: y + dy * noiseFactor
    });
  }
  return points;
}
function calculateGradient(d) {
  let gradientPoints = [];
  let gradientX = random(-d / 2, d / 2);
  let gradientY = random(-d / 2, d / 2);

  gradientPoints.push({
    x: gradientX,
    y: gradientY
  })
  return gradientPoints;
}

// https://editor.p5js.org/lazydistribution/sketches/nB-VddIvd
function calculateGrain(x, y, d, shapePoints, grayScale, alpha) {
  const topLeftX = x - d;
  const topLeftY = y - d;
  const size = Math.ceil(d);

  // pg = immagine
  let pg = createGraphics(size * 2, size * 2);
  pg.pixelDensity(1);
  pg.loadPixels();

  // https://developer.mozilla.org/en-US/docs/Glossary/Identifier 
	// identifiers (_x, _y) sono utilizzati come loop Counters
  for (var _y = 0; _y < size * 2; _y += 1) {
    for (var _x = 0; _x < size * 2; _x += 1) {
      // controllo se il punto è interno alla forma del paese
      if (!isPointInsideShape(shapePoints, topLeftX + _x, topLeftY + _y)) {
        continue;
      }

      let i = (_x + _y * size * 2) * 4;

      // grigio (0-255)
      let value = random(grayScale);
      pg.pixels[i] = value;
      pg.pixels[i + 1] = value;
      pg.pixels[i + 2] = value;

      // trasparenza (alpha) (0-255)
      pg.pixels[i + 3] = alpha;
    }
  }
  pg.updatePixels();

  return pg;
}
// GRANA (come immagine)
// Ray casting algorithm per far si che i punti della texture siano generati solo all'interno del paese
// reference: https://en.wikipedia.org/wiki/Point_in_polygon 
function isPointInsideShape(shapePoints, x, y) {
  let inside = false;
  for (let i = 0, j = shapePoints.length - 1; i < shapePoints.length; j = i++) {
    let xi = shapePoints[i].x, yi = shapePoints[i].y;
    let xj = shapePoints[j].x, yj = shapePoints[j].y;

    let intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function manageLegend() {
  let legend = [
    { label: "High income", color: incomeColors[3], stroke: strokeIncomeColors[3] },
    { label: "Upper middle income", color: incomeColors[2], stroke: strokeIncomeColors[2] },
    { label: "Lower middle income", color: incomeColors[1], stroke: strokeIncomeColors[1] },
    { label: "Low income", color: incomeColors[0], stroke: strokeIncomeColors[0] },
    { label: "No Data", color: noDataColor, stroke: noDataColor[2] },
    { label: "Number of people who do not\nhave access to a healthy diet", color: ["black", "black"], outline: true },
  ]

  // legenda
  let legendHeightOffset = 45;
  legendX = windowWidth * (p1 - spacing) - btnWidth / 2;
  legendSize = width * 0.015;
  let x = legendX + legendSize / 2; //x iniziale legenda
  let y = y0 + legendSize / 2;

  legendShapes = [];
  for (let info of legend) {
    let shapePoints = calculateShapePoints(x, y, legendSize);
    let gradientPoints = calculateGradient(legendSize);
    let grainDots = calculateGrain(x, y, legendSize, shapePoints, 100, 40);

    legendShapes.push({
      x, y,
      d: legendSize,
      info: info,
      shapePoints: shapePoints,
      gradientPoints: gradientPoints,
      grainDots: grainDots,
      label: info.label,
      color: info.color,
      stroke: info.stroke,
      outline: info.outline,
    });
    y += legendHeightOffset;
  }

  // cimitero
  let cemeteryCount = yearData.getCountOfCountriesWithoutData(year);
  let cemeteryCols = 8;
  let cemeteryRows = Math.ceil(cemeteryCount / cemeteryCols);
  let cemeteryPadding = width * 0.0222;

  let nineOutOf10Row = map(9, 0, 10, y0, yAxes);
  let nineOutOf10RowWithoutNoDataText = nineOutOf10Row - cemeteryPadding - legendSize / 2;
  let cemeteryStartHeight = nineOutOf10RowWithoutNoDataText - cemeteryRows * (cemeteryPadding + legendSize) / 2

  cemeteryShapes = [];
  for (let i = 0; i < cemeteryCount; i++) {
    let x = legendX + legendSize / 2 + (i % cemeteryCols) * cemeteryPadding;
    let y = cemeteryStartHeight + Math.floor(i / cemeteryCols) * cemeteryPadding;

    let shapePoints = calculateShapePoints(x, y, legendSize);
    let gradientPoints = calculateGradient(legendSize);
    let grainDots = calculateGrain(x, y, legendSize, shapePoints, 100, 40);

    cemeteryShapes.push({
      x, y,
      d: legendSize,
      shapePoints: shapePoints,
      gradientPoints: gradientPoints,
      grainDots: grainDots,
    });
  }
}

function drawTitle() {
  push();
  fill(baseColor);
  noStroke();
  textSize(0.027 * width);
  textAlign(CENTER, TOP);
  //https://p5js.org/reference/p5/textWidth/ 
  let title = "Cost and Unaffordability of a Healthy Diet";
  titleWidth = textWidth(title)
  text(title, windowWidth / 2, height * 0.03);
  pop();
}

// ho calcolato tutte le variabili per poter disegnare tutto
function draw() {
  background(bgColor);
  textFont(font)
  drawAxes();
  drawLegend();

  let fiveOutOf10 = map(5, 0, 10, y0, yAxes);
  let nineOutOf10 = map(9, 0, 10, y0, yAxes);

  // drawThreshold(total, colored, x0, y, size, label)
  drawThreshold(10, 5, x0, fiveOutOf10, 4.5, "5+ out of 10 people have\nno access to a healthy diet");
  drawThreshold(10, 9, x0, nineOutOf10, 4.5, "9+ out of 10 people have\nno access to a healthy diet");

  // header
  drawTitle();


  // per ogni paese filtrato
  // voglio disegnare partendo da quello con d maggiore
  // https://www.w3schools.com/js/js_array_sort.asp

  // dobbiamo prima calcolarci x, y, diametro per ogni paese in countriesByYear
  for (let country of countriesByYear) {
    drawGlyph(country.x, country.y, country.d, country.shapePoints, country.gradientPoints, country.grainDots, strokeIncomeColors[country.income - 1], incomeColors[country.income - 1][0], incomeColors[country.income - 1][1]);
  }

  glyphHover();

  if (selectedCountry) {
    drawFocus(selectedCountry);
  }

  let showButtons = selectedCountry == null && hoveringCountry == null;

  if (showButtons) {
    // bottoni filtri anni
    drawYearButtons(txtSize, btnWidth, btnHeight);
    // bottoni navigazione
    buttons.forEach(btn => btn.show());
  } else {
    // bottoni navigazione
    buttons.forEach(btn => btn.hide());
  }
}

//disegno bottoni per cambio grafico in base all'anno
function drawYearButtons(txtSize, w, h) {
  bPadding = (titleWidth - (4 * w)) / 3;
  totalWidth = titleWidth;

  startX = windowWidth / 2 - (totalWidth / 2);
  yPadding = 25.5;
  yB = yAxes + yPadding;

  for (let i = 0; i < years.length; i++) {
    // rettangolo 
    xB = startX + i * (w + bPadding);
    bdRadius = 0.005 * width;
    isMouseOver = mouseX > xB && mouseX < xB + w && mouseY > yB && mouseY < yB + h;
    strokeWeight(1);
    stroke(baseColor);
    let isSelected = years[i] == year;
    if (isMouseOver || isSelected) {
      fill(baseColor);
    } else {
      fill(bgColor);
    }
    push();
    translate(xB, yB);
    rect(0, 0, w, h, bdRadius);
    // testo
    textSize(txtSize);
    noStroke();
    fill(isMouseOver || isSelected ? bgColor : baseColor);
    textAlign(CENTER, CENTER);
    text(years[i], w / 2, h / 2);
    pop();
  }
}


function drawLegend() {
  // disegno i glifi della legenda
  // testi income
  for (let entry of legendShapes) {
    fill(baseColor);
    textSize(txtSize);
    textAlign(LEFT, CENTER);

    if (entry.outline) {
      // disegno linea
      stroke(entry.color[0]);
      strokeWeight(1);
      let paddingY = 10;
      let r = entry.d / 2;
      let startX = entry.x - r;
      let endX = entry.x + r;
      let y = entry.y + r + paddingY;
      stroke(baseColor);
      line(startX, y, endX, y);
      // vertical line at start x
      line(startX, y - 5, startX, y + 5);
      // vertical line at end x
      line(endX, y - 5, endX, y + 5);

      noStroke();
      text(entry.label, entry.x + entry.d, entry.y + 8);
    } else {
      noStroke()
      text(entry.label, entry.x + entry.d, entry.y + 1);
    }

    // disegno forma dei paesi relativi agli income
    drawGlyph(
      entry.x,
      entry.y,
      entry.d,
      entry.shapePoints,
      entry.gradientPoints,
      entry.grainDots,
      entry.stroke,
      entry.color[0],
      entry.color[1],
      entry.outline
    );
  }

  // disegno paesi del cimitero
  for (let entry of cemeteryShapes) {
    drawGlyph(
      entry.x,
      entry.y,
      entry.d,
      entry.shapePoints,
      entry.gradientPoints,
      entry.grainDots,
      noDataColor[2], // stroke 
      noDataColor[0],
      noDataColor[1],
      entry.outline
    );
  }
  push()

  // scritta conteggio paesi cimitero
  let nineOutOf10Row = map(9, 0, 10, y0, yAxes);
  fill(baseColor);
  textAlign(LEFT, BASELINE);
  textSize(txtSize);
  noStroke();
  text("No Data for " + cemeteryShapes.length + " countries in " + year, legendX, nineOutOf10Row);
  pop()
}
function drawAxes() {
  stroke(baseColor);
  strokeWeight(0.5);
  line(x0, y0, xAxes, y0);

  // punta freccia x
  line(xAxes, y0, xAxes - 5, y0 - 5);
  line(xAxes, y0, xAxes - 5, y0 + 5);

  // punta freccia y
  line(x0, yAxes, x0 - 5, yAxes - 5);
  line(x0, yAxes, x0 + 5, yAxes - 5);

  let axesLabelOffset = 0.008*width;
  line(x0, y0, x0, yAxes);
  push();
  noStroke();
  fill(baseColor);
  textFont(font);
  textSize(txtSize);
  textAlign(LEFT, BASELINE);
  text("0 USD", x0, y0 - axesLabelOffset)
  textAlign(RIGHT, BASELINE);
  text("7 USD", xAxes, y0 - axesLabelOffset)
  textAlign(CENTER, BASELINE);
  text("COST (USD)", (x0 + xAxes) / 2, y0 - axesLabelOffset);
  textAlign(RIGHT, TOP);
  text("0 %", x0 - axesLabelOffset, y0);
  textAlign(RIGHT, BASELINE);
  text("100 %", x0 - axesLabelOffset, yAxes);
  push();
  textAlign(CENTER, BASELINE);
  translate(x0 - axesLabelOffset, (y0 + yAxes) / 2);
  rotate(PI * 3 / 2);
  text("UNAFFORDABILITY (%)", 0, 0);
  pop();
}

function drawGlyph(x, y, d, shapePoints, gradientPoints, grainDots, strokeColor, startColor, endColor, outline) {
  // riempimento dipende dall'income:
  noStroke();
  fill(1);
  push();
  strokeWeight(0.5);
  if (!strokeColor) {
    strokeColor = '#000000';
  }
  stroke(strokeColor);

  if (!outline) {
    // gradiente
    for (let point of gradientPoints) {
      // il gradiente viene applicato a partire dalle coordinate specificate 
      // le coordinate di default sono il centro della figura
      fillGradient('radial', {
        // from/to: [x, y, raggio]
        from: [x + point.x, y + point.y, d / 15],
        to: [x + point.x, y + point.y, d / 1],
        steps: [
          startColor,
          endColor,
        ]
      });

    }
  } else {
    noFill();
    stroke(startColor);
  }

  // forma della macchia
  beginShape();
  for (let p of shapePoints) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
  pop();

  if (!outline) {
    // grana (texture)
    image(grainDots, x - d, y - d);
  }

}

// ESEMPIO HOVER: 
// https://editor.p5js.org/kjhollen/sketches/S1Jxxt-HW
function glyphHover() {
  // se il mouse è sopra a country.x-country.d/2 e country.x+country.d/2 e 
  // country.y-country.d/2 e country.y+country.d/2
  //  --> fai apparire un testo con country.name

  hoveringCountry = null;
  for (let i = countriesByYear.length - 1; i >= 0; i--) {
    let country = countriesByYear[i];
    if (isMouseInsideCountry(country)) {
      hoveringCountry = country;
      push();
      // tabella valori alpha: https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4 
      //  hex alpha: 90% --> E6
      fill("#FFF2E4E6");
      rect(0, 0, width, height)
      pop();
      fill(152, 78, 78, 170)
      // circle(country.x, country.y, country.d);
      beginShape();
      for (let p of country.shapePoints) {
        vertex(p.x, p.y);
      }
      endShape(CLOSE);
      push();
      noStroke();
      fill(baseColor);
      textSize(0.027 * width);
      let interlinea = 0.013 * width;
      // x:20 = 53:80
      let hoverDxDistance = 0.053 * width;
      let textX = country.x + hoverDxDistance;
      if (country.x > windowWidth * 0.5) {
        // HP: larghezza finestra 1512 --> x:100 = 250:1512
        let hoverSxDistance = 0.140 * width;
        textX = country.x - hoverSxDistance; // posiziona il testo a sinistra del glifo
      }
      // nome paese hover
      text(country.name, textX, country.y - interlinea * 1.5);
      textSize(0.010 * width);
      // info paese hover
      let incomes = ["Low income", "Lower middle income", "Upper middle income", "High income"];

      text("COHD: " + country.cohd + " USD", textX, country.y + interlinea);
      text("PUA: " + country.pua + " %", textX, country.y + interlinea * 2);
      text("NUA: " + country.nua + " M", textX, country.y + interlinea * 3);
      text(incomes[country.income - 1], textX, country.y + interlinea * 4);
      pop();
      break
    }
  }
}
// https://p5js.org/reference/p5/mousePressed/
function mousePressed() {
  // i paesi interni a countriesByYear sono ordinati in base alla dimensioe: dal più grande al più piccolo.
  if (selectedCountry == null) {
    for (let i = countriesByYear.length - 1; i >= 0; i--) {
      let focusedCountry = countriesByYear[i];
      if (isMouseInsideCountry(focusedCountry)) {
        selectedCountry = focusedCountry;
        break;
      }
    }
  } else {
    // bottone uscita dal focus
    // rect(xClose, yClose, sClose, sClose);
    if ((mouseX > xClose) && (mouseX < xClose + sClose) && (mouseY > yClose) && (mouseY < yClose + sClose)) {
      selectedCountry = null;
    }
  }

  // bottoni anni
  for (let i = 0; i < years.length; i++) {
    xB = startX + i * (btnWidth + bPadding);
    if (mouseX > xB && mouseX < xB + btnWidth && mouseY > yB && mouseY < yB + btnHeight) {
      year = years[i];
      setup();
      break;
    }
  }
}
function isMouseInsideCountry(country) {
  return (
    (mouseX < country.x + country.d / 2) &&
    (mouseX > country.x - country.d / 2) &&
    (mouseY < country.y + country.d / 2) &&
    (mouseY > country.y - country.d / 2)
  );
}

function drawFocus() {
  //sfondo opacizzato
  push();
  fill(bgColor);
  rect(0, 0, width, height);
  pop();

  push();
  drawGlyph(
    focusGlyphX,
    focusGlyphY,
    focusGlyphD,
    focusShapePoints,
    focusGradientPoints,
    focusGrainDots,
    "bgColor", // no stroke
    incomeColors[selectedCountry.income - 1][0] + "50",
    incomeColors[selectedCountry.income - 1][1] + "50"
  );
  pop();

  let focusedCountryData = yearData.focusData();

  //titolo paese del focus
  textSize(0.025 * width);
  noStroke();
  fill(baseColor);
  textAlign(CENTER, BASELINE);
  let countryBaseline = (10.5 * height) / 100;
  text(selectedCountry.name, width / 2, countryBaseline);
  const focus = new countryFocus(focusedCountryData, minCohd, maxCohd, minPua, maxPua, width, height);
  focus.drawSingleFocus();

  let groupY = 170;
  let circleSize = 20;
  let spacing = (width / 4);
  let centerX = width / 2;

  let leftX = centerX - spacing;
  let middleX = centerX;
  let rightX = centerX + spacing;

  // gruppo sinistro
  fill(incomeColors[selectedCountry.income - 1][0]);
  circle(leftX, groupY, circleSize);

  fill(baseColor);
  textSize(0.01 * width);
  textAlign(CENTER);
  text("Percentage of the population\nthat can afford a healthy diet", leftX, groupY + 40);

  // gruppo centrale 
  fill(incomeColors[selectedCountry.income - 1][1]);
  circle(middleX, groupY, circleSize);

  fill(baseColor);
  text("Percentage of the population\nthat cannot afford a healthy diet", middleX, groupY + 40);

  // gruppo a destra
  let rectWidth = 0.2 * height;
  let rectHeight = 5;
  fill(incomeColors[selectedCountry.income - 1][1]);
  rect(rightX - rectWidth / 2, groupY - rectHeight / 2 + 10, rectWidth, rectHeight, rectHeight / 2);

  fill(baseColor);
  textAlign(LEFT);
  text("0 USD", rightX - rectWidth / 2, groupY);
  textAlign(RIGHT);
  text(maxCohd + " USD", rightX + rectWidth / 2, groupY);

  textAlign(CENTER);
  text("Cost of a healthy diet converted\nto international dollars", rightX, groupY + 40);

  // testo finale
  textSize(0.012 * width);
  text("Number of people who didn't have access to a healthy diet", width / 2, height - 100);

  // bottone chiusura focus
  noFill();
  xClose = width - 100;
  sClose = (0.020 * width);
  yClose = countryBaseline - sClose;
  stroke(baseColor);
  strokeWeight(1.5);
  line(xClose, yClose, xClose + sClose, yClose + sClose);
  line(xClose + sClose, yClose, xClose, yClose + sClose);

}

// disegno omini (riempiti e vuoti) per soglie grafico
function drawPeople(total, colored, x, y, size) {
  stroke(baseColor);
  strokeWeight(0.8);
  fill(bgColor);
  // omini disegnati come unione di varie forme
  for (let i = 0; i < total; i++) {
    if (i < colored) {
      // omini pieni
      fill(baseColor);
      circle(x + size / 2, y + size, size);
      circle(x + size / 2, y + size * 2.2, size);
      square(x, y + size * 2.2, size);
    } else {
      // omini vuoti
      fill(bgColor);
      circle(x + size / 2, y + size, size);
      arc(x + size / 2, y + size * 2.2, size, size, PI, PI * 2);
      line(x, y + size * 2.2, x, y + size * 2.2 + size);
      line(x, y + size * 2.2 + size, x + size, y + size * 2.2 + size);
      line(x + size, y + size * 2.2, x + size, y + size * 2.2 + size);
    }
    x += size * 1.77;
  }
}

// disegno delle soglie sul grafico
function drawThreshold(total, colored, x0, y, size, label) {
  // linea
  stroke(baseColor);
  strokeWeight(0.8);
  line(x0, y, xAxes, y);
  // y: altezza dei vari elementi
  y += size;

  // omini
  size = size / 1000 * width;
  let figureWidth = size * 1.7; // larghezza di un singolo omino incluso spazio
  let totalWidth = figureWidth * total; // larghezza totale di tutti gli omini

  // posizione degli omini in modo che l'ultimo sia allineato con xAxes
  let startX = xAxes - totalWidth;

  drawPeople(total, colored, startX, y, size);
  y += size * 5 + 5;

  // testo
  noStroke();
  fill(baseColor);
  textSize(txtSize * 0.66);
  text(label, startX, y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // ridefinisco i parametri anche quando windowResize non solo quando si ricarica la pagina:
  btnWidth = width * 0.08;
  btnHeight = height * 0.04;
  txtSize = width * 0.010;
  let spacing = 0.08 + 0.01; // p1-p2 = spacing
  let p1 = 1 - spacing;
  let p2 = p1 - spacing;
  let p4 = 1 - p1;
  let p3 = spacing + p4;
  updateNavButtons(p1, p2, p3, p4, btnWidth, btnHeight, txtSize);
  manageAxes();
  manageData();
  manageCountry();
  manageLegend();
  manageFocus();
}

