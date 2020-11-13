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

class GeneticAlgorithm {
  constructor(population) {
    this.population = population;
    this.size = population.length;
  }

  evolve(selected) {
    newPopulation = selected;
    for (let i = selected.length; i < this.size; i++) {
      newGenome = newPopulation.push(newGenome); // Crossover and mutation here
    }
  }
}
