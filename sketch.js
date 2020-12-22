let cars = [];
let numCars = 10;
let trackLimits = [];

let viewX;
let viewY;
let translateX;
let translateY;

function setup() {
	createCanvas(1280, 720);

	viewX = 0;
	viewY = 0;
	translateX = 0;
	translateY = 0;

	//c = new Car(0, 150, 175);
	//c2 = new Car(0, 150, 175);
	for (let i = 0; i < numCars; i++) {
		cars.push(new Car(0, 150, 175));
	}

	trackLimits.push(new Boundary(1000, 125, 1000, 700)); // Outer right edge
	trackLimits.push(new Boundary(900, 275, 900, 550)); // Inner right edge
	trackLimits.push(new Boundary(100, 125, 1000, 125)); // Outer top edge
	trackLimits.push(new Boundary(250, 225, 850, 225)); // Inner top edge
	trackLimits.push(new Boundary(100, 125, 100, 700)); // Outer left edge
	trackLimits.push(new Boundary(200, 275, 200, 550)); // Inner left edge
	trackLimits.push(new Boundary(100, 700, 1000, 700)); // Outer bottom edge
	trackLimits.push(new Boundary(250, 600, 850, 600)); // Inner bottom edge
	trackLimits.push(new Boundary(200, 275, 250, 225)); // Top left corner
	trackLimits.push(new Boundary(200, 550, 250, 600)); // Bottom left corner
	trackLimits.push(new Boundary(850, 600, 900, 550)); // Bottom right corner
	trackLimits.push(new Boundary(850, 225, 900, 275)); // Top right corner
}

function draw() {
	background(230);
	viewX += translateX;
	viewY += translateY;
	translate(viewX, viewY);
	for (let wall of trackLimits) {
		wall.show();
	}

	// Something is very wrong with this code
	// let toRemove = [];
	for (let car of cars) {
		car.update(trackLimits);
		car.show();
		// if (car.crashed) {
		//   toRemove.push(car);
		// }
	}
	// for (let car of toRemove) {
	//   cars.pop(car);
	// }
}

function keyPressed() {
	switch (key) {
		case 'a':
			translateX += 10;
			break;
		case 'd':
			translateX -= 10;
			break;
		case 'w':
			translateY += 10;
			break;
		case 's':
			translateY -= 10;
			break;
		case ' ':
			cars = [];
			for (let i = 0; i < numCars; i++) {
				cars.push(new Car(0, 150, 175));
			}
			viewX = 0;
			viewY = 0;
			break;
	}
}

function keyReleased() {
	switch (key) {
		case 'a':
			translateX -= 10;
			break;
		case 'd':
			translateX += 10;
			break;
		case 'w':
			translateY -= 10;
			break;
		case 's':
			translateY += 10;
			break;
	}
}

// CONTROL CARS
/*
function keyPressed() {
  if (key == 'w') {
    c.throttle = 1;
  }
  if (key == 'a') {
    c.steering -= 1;
  }
  if (key == 'd') {
    c.steering += 1;
  }
}

function keyReleased() {
  if (key == 'w') {
    c.throttle = 0;
  }
  if (key == 'a') {
    c.steering += 1;
  }
  if (key == 'd') {
    c.steering -= 1;
  }
}
*/
