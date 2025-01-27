// ----- GESTIONE PAGINA SHOW CHART | grafico principale ------

// FUNZIONAMENTO GENERALE:
// - quando il canvas è disegnato all'avvio nel setup(), vengono calcolati i parametri degli elementi 
//   poi disegnati nella draw(), per poter tenere la visualizzazione in Loop() dello sketch.  
// - questa impostazione del file permette di gestire l'interazione al mouse hover (https://editor.p5js.org/kjhollen/sketches/S1Jxxt-HW)
//   riaggiornando al momento dell'interazione gli elementi visibili nel canvas  

// GESTIONE SOVRAPPOSIZIONE PAESI GRAFICO
// - per garantire la visualizzazione di tutti i paesi, anche quando avviene una sovrapposizione a causa di parametri simili,
//  le "macchie" associate ai paesi vengono disegnate a partire da quelle con dimensioni maggiori (diametro).
// - tale organizzazione del disegno permette di selezionare il paese desiderato sia al mouse hover che al mousePressed()

// PARAMETRI DI VISUALIZZAZIONE:
// valori % misurati e calcolati a partire dal prototipo definitivo realizzato su Figma
// calcolati in funzione delle dimensioni del viewport per vincolare le dimensioni degli elementi 
// alla larghezza dello schermo quando possibile e necessario per la visualizzazione

// GESTIONE GRANA
// per rendere la visualizzazione più fluida (ridurre i tempi di caricamento degli sketch del grafico principale)
// la grana è stata calcolata tramite dei parametri per poi essere inserita come immagine/texture all'interno del disegno delle "macchie" (https://editor.p5js.org/lazydistribution/sketches/nB-VddIvd)

// importazione dataset (../assets/datadef.csv)
let table;
let tableObj;
let nRows;
let years = ["2019", "2020", "2021", "2022"]
let year = years[0];
// parametri del dataset
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
let xAxes;
let yAxes;
let p1;
let spacing;
let titleWidth;
let legendX;
let legendSize;
let startX;
// liste / oggetti
let buttons = [];
let countriesByYear = [];
let yearData;
let legendShapes = [];
let noDataShapes = [];
// bottoni
let btnWidth;
let btnHeight;
let txtSize;
let bPadding;
let totalWidth;
let yPadding;
let yB;
let xB;
let bdRadius;
let isMouseOver;
let xClose;
let sClose;
let yClose;
// colori e font
let bgColor = ("#FFF2E4");
let titleColor = ("#794242");
let baseColor = ("#984E4E")
let incomeColors = [["#be7fb6", "#7c2b82"], ["#D38EA6", "#9a4267"], ["#F6AD7A", "#d3741c"], ["#fede7a", "#f0c715"]];
let strokeIncomeColors = ["#6a2775", "#8b4062", "#ad6936", "#dab61c"]
let noDataColor = ["#FFFFFF", "#ced0d4", "#939393"];
let puaColor = ("#FFFFFF80");
let font = "Georgia";
// glifo utilizzato come sfondo per la visualizzazione di dettaglio (focus) 
let focusShapePoints;
let focusGradientPoints;
let focusGrainDots;
let focusGlyphX;
let focusGlyphY;
let focusGlyphD;

