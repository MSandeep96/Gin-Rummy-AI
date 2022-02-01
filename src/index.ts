import { logger } from './logger/logger';
import { Population } from './neat/population';

(async function () {
  logger.info('Starting NN');
  console.log(Date.now());
  const population = new Population();
  for (let i = 0; i < 2000000; i++) {
    console.log(i);
    await population.evolve();
  }
  console.log(Date.now());
})();
