import { clamp } from 'lodash';

import { randomGaussian } from '../../utils/randomGaussian';

import { NodeGene } from './NodeGene';
import { Gene, MAX_NODES_ASSUMPTION } from './gene';

export class ConnectionGene extends Gene {
  weight = 0;
  fromNode: NodeGene;
  toNode: NodeGene;
  enabled = true;

  constructor(
    fromNode: NodeGene,
    toNode: NodeGene,
    weight: number = Math.random() * 2 - 1
  ) {
    super(fromNode.id * MAX_NODES_ASSUMPTION + toNode.id);
    this.fromNode = fromNode;
    this.toNode = toNode;
    this.weight = weight;
    this.fromNode.addOuptut(this);
  }

  mutateWeight() {
    if (Math.random() < 0.1) {
      this.weight = Math.random() * 2 - 1;
    } else {
      this.weight += randomGaussian() * 0.1;
      this.weight = clamp(this.weight, -1, 1);
    }
  }

  feedForward() {
    if (this.enabled) this.toNode.input += this.input * this.weight;
  }

  getLayer(): number {
    return this.fromNode.getLayer();
  }

  clone(fromNode, toNode, isEnabled): ConnectionGene {
    const clone = new ConnectionGene(fromNode, toNode, this.weight);
    clone.enabled = isEnabled;
    return clone;
  }
}
