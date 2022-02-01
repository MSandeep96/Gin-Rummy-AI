import { Genome } from './genome';

describe('genome', () => {
  it('must have atleast 5 connections', () => {
    const genome = Genome.getRandom(14, 5);
    expect(genome.connections.length).toBeGreaterThanOrEqual(5);
  });

  it('must have atleast 19 nodes', () => {
    const genome = Genome.getRandom(14, 5);
    expect(genome.nodes.length).toBeGreaterThanOrEqual(19);
  });

  it('should crossover to have the same number of genes', () => {
    const genome1 = Genome.getRandom(14, 5);
    const genome2 = Genome.getRandom(14, 5);
    const child = genome1.crossover(genome2);
    expect(child.connections.length).toEqual(genome1.connections.length);
  });

  it('should add a new node', () => {
    const genome = Genome.getRandom(14, 5);
    genome.newNode();
    expect(genome.nodes.length).toBeGreaterThanOrEqual(20);
  });
});
