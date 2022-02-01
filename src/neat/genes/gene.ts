export const MAX_NODES_ASSUMPTION = 1000;

export abstract class Gene {
  id: number;
  input = 0;
  output = 0;

  abstract getLayer(): number;
  abstract feedForward(): void;

  constructor(id: number) {
    this.id = id;
  }
}
