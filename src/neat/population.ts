import { logger } from '../logger/logger';
import { Player } from '../player/player';
import { Round } from '../round/round';

export class Population {
  size = 1000; //must be even
  population: Player[] = [];
  totalFitness = 0;
  generation = 0;
  bestPlayerInGen: Player;
  bestPlayerSoFar: Player;
  avgFitness = 0;

  constructor() {
    for (let i = 0; i < this.size; i++) {
      this.population.push(Player.randomPlayer(this.generation, i));
    }
  }

  private randomSelection() {
    let random = Math.random() * this.totalFitness - 0.000001;
    for (let i = 0; i < this.population.length; i++) {
      if (random < this.population[i].fitness) {
        return this.population[i];
      }
      random -= this.population[i].fitness;
    }
    logger.critical('Random', random, this.totalFitness);
    return null;
  }

  async evolve() {
    // play round
    logger.info('Generation: ' + this.generation);
    for (let i = 0; i < this.size; i += 2) {
      const round = new Round([this.population[i], this.population[i + 1]]);
      round.play();
    }

    // select best by random selection
    this.totalFitness = 0;
    this.avgFitness = 0;
    this.bestPlayerInGen = this.population[0];
    for (let i = 0; i < this.size; i++) {
      this.population[i].calculateFitness();
      this.totalFitness += this.population[i].fitness;
      if (this.population[i].fitness > this.bestPlayerInGen.fitness) {
        this.bestPlayerInGen = this.population[i];
      }
    }
    this.avgFitness = this.totalFitness / this.size;

    //ceate new population
    const newPopulation: Player[] = [];
    for (let i = 0; i < this.size; i++) {
      let parent1 = this.randomSelection();
      let parent2 = this.randomSelection();
      if (parent1.fitness < parent2.fitness) {
        [parent1, parent2] = [parent2, parent1];
      }
      const child = parent1.crossover(parent2, i);
      child.mutate();
      newPopulation.push(child);
    }

    //replace old population with new population
    this.population = newPopulation;

    //print best player so far
    if (
      !this.bestPlayerSoFar ||
      this.bestPlayerInGen.fitness > this.bestPlayerSoFar.fitness
    ) {
      this.bestPlayerSoFar = this.bestPlayerInGen;
    }

    // log stats
    logger.info('Generation stats: ', {
      gen: this.generation,
      turns: this.bestPlayerInGen.turns,
      bestFitness: this.bestPlayerInGen.fitness,
      avgFitness: this.avgFitness,
      nodes: this.bestPlayerInGen.brain.nodes.length,
      genes: this.bestPlayerInGen.brain.connections.length,
    });
    logger.info('Best player so far: ', {
      turns: this.bestPlayerSoFar.turns,
      gen: this.bestPlayerSoFar.generation,
      fitness: this.bestPlayerSoFar.fitness,
      nodes: this.bestPlayerSoFar.brain.nodes.length,
      genes: this.bestPlayerSoFar.brain.connections.length,
    });
    logger.log('Best player in generation: ', {
      turns: this.bestPlayerInGen.turns,
      gen: this.bestPlayerInGen.generation,
      cards: this.bestPlayerInGen.cards,
      initialCards: this.bestPlayerInGen.initialCards,
    });

    this.generation++;
  }
}