function preload() {
  table = loadTable("../assets/datadef.csv", "csv", "header");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  initializeNavigationButtons();
  // converto csv in oggetto
  tableObj = table.getObject();
  nRows = table.getRowCount();
  manageData();
  manageAxes();
  manageCountry();
  manageLegend();
  manageFocus();
}
// bottoni di navigazionee
function initializeNavigationButtons() {
  buttons.forEach(btn => btn.remove());
  buttons = [];
  const buttonLabels = ['About', 'Definitions', 'Show Chart', 'Introduction'];
  const buttonLinks = [
    '../about/about.html',
    '../definition/definition.html',
    '../chart/chart.html',
    '../index.html'
  ];
  buttonLabels.forEach((label, i) => {
    // bottoni realizzati con p5.js --> https://p5js.org/reference/p5/createButton/
    let btn = createButton(label);
    btn.mousePressed(() => (window.location.href = buttonLinks[i]));
    buttons.push(btn);
  });
  // coeff % in funzione delle dimensioni del viewport
  btnWidth = width * 0.08;
  btnHeight = height * 0.04;
  txtSize = width * 0.010;
  spacing = 0.08 + 0.01;
  // valori % da moltiplicare alla larghezza dello schermo
  p1 = 1 - spacing;
  let p2 = p1 - spacing;
  let p4 = 1 - p1;
  let p3 = spacing + p4;
  updateNavButtons(p1, p2, p3, p4, btnWidth, btnHeight, txtSize);
}
function updateNavButtons(p1, p2, p3, p4, w, h, txtSize) {
  // stilizzazione bottoni con p5.js --> https://editor.p5js.org/gr.gromko/sketches/Rc1ZSbhiA 
  let pos = [p1, p2, p3, p4];
  buttons.forEach((btn, i) => {
    btn.style('color', baseColor);
    btn.style('font-family', font);
    btn.style('font-size', `${txtSize}px`);
    btn.position(width * pos[i] - w / 2, height * 0.03);
    btn.size(w, h);
    btn.style('border-radius', `${width * 0.005}px`);
    btn.style('border', `${1}px solid ${baseColor}`);
    btn.style('background-color', 'transparent');
    // cambio colori al mouseOver() --> https://p5js.org/reference/p5.Element/mouseOver/
    btn.mouseOver(() => {
      btn.style('background-color', baseColor);
      btn.style('color', bgColor);
    });
    // ripristino colori al mouseOut() --> https://p5js.org/reference/p5.Element/mouseOut/ 
    btn.mouseOut(() => {
      btn.style('background-color', 'transparent');
      btn.style('color', baseColor);
    });
  });
}
// calcolo parametri per disegnare le "macchie" che rappresentano i paesi (calculateShapePoints, calculateGradient, calculateGrain)
function calculateShapePoints(x, y, d) {
  let points = [];
  let noiseScale = 0.25;
  let radius = d / 2;
  for (let angle = 0; angle < TWO_PI; angle += 0.1) {
    let dx = cos(angle) * radius;
    let dy = sin(angle) * radius;
    // aggiunta di una randomicità ai valori dati a noise() per fare in modo che le "macchie" non siano speculari rispetto all'asse y
    let noiseFactor = map(noise(dx * noiseScale + random(-1, 1), dy * noiseScale + random(-1, 1)), 0, 1, 1, 1.1);
    points.push({
      x: x + dx * noiseFactor,
      y: y + dy * noiseFactor
    });
  }
  return points;
}
// uso libreria p5 --> https://www.npmjs.com/package/p5.fillgradient 
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
// realizzazione della grana --> https://editor.p5js.org/lazydistribution/sketches/nB-VddIvd
function calculateGrain(x, y, d, shapePoints, grayScale, alpha) {
  const topLeftX = x - d;
  const topLeftY = y - d;
  const size = Math.ceil(d);
  let pg = createGraphics(size * 2, size * 2);
  pg.pixelDensity(1);
  pg.loadPixels();

  // https://developer.mozilla.org/en-US/docs/Glossary/Identifier 
  // identifiers (_x, _y) sono utilizzati come loop Counters
  for (var _y = 0; _y < size * 2; _y += 1) {
    for (var _x = 0; _x < size * 2; _x += 1) {
      // verifica che il punto si trovi all'interno della forma della "macchia" 
      if (!isPointInsideShape(shapePoints, topLeftX + _x, topLeftY + _y)) {
        continue;
      }
      let i = (_x + _y * size * 2) * 4;
      // scala di grigio
      let value = random(grayScale);
      pg.pixels[i] = value;     // r
      pg.pixels[i + 1] = value; // g
      pg.pixels[i + 2] = value; // b
      // fattore di trasparenza
      pg.pixels[i + 3] = alpha;
    }
  }
  pg.updatePixels();
  return pg;
}
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
// gestione dei valori per la visualizzazione di dettaglio (focus) 
function manageFocus() {
  focusGlyphX = width / 2;
  focusGlyphY = height / 2;
  if (width < 800) {
    focusGlyphD = width / 0.7;
  } else {
    focusGlyphD = width / 1.2;
  }
  // calcolo dei valori per disegnare la "macchia" di sfondo del focus
  focusShapePoints = calculateShapePoints(focusGlyphX, focusGlyphY, focusGlyphD);
  focusGradientPoints = calculateGradient(focusGlyphD);
  let focusGrayScale = 110;
  let focusAlpha = 20;
  focusGrainDots = calculateGrain(focusGlyphX, focusGlyphY, focusGlyphD, focusShapePoints, focusGrayScale, focusAlpha);
}
// gestione dei dati importati dal dataset
function manageData() {
  minCohd = Number(tableObj[0].cohd);
  maxCohd = Number(tableObj[0].cohd);
  minNua = Infinity;
  maxNua = 0;
  minPua = Infinity;
  maxPua = 0;
  // definizione valori min e max nelle colonne del dataset utili per mappare gli elemnenti:
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
// calcolo parametri per disegno piano cartesiano
function manageAxes() {
  // allineo x0 al bottone di nav più a sx (introduction)
  x0 = (1 - p1) * width - btnWidth / 2;
  y0 = 0.122 * windowHeight;
  textFont("Georgia")
  drawTitle();
  //asse x (pto finale è allineato alla dim del titolo)
  xAxes = width / 2 + titleWidth / 2;
  //asse y 
  yAxes = windowHeight - y0 / 2 - 30;
}
// calcolo parametri legenda
function manageLegend() {
  let legend = [
    { label: "High Income", color: incomeColors[3], stroke: strokeIncomeColors[3] },
    { label: "Upper Middle Income", color: incomeColors[2], stroke: strokeIncomeColors[2] },
    { label: "Lower Middle Income", color: incomeColors[1], stroke: strokeIncomeColors[1] },
    { label: "Low Income", color: incomeColors[0], stroke: strokeIncomeColors[0] },
    { label: "No Data", color: noDataColor, stroke: noDataColor[2] },
    { label: "Number of people who did not\nhave access to a healthy diet", color: [baseColor, baseColor], outline: true },
  ]
  legendX = windowWidth * (p1 - spacing) - btnWidth / 2;
  legendSize = width * 0.015;
  let legendHeightOffset = 0.045*height;
  let x = legendX + legendSize / 2;
  let y = y0 + legendSize / 2;
  legendShapes = [];
  for (let info of legend) {
    let shapePoints = calculateShapePoints(x, y, legendSize);
    let gradientPoints = calculateGradient(legendSize);
    let grainDots = calculateGrain(x, y, legendSize, shapePoints, 100, 40);
    // parametri x disegnare paesi nella legenda
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
  // parametri x visualizzazione No Data
  let noDataCount = yearData.getCountOfCountriesWithoutData(year);
  let noDataCols = 8;
  let noDataRows = Math.ceil(noDataCount / noDataCols);
  let noDataPadding = width * 0.0222;
  let nineOutOf10Row = map(9, 0, 10, y0, yAxes);
  let nineOutOf10RowWithoutNoDataText = nineOutOf10Row - noDataPadding - legendSize / 2;
  let noDataStartHeight = nineOutOf10RowWithoutNoDataText - noDataRows * (noDataPadding + legendSize) / 2
  noDataShapes = [];
  for (let i = 0; i < noDataCount; i++) {
    let x = legendX + legendSize / 2 + (i % noDataCols) * noDataPadding;
    let y = noDataStartHeight + Math.floor(i / noDataCols) * noDataPadding;
    let shapePoints = calculateShapePoints(x, y, legendSize);
    let gradientPoints = calculateGradient(legendSize);
    let grainDots = calculateGrain(x, y, legendSize, shapePoints, 100, 40);
    noDataShapes.push({
      x, y,
      d: legendSize,
      shapePoints: shapePoints,
      gradientPoints: gradientPoints,
      grainDots: grainDots,
    });
  }
}
// titolo principale
function drawTitle() {
  push();
  fill(baseColor);
  noStroke();
  textSize(0.027 * width);
  textAlign(CENTER, TOP);
  let title = "Cost and Unaffordability of a Healthy Diet";
  // pto finale asse x dipende da dimensione testo del titolo --> https://p5js.org/reference/p5/textWidth/ 
  titleWidth = textWidth(title)
  text(title, windowWidth / 2, height * 0.03);
  pop();
}
// calcolo parametri disegno "macchie" paesi nel grafico
function manageCountry() {
  // filtra i paesi per l'anno selezionato (year) tramite classe esterna in countryFilter.js
  yearData = new countryFilter(tableObj, minCohd, maxCohd, minNua, maxNua, x0, xAxes, y0, yAxes);
  countriesByYear = yearData.filterCountriesByYear(year);
  // gestione della sovrapposizione + definizione parametri macchie
  // reference: https://www.w3schools.com/js/js_array_sort.asp 
  countriesByYear.sort(function (a, b) { return b.d - a.d });
  for (let country of countriesByYear) {
    country.shapePoints = calculateShapePoints(country.x, country.y, country.d);
    country.gradientPoints = calculateGradient(country.d);
    country.grayScale = 100;
    country.alpha = 40;
    country.grainDots = calculateGrain(country.x, country.y, country.d, country.shapePoints, country.grayScale, country.alpha);
  }
}
function draw() {
  background(bgColor);
  textFont(font)
  drawTitle();
  drawAxes();
  drawLegend();
  //Threshold
  let fiveOutOf10 = map(5, 0, 10, y0, yAxes);
  let nineOutOf10 = map(9, 0, 10, y0, yAxes);
  // drawThreshold(total, colored, x0, y, size, label)
  drawThreshold(10, 5, x0, fiveOutOf10, 4.5, "5+ out of 10 people had\nno access to a healthy diet");
  drawThreshold(10, 9, x0, nineOutOf10, 4.5, "9+ out of 10 people had\nno access to a healthy diet");

  for (let country of countriesByYear) {
    drawGlyph(country.x, country.y, country.d, country.shapePoints, country.gradientPoints, country.grainDots, strokeIncomeColors[country.income - 1], incomeColors[country.income - 1][0], incomeColors[country.income - 1][1]);
  }
  glyphHover();
  if (selectedCountry) {
    drawFocus(selectedCountry);
  }
  let showButtons = selectedCountry == null && hoveringCountry == null;
  if (showButtons) {
    // bottoni filtro x anni nel grafico
    drawYearButtons(txtSize, btnWidth, btnHeight);
    // bottoni navigazione tra pagine html
    buttons.forEach(btn => btn.show());
  } else {
    buttons.forEach(btn => btn.hide());
  }
}
// disegno bottoni filtro anni
function drawYearButtons(txtSize, w, h) {
  bPadding = (titleWidth - (4 * w)) / 3;
  totalWidth = titleWidth;
  startX = windowWidth / 2 - (totalWidth / 2);
  yPadding = 25.5;
  yB = yAxes + yPadding;
  for (let i = 0; i < years.length; i++) {
    // bottone 
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
    // label bottone
    textSize(txtSize);
    noStroke();
    fill(isMouseOver || isSelected ? bgColor : baseColor);
    textAlign(CENTER, CENTER);
    text(years[i], w / 2, h / 2);
    pop();
  }
}
// disegno legenda
function drawLegend() {
  for (let entry of legendShapes) {
    fill(baseColor);
    textSize(txtSize);
    textAlign(LEFT, CENTER);
    // elemento grafico per mostrare dimensione "macchia"
    if (entry.outline) {
      stroke(baseColor);
      strokeWeight(1);
      let paddingY = 10;
      let r = entry.d / 2;
      let startX = entry.x - r;
      let endX = entry.x + r;
      let y = entry.y + r + paddingY;
      stroke(baseColor);
      line(startX, y, endX, y);
      line(startX, y - 5, startX, y + 5);
      line(endX, y - 5, endX, y + 5);
      noStroke();
      text(entry.label, entry.x + entry.d, entry.y + 8);
    } else {
      noStroke()
      text(entry.label, entry.x + entry.d, entry.y + 1);
    }
    // disegno "macchie" per mostrare colori associati al livello di income
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
  // disegno paesi No Data
  for (let entry of noDataShapes) {
    drawGlyph(
      entry.x,
      entry.y,
      entry.d,
      entry.shapePoints,
      entry.gradientPoints,
      entry.grainDots,
      noDataColor[2],
      noDataColor[0],
      noDataColor[1],
      entry.outline
    );
  }
  push()
  // scritta conteggio paesi No Data
  let nineOutOf10Row = map(9, 0, 10, y0, yAxes);
  fill(baseColor);
  textAlign(LEFT, BASELINE);
  textSize(txtSize);
  noStroke();
  text("No data for " + noDataShapes.length + " countries in " + year, legendX, nineOutOf10Row);
  pop()
}
// disegno assi 
function drawAxes() {
  stroke(baseColor);
  strokeWeight(0.5);
  line(x0, y0, xAxes, y0);
  // punta freccia asse x
  line(xAxes, y0, xAxes - 5, y0 - 5);
  line(xAxes, y0, xAxes - 5, y0 + 5);
  // punta freccia y
  line(x0, yAxes, x0 - 5, yAxes - 5);
  line(x0, yAxes, x0 + 5, yAxes - 5);
  // etichette / valori min e max assi 
  let axesLabelOffset = 0.008 * width;
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
// disegno "macchie"
function drawGlyph(x, y, d, shapePoints, gradientPoints, grainDots, strokeColor, startColor, endColor, outline) {
  noStroke();
  fill(1);
  push();
  strokeWeight(0.5);
  if (!strokeColor) {
    strokeColor = '#000000';
  }
  stroke(strokeColor);
  // il gradiente viene applicato a partire dalle coordinate specificate --> le coordinate di default 
  // secondo la libreria fillGradient coincidono con il centro della figura
  if (!outline) {
    gradientPoints.forEach(point => {
      fillGradient('radial', {
        from: [x + point.x, y + point.y, d / 15],
        to: [x + point.x, y + point.y, d / 1],
        steps: [startColor, endColor],
      });
    });
  } else {
    noFill();
    stroke(startColor);
  }
  // disegno della forma della "macchia"
  beginShape();
  for (let p of shapePoints) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
  pop();
  if (!outline) {
    // grana/texture ( vedi calculateGrain() )
    image(grainDots, x - d, y - d);
  }
}
// visualizzazione al mouse hover
// reference: https://editor.p5js.org/kjhollen/sketches/S1Jxxt-HW 
function glyphHover() {
  hoveringCountry = null;
  for (let i = countriesByYear.length - 1; i >= 0; i--) {
    let country = countriesByYear[i];
    if (isMouseInsideCountry(country)) {
      hoveringCountry = country;
      push();
      // tabella valori alpha: https://gist.github.com/lopspower/03fb1cc0ac9f32ef38f4 
      // hex alpha: 90% --> E6
      fill("#FFF2E4E6");
      rect(0, 0, width, height)
      pop();
      fill(152, 78, 78, 170)
      beginShape();
      for (let p of country.shapePoints) {
        vertex(p.x, p.y);
      }
      endShape(CLOSE);
      // testi info paese hover
      push();
      noStroke();
      fill(baseColor);
      textSize(0.027 * width);
      let interlinea = 0.013 * width;
      let hoverDxDistance = 0.053 * width;
      let textX = country.x + hoverDxDistance;
      // per evitare sovrapposizione con legenda disegna i testi info paese alla sx della "macchia" 
      // oltre il 50% della larghezza dello schermo 
      if (country.x > windowWidth * 0.5) {
        let hoverSxDistance = 0.140 * width;
        textX = country.x - hoverSxDistance;
      }
      text(country.name, textX, country.y - interlinea * 1.5);
      textSize(0.010 * width);
      let incomes = ["Low Income", "Lower Middle Income", "Upper Middle Income", "High Income"];
      text("COHD: " + country.cohd + " USD", textX, country.y + interlinea);
      text("PUA: " + country.pua + " %", textX, country.y + interlinea * 2);
      text("NUA: " + country.nua + " M", textX, country.y + interlinea * 3);
      text(incomes[country.income - 1], textX, country.y + interlinea * 4);
      pop();
      break
    }
  }
}
// gestione eventi al mousePressed()
// reference: https://p5js.org/reference/p5/mousePressed/
function mousePressed() {
  if (selectedCountry == null) {
    for (let i = countriesByYear.length - 1; i >= 0; i--) {
      let focusedCountry = countriesByYear[i];
      if (isMouseInsideCountry(focusedCountry)) {
        selectedCountry = focusedCountry;
        break;
      }
    }
  } else {
    // bottone per uscita dal focus 
    if ((mouseX > xClose) && (mouseX < xClose + sClose) && (mouseY > yClose) && (mouseY < yClose + sClose)) {
      selectedCountry = null;
    }
  }
  // bottoni filtro anni
  for (let i = 0; i < years.length; i++) {
    xB = startX + i * (btnWidth + bPadding);
    if (mouseX > xB && mouseX < xB + btnWidth && mouseY > yB && mouseY < yB + btnHeight) {
      year = years[i];
      setup();
      break;
    }
  }
}
// verifica posizione mouse per Hover
function isMouseInsideCountry(country) {
  return (
    (mouseX < country.x + country.d / 2) &&
    (mouseX > country.x - country.d / 2) &&
    (mouseY < country.y + country.d / 2) &&
    (mouseY > country.y - country.d / 2)
  );
}
// disegno visualizzazione di dettaglio (focus)
function drawFocus() {
  // sfondo opacizzato
  push();
  fill(bgColor);
  rect(0, 0, width, height);
  // disegno "macchia" di sfondo 
  drawGlyph(
    focusGlyphX,
    focusGlyphY,
    focusGlyphD,
    focusShapePoints,
    focusGradientPoints,
    focusGrainDots,
    "bgColor",
    incomeColors[selectedCountry.income - 1][0] + "50",
    incomeColors[selectedCountry.income - 1][1] + "50"
  );
  pop();
  // salvataggio dei dati del paese selezionato per ogni anno
  let focusedCountryData = yearData.focusData();

  //titolo paese del paese mostrato nel focus
  textSize(0.025 * width);
  noStroke();
  fill(baseColor);
  textAlign(CENTER, BASELINE);
  let countryBaseline = (10.5 * height) / 100;
  text(selectedCountry.name, width / 2, countryBaseline);

  // carico il risultato dato da drawSingleFocus() definita in countryFocus.js
  const focus = new countryFocus(focusedCountryData, minCohd, maxCohd, minPua, maxPua, width, height);
  focus.drawSingleFocus();

  let groupY = 170;
  let circleSize = 20;
  let spacing = (width / 4);
  let centerX = width / 2;
  let leftX = centerX - spacing;
  let middleX = centerX;
  let rightX = centerX + spacing;

  // disegno legenda focus 
  // legenda sx
  fill(incomeColors[selectedCountry.income - 1][0]);
  circle(leftX, groupY, circleSize);
  fill(baseColor);
  textSize(0.01 * width);
  textAlign(CENTER);
  text("Percentage of the population\nthat could afford a healthy diet", leftX, groupY + 40);
  // legenda centrale 
  fill(incomeColors[selectedCountry.income - 1][1]);
  circle(middleX, groupY, circleSize);
  fill(baseColor);
  text("Percentage of the population\nthat could not afford a healthy diet", middleX, groupY + 40);
  // legenda dx
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
  // testo in basso 
  textSize(0.012 * width);
  text("Number of people who did not have access to a healthy diet", width / 2, height - 100);

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
// disegno di omini (riempiti e vuoti) per soglie grafico
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
  y += size;
  // omini
  size = size / 1000 * width;
  let figureWidth = size * 1.7;
  let totalWidth = figureWidth * total;
  // posizione degli omini in modo che l'ultimo sia allineato con pto finale asse x
  let startX = xAxes - totalWidth;
  drawPeople(total, colored, startX, y, size);
  y += (size + 1) * 5;
  // testo
  noStroke();
  fill(baseColor);
  textSize(txtSize * 0.66);
  text(label, startX, y);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // ridefinisco i parametri anche quando windowResize() non solo quando si ricarica la pagina:
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

