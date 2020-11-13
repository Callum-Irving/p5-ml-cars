function sigmoid(xValue) {
  if (xValue > 10) return 1.0;
  else if (xValue < -10) return 0.0;
  else return 1.0 / (1.0 + Math.exp(-xValue));
}

class Network {
  constructor(structure) {
    // structure: array of int, each int representing one layer of the network
    this.theta = [];
    for (let i = 0; i < structure.length - 1; ++i) {
      this.theta.push(math.zeros(structure[i + 1], structure[i] + 1));
    }
  }

  predict(inputs) {
    let a = inputs;
    for (let layer of this.theta) {
      a = math.map(math.multiply(layer, math.concat([1], a)), sigmoid);
    }
    return a;
  }

  randomInit(minWeight, maxWeight) {
    for (let i = 0; i < this.theta.length; ++i) {
      this.theta[i] = this.theta[i].map((value, index, matrix) => {
        return Math.random() * (maxWeight - minWeight) + minWeight;
      });
    }
  }
}
