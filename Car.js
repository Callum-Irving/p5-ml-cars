class Car {
	constructor(angle, x, y, genome) {
		this.steering = 0; // FOR MANUAL CONTROL ONLY
		this.throttle = 0;
		this.angle = angle;

		this.position = new p5.Vector();
		this.position.x = x;
		this.position.y = y;

		// Corners of collider for collsiions
		// 0 - Upper right angle = a + tan-1(height/2 / width/2)
		// 1 - Lower right
		// 2 - Upper left
		// 3 - Lower left
		// Using center x and y and angle
		this.cornerAngles = [
			Math.atan(20 / 45),
			-Math.atan(20 / 45),
			-Math.atan(20 / 37) + radians(180),
			Math.atan(20 / 37) + radians(180),
		];
		this.corners = [
			p5.Vector.fromAngle(radians(this.angle) - this.cornerAngles[0]),
			p5.Vector.fromAngle(radians(this.angle) - this.cornerAngles[1]),
			p5.Vector.fromAngle(radians(this.angle) - this.cornerAngles[2]),
			p5.Vector.fromAngle(radians(this.angle) - this.cornerAngles[3]),
		];
		for (let corner of this.corners.slice(0, 2)) {
			corner.setMag(sqrt(45 ** 2 + 20 ** 2));
		}
		for (let corner of this.corners.slice(2, 4)) {
			corner.setMag(sqrt(37 ** 2 + 20 ** 2));
		}
		////////////////////////

		this.speed = 0;
		this.velocity = new p5.Vector();

		this.rays = [];
		for (let a = -90; a <= 90; a += 45) {
			this.rays.push(new Ray(this.position, a));
		}

		// CREATION OF THE NEURAL NETWORK
		if (genome != undefined) {
			// Create from genome
			this.net = new Network(genome.structure, genome.weights);
		} else {
			let structure = [7, 7, 5, 2];
			this.net = new Network(structure);
			this.net.randomInit(-100, 100);
		}

		this.crashed = false;
	}

	getDistances(walls) {
		push();
		stroke(0, 255, 255);
		let outputs = [];
		for (let ray of this.rays) {
			let closest = null;
			let record = Infinity;
			for (let wall of walls) {
				const pt = ray.castPoint(wall);
				if (pt) {
					const distance = p5.Vector.dist(this.position, pt);
					if (distance < record) {
						record = distance;
						closest = pt;
					}
				}
			}

			if (closest) {
				line(this.position.x, this.position.y, closest.x, closest.y);
				outputs.push(record);
			} else {
				outputs.push(0);
			}
		}

		pop();
		return outputs;
	}

	update(walls) {
		// Check for collision with barrier

		if (!this.crashed) {
			for (let i = 0; i < this.rays.length; i++) {
				this.rays[i].pos = this.position;
				this.rays[i].setDirection(this.angle + (i - 2) * 45);
			}

			let inputs = this.getDistances(walls);
			inputs.push(this.velocity.x);
			inputs.push(this.velocity.y);

			let outputs = this.net.predict(inputs);

			this.speed = outputs.get([1]) * 5;
			if (this.speed != 0) {
				// Rotate entire car
				this.angle += outputs.get([0]) * 2 - 1;

				// Rotate corners
				for (let corner of this.corners) {
					corner.rotate(radians(outputs.get([0]) * 2 - 1));
				}
			}

			// this.speed = this.throttle * 5;
			// this.angle += this.steering;

			this.velocity = p5.Vector.fromAngle(radians(this.angle));
			this.velocity.setMag(this.speed);
			this.position.add(this.velocity);

			// Check collisions
			for (let wall of walls) {
				for (let i = 0; i < this.corners.length; i++) {
					const next = (i + 1) % 4;
					if (
						collideLineLine(
							wall.a.x,
							wall.a.y,
							wall.b.x,
							wall.b.y,
							this.position.x + this.corners[i].x,
							this.position.y + this.corners[i].y,
							this.position.x + this.corners[next].x,
							this.position.y + this.corners[next].y
						)
					) {
						this.crashed = true;
					}
				}
			}
		}
	}

	getGenome() {
		// Return a serialized version of network's weights
		const genome = this.net.getWeights();
		return { weights: genome[0], structure: genome[1] };
	}

	show() {
		push();
		rectMode(CENTER);
		stroke(0);
		translate(this.position.x, this.position.y);
		rotate(radians(this.angle));
		fill(0);
		rect(20, 15, 14, 10);
		rect(20, -15, 14, 10);
		fill(255, 100, 0);
		stroke(255, 100, 0);
		rect(30, 0, 20, 10);
		rect(-5, 0, 50, 28);
		fill(0);
		stroke(0);
		rect(-20, 15, 14, 10);
		rect(-20, -15, 14, 10);
		fill(255, 100, 0);
		stroke(255, 100, 0);
		rect(25, 0, 10, 20);
		stroke(0);
		rect(40, 0, 10, 40); // Front wing
		rect(-30, 0, 14, 30); // Rear wing
		fill(0);
		rect(0, 0, 20, 10);
		fill(0, 50, 220);
		ellipse(-5, 0, 10);
		pop();
	}
}
