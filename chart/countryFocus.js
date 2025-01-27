class countryFocus {
	constructor(countryData, minCohd, maxCohd, minPua, maxPua, width, height) {
		this.countryData = countryData;
		this.minCohd = minCohd;
		this.maxCohd = maxCohd;
		this.minPua = minPua;
		this.maxPua = maxPua;
		this.width = width;
		this.height = height;
	}

	setLineDash(list) {
		drawingContext.setLineDash(list);
	}

	// cerchio sotto scuro
	// cerchio trasparente - pua (map)
	// cerchio solo contorno fuori --> map sul cohd (dashed)
	// testi prendendo i dati dal dataset
	// diascalia ugale per tutti

	drawSingleFocus() {
		let spacing = 0.2 * this.width;
		let totalWidth = (this.countryData.length - 1) * spacing; // Total width of all elements
		let pX = (this.width - totalWidth) / 2; // Center position
		let pY = 0.45 * this.height + 50;
		let diameter = 0.12 * this.width;
		let t2Distance = 0.1 * this.width;
		let t3Distance = 0.15 * this.width;

		let timelineY;

		push();
		translate(pX, pY);

		for (let i = 0; i < this.countryData.length; i++) {
			let country = this.countryData[i];

			let puaCircle = map(country.pua, 0, 100, 0, TWO_PI);
			let cohdSliderPercent = map(country.cohd, 0, this.maxCohd, 0, 1);
			let incomeIndex = country.income - 1;
			
			if (Number(country.pua) !== 0 && Number(country.nua) !== 0) {
				push();
				rotate(-HALF_PI);

				noStroke();
				fill(incomeColors[incomeIndex][0]);
				circle(0, 0, diameter);

				fill(puaColor);
				fill(incomeColors[incomeIndex][1]);
				arc(0, 0, diameter, diameter, 0, puaCircle);
				pop();

				push();
				textSize(0.015 * this.width);
				textAlign(CENTER, CENTER);
				fill(baseColor);
				text(country.pua + " %", 0, diameter / 2 + 20);
				pop();

				push();
				fill(baseColor);
				textSize(0.015 * this.width);
				text(country.nua + " M", 0, t3Distance + 10);
				pop();
			} else {
				push();
				noStroke();
				fill(noDataColor[1]);
				circle(0, 0, diameter);

				fill(baseColor);
				textSize(0.017 * this.width);
				text("No data", 0, t3Distance + 10);
				pop();
			}

			let barHeight = 5;
			let barWidth = diameter;
			let barX = -barWidth / 2; 
			let barY = -(diameter / 2 + 20 + barHeight / 2);

			if(Number(country.cohd)) {
				push();

				push();
				textAlign(CENTER, BOTTOM);
				textSize(0.01 * this.width);
				fill(baseColor);
				text(country.cohd + " USD", barX + barWidth / 2, barY - 10);
				pop();

				fill(incomeColors[incomeIndex][0]);
				rect(barX, barY, barWidth, barHeight, barHeight / 2);
				fill(incomeColors[incomeIndex][1]);
				rect(barX, barY, barWidth * cohdSliderPercent, barHeight, barHeight / 2);
				pop();
			} else {
				push();

				push();
				textAlign(CENTER, BOTTOM);
				textSize(0.01 * this.width);
				fill(baseColor);
				text("No data", barX + barWidth / 2, barY - 10);
				pop();

				fill(noDataColor[1]);
				rect(barX, barY, barWidth, barHeight, barHeight / 2);
				pop();
			}

			fill(baseColor);
			textAlign(CENTER, BASELINE);

			push();
			textSize(0.015 * this.width);
			text(country.year, 0, t2Distance + 20);
			pop();

			push();
			stroke(baseColor);
			strokeWeight(1);
			let offset = 8;
			let lineYStart = t2Distance + (t3Distance - t2Distance) / 3 + offset;
			let lineYEnd = t3Distance - (t3Distance - t2Distance) / 3 + offset;
			line(0, lineYStart, 0, lineYEnd);

			let isLast = i === this.countryData.length - 1;

			// linea del tempo tra 2 cerchi
			if (isLast) {
				// punta linea del tempo 
				let arrowLength = 50;
				line(0, (lineYStart + lineYEnd) / 2, arrowLength, (lineYStart + lineYEnd) / 2);
				line(arrowLength, (lineYStart + lineYEnd) / 2, arrowLength - 10, (lineYStart + lineYEnd) / 2 - 10);
				line(arrowLength, (lineYStart + lineYEnd) / 2, arrowLength - 10, (lineYStart + lineYEnd) / 2 + 10);
			} else {
				line(0, (lineYStart + lineYEnd) / 2, spacing, (lineYStart + lineYEnd) / 2);
			}

			pop();

			timelineY = (lineYEnd + lineYStart) / 2;

			translate(spacing, 0);
		}

		
		
		pop();
	}
}
