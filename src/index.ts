import { logger } from './logger/logger';
import { Population } from './neat/population';

(async function () {
  logger.info('Starting NN');
  const before = Date.now();
  const population = new Population();
  for (let i = 0; i < 600; i++) {
    console.log(i);
    await population.evolve();
  }
  const after = Date.now();
  console.log(`Finished in ${(after - before) / 1000} seconds`);
})();
