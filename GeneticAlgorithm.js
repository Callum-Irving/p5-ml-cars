/*
Genetic algorithm:
  Select highest fitness (approx. 3 cars)
  Fill rest of array by crossover and mutation
  Value Encoding:
    Crossover: Single point crossover
    Mutation: Add or subtract a small value
https://courses.cs.washington.edu/courses/cse473/06sp/GeneticAlgDemo/encoding.html

Pseudocode:

Select cars with highest fitness
For i in range(total cars - number of selected cars):
  Randomly select two of the high-fitness cars
  Create new car by single point crossover
  Mutate new car slightly by adding or subracting from weights
*/

/*

  To determine fitness, set one checkpoint
  Every time the car hits the checkpoint, set the next checkpoint

*/

// function mutateFrom(selectedGenomes, maxMutationSize, mutationChance) {
// 	// Get 2 random genomes
// 	const [firstWeights, structure] = selectedGenomes[
// 		Math.floor(Math.random() * selectedGenomes.length)
// 	].getWeights();
// 	const [secondWeights] = selectedGenomes[
// 		Math.floor(Math.random() * selectedGenomes.length)
// 	].getWeights();
// 	const splitLocation = Math.floor(
// 		Math.random() * otherGenome.getWeights[0].length
// 	);
// 	// Combine both genomes' weights (crossover)
// 	const newWeights = [].concat(
// 		firstWeights.slice(0, splitLocation),
// 		secondWeights.slice(splitLocation, secondWeights.length)
// 	);
// 	// Slightly change values (mutation)
// 	newWeights.forEach((item, index, array) => {
// 		if (Math.random() <= mutationChance) {
// 			return;
// 		}
// 		const size =
// 			Math.random() * maxMutationSize * (Math.random() < 0.5 ? 1 : -1);
// 		array[index] += size;
// 	});
// 	// Generate and return car from genome
// 	const newGenome = [newWeights, structure];
// 	const newCar = new Car(0, 0, 0, newGenome);
// 	return newCar;
// }

class GeneticAlgorithm {
	constructor(numCars, startX, startY, startAngle) {
		this.startX = startX;
		this.startY = startY;
		this.startAngle = startAngle;
		this.population = [];
		this.size = numCars;
		for (let i = 0; i < numCars; i++) {
			this.population.push(new Car(startAngle, startX, startY));
		}
		this.selectedCars = [];
	}

	toggleSelected(car) {
		if (this.selectedCars.includes(car)) {
			const index = this.selectedCars.indexOf(car);
			this.selectedCars.splice(index, 1);
		} else {
			this.selectedCars.push(car);
		}
	}

	// selectCar(car) {
	// 	if (this.selectedCars.includes(car)) return;
	// 	this.selectedCars.push(car);
	// }

	// unselectCar(car) {
	// 	if (!this.selectedCars.includes(car)) return;
	// 	const index = this.selectedCars.indexOf(car);
	// 	this.selectedCars.splice(index, 1);
	// }

	runIteration(walls) {
		for (let car of this.population) {
			car.update(walls);
			car.show();
			// If car is selected, draw circle at its center
			if (this.selectedCars.includes(car))
				ellipse(car.position.x, car.position.y, 20);
		}
	}

	evolve() {
		// Copy this.selectedCars instead of assigning a reference
		let newPopulation = [];
		newPopulation = this.selectedCars.map((x) => {
			return x;
		});
		console.log(newPopulation.length);
		for (let car of newPopulation) {
			car.isCrashed = false;
			car.position.x = this.startX;
			car.position.y = this.startY;
			car.angle = this.startAngle;
		}
		for (let i = this.selectedCars.length; i < this.size; i++) {
			let newCar;
			if (this.selectedCars.length != 0) {
				newCar = this.mutateFrom(this.selectedCars, 0, 0.0);
			} else {
				newCar = new Car(this.startAngle, this.startX, this.startY);
			}
			newPopulation.push(newCar);
		}
		this.population = newPopulation;
		this.selectedCars = [];
	}

	mutateFrom(selectedGenomes, maxMutationSize, mutationChance) {
		// Get 2 random genomes
		const firstGenome = selectedGenomes[
			Math.floor(Math.random() * selectedGenomes.length)
		].getGenome();
		const firstWeights = firstGenome.weights;
		const structure = firstGenome.structure;

		const secondWeights = selectedGenomes[
			Math.floor(Math.random() * selectedGenomes.length)
		].getGenome().weights;
		// const secondWeights = secondGenome.weights;

		const splitLocation = Math.floor(Math.random() * secondWeights.length);
		// Combine both genomes' weights (crossover)
		const newWeights = [].concat(
			firstWeights.slice(0, splitLocation),
			secondWeights.slice(splitLocation, secondWeights.length)
		);
		// Slightly change values (mutation)
		newWeights.forEach((item, index, array) => {
			if (Math.random() < mutationChance) {
				return;
			}
			const size =
				Math.random() *
				maxMutationSize *
				(Math.random() < 0.5 ? 1 : -1);
			array[index] += size;
		});
		// Generate and return car from genome
		const newGenome = { weights: newWeights, structure: structure };
		const newCar = new Car(
			this.startAngle,
			this.startX,
			this.startY,
			newGenome
		);
		return newCar;
	}
}
