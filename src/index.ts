import { writeFileSync } from 'fs';

import { logger } from './logger/logger';
import { Population } from './neat/population';

(async function () {
  logger.info('Starting NN');
  const before = Date.now();
  const population = new Population();
  for (let i = 0; i < 5000; i++) {
    console.log(i);
    await population.evolve();
  }
  const after = Date.now();
  console.log(`Finished in ${(after - before) / 1000} seconds`);

  // serialize the population
  const json = population.toJson();
  writeFileSync('./population.json', JSON.stringify(json, null, 2));
})();
