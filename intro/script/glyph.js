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

function stain(p, centerX, centerY, radius, innerColor, outerColor) {
	let pointsShape = [];
	let noiseScale = 0.25;
	// NOISE per creare punti della forma del paese
	for (let angle = 0; angle < p.TWO_PI; angle += 0.1) {
		let dx = p.cos(angle) * radius;
		let dy = p.sin(angle) * radius;
		// aggiungo una randomicità ai valori dati a noise per far si che le macchie non siano speculari rispetto all'asse y
		let noiseFactor = p.map(p.noise(dx * noiseScale + p.random(-1, 1), dy * noiseScale + p.random(-1, 1)), 0, 1, 1, 1.05);
		pointsShape.push({
			x: centerX + dx * noiseFactor,
			y: centerY + dy * noiseFactor
		});
	}

	// GRADIENTE
	let gradientPoints = [];
	let gradientX = p.random(-radius, radius);
	let gradientY = p.random(-radius, radius);

	gradientPoints.push({
		x: gradientX,
		y: gradientY
	})

	for (let point of gradientPoints) {
		// il gradiente viene applicato a partire dalle coordinate specificate 
		// le coordinat3e di default sono il centro della figura
		p.fillGradient('radial', {
			from: [centerX + point.x, centerY + point.y, radius / 20], // x, y, radius
			to: [centerX + point.x, centerY + point.y, (radius * 2) / 1.5], // x, y, radius
			steps: [
				innerColor,
				outerColor,
			]
		});
	}

	p.beginShape();
	for (let pt of pointsShape) {
		p.vertex(pt.x, pt.y);
	}
	p.endShape(p.CLOSE);

	// GRANA
	const topLeftX = centerX - radius * 2;
	const topLeftY = centerY - radius * 2;
	const size = Math.ceil(radius * 2);

	let pg = p.createGraphics(size * 2, size * 2);
	pg.pixelDensity(1);
	pg.loadPixels();

	for (let _y = 0; _y < size * 2; _y += 1) {
		for (let _x = 0; _x < size * 2; _x += 1) {
			// algoritmo che verifica se il punto è interno alla forma
			// uso del "Ray casting algorithm" per verificare che i punti della texture siano generati solo all'interno del paese
			// reference: https://en.wikipedia.org/wiki/Point_in_polygon 
			if (!isPointInsideShape(pointsShape, topLeftX + _x, topLeftY + _y)) {
				continue;
			}

			let i = (_x + _y * size * 2) * 4;

			// grigio (0-255)
			let value = p.random(110);
			pg.pixels[i] = value;
			pg.pixels[i + 1] = value;
			pg.pixels[i + 2] = value;

			// trasparenza (alpha) (0-255)
			pg.pixels[i + 3] = 50;
		}
	}
	pg.updatePixels();

	//disegnare la forma del paese (macchia)
	p.beginShape();
	for (let pt of pointsShape) {
		p.vertex(pt.x, pt.y);
	}
	p.endShape(p.CLOSE);

	p.image(pg, centerX - (radius * 2), centerY - (radius * 2));
}