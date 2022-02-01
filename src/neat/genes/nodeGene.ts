import { ConnectionGene } from './ConnectionGene';
import { Gene } from './gene';

export class NodeGene extends Gene {
  outConnections: ConnectionGene[] = [];
  layer: number;

  constructor(id: number, layer: number) {
    super(id);
    this.layer = layer;
  }

  private sigmod(x: number) {
    return 1 / (1 + Math.exp(-x));
  }

  addOuptut(connection: ConnectionGene) {
    this.outConnections.push(connection);
  }

  feedForward() {
    this.output = this.layer === 0 ? this.sigmod(this.input) : this.input;
    this.outConnections.forEach((connection) => {
      connection.input = this.output;
    });
  }

  getLayer(): number {
    return this.layer;
  }

  clone() {
    return new NodeGene(this.id, this.layer);
  }
}
