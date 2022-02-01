import { writeFileSync } from 'fs';

import serialize from 'serialize-javascript';

import { Genome } from '../neat/Genome';

export const persistPopulation = (generation: number, brains: Genome[]) => {
  let serializedGenomes = serialize(brains);
  serializedGenomes = '// GENERATION ' + generation + '\n' + serializedGenomes;
  writeFileSync(__dirname + './persisted/population.js', serializedGenomes);
};
