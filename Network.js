function sigmoid(xValue) {
	if (xValue > 10) return 1.0;
	else if (xValue < -10) return 0.0;
	else return 1.0 / (1.0 + Math.exp(-xValue));
}

class Network {
	constructor(structure, genome) {
		// structure: array of int, each int representing one layer of the network
		this.theta = [];
		for (let i = 0; i < structure.length - 1; ++i) {
			this.theta.push(math.zeros(structure[i + 1], structure[i] + 1));
		}

		// genome: array of float, each float is a weight
		if (genome == undefined) return;
		for (let i = 0; i < this.theta.length; ++i) {
			let theta = [];
			const layerWeights = genome.splice(0, structure[i + 1] * (structure[i] + 1));
			for (let j = 0; j < structure[i + 1]; ++j) {
				theta.push(layerWeights.splice(0, structure[i] + 1));
			}
			// Create the matrix
			this.theta[i] = math.matrix(theta);
		}
	}

	predict(inputs) {
		let a = inputs;
		for (let layer of this.theta) {
			a = math.map(math.multiply(layer, math.concat([1], a)), sigmoid);
		}
		return a;
	}

	getWeights() {
		// Return an array of all weights and an array representing structure
		let weights = [];
		let structure = [];
		// Number of inputs
		structure.push(this.theta[0].size()[1] - 1);
		for (let layer of this.theta) {
			layer.forEach(function (value, index, matrix) {
				weights.push(value);
			});
			// Number of neurons in the next layer
			structure.push(layer.size()[0]);
		}
		return [weights, structure];
	}

	randomInit(minWeight, maxWeight) {
		for (let i = 0; i < this.theta.length; ++i) {
			this.theta[i] = this.theta[i].map((value, index, matrix) => {
				return Math.random() * (maxWeight - minWeight) + minWeight;
			});
		}
	}
}
