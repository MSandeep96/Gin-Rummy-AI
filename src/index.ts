import { writeFileSync } from 'fs';

import { logger } from './logger/logger';
import { Population } from './neat/population';

logger.info('Starting NN');
const before = Date.now();
const population = new Population();
for (let i = 0; i < 50000; i++) {
  console.log(i);
  population.evolve();
}
const after = Date.now();
console.log(`Finished in ${(after - before) / 1000} seconds`);

// serialize the population
const json = population.toJson();
writeFileSync('./population.json', JSON.stringify(json, null, 2));
