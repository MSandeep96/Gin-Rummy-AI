import { logger } from '../logger/logger';

import { ConnectionGene } from './genes/ConnectionGene';
import { NodeGene } from './genes/NodeGene';
import { Gene, MAX_NODES_ASSUMPTION } from './genes/gene';

export class Genome {
  inputs = 0;
  outputs = 0;

  nodes: NodeGene[] = [];
  connections: ConnectionGene[] = [];
  innovationHistory: Map<number, Gene> = new Map();
  layers = 2;

  constructor(inputs: number, outputs: number) {
    this.inputs = inputs;
    this.outputs = outputs;
  }

  static getRandom(inputs: number, outputs: number) {
    const genome = new Genome(inputs, outputs);
    genome.initialize();
    genome.mutate();
    return genome;
  }

  private initialize() {
    for (let i = 0; i < this.inputs + this.outputs; i++) {
      const node = new NodeGene(i, i < this.inputs ? 0 : 1);
      this.addNode(node);
    }
    for (let i = 0; i < 5; i++) {
      this.newConnection();
    }
  }

  private addNode(node: NodeGene) {
    this.nodes.push(node);
    this.innovationHistory.set(node.id, node);
  }

  private addConnection(connection: ConnectionGene) {
    this.connections.push(connection);
    this.innovationHistory.set(connection.id, connection);
  }

  evaluate(inputs: number[]): number[] {
    for (let i = 0; i < this.inputs; i++) {
      this.nodes[i].input = inputs[i];
    }
    const genes: Gene[] = [...this.nodes, ...this.connections];
    genes.sort((a, b) => a.getLayer() - b.getLayer());
    genes.forEach((gene) => gene.feedForward());
    return this.nodes
      .slice(this.inputs, this.inputs + this.outputs)
      .map((node) => node.output);
  }

  //assuming parent1 is better than parent2
  crossover(parent2: Genome) {
    const childGenome = new Genome(this.inputs, this.outputs);
    childGenome.layers = this.layers;
    const childGenes: ConnectionGene[] = [];
    const childGeneIsEnabled: boolean[] = [];

    for (let i = 0; i < this.connections.length; i++) {
      let isEnabled = true;
      const sameGeneInParent2 = parent2.innovationHistory.get(
        this.connections[i].id
      ) as ConnectionGene;
      if (sameGeneInParent2) {
        if (
          !this.connections[i].enabled ||
          !(sameGeneInParent2 as ConnectionGene).enabled
        ) {
          if (Math.random() < 0.75) isEnabled = false;
        }
        if (Math.random() < 0.5) {
          childGenes.push(this.connections[i]);
        } else {
          childGenes.push(sameGeneInParent2);
        }
      } else {
        childGenes.push(this.connections[i]);
        isEnabled = this.connections[i].enabled;
      }
      childGeneIsEnabled.push(isEnabled);
    }

    for (let i = 0; i < this.nodes.length; i++) {
      childGenome.addNode(this.nodes[i].clone());
    }
    for (let i = 0; i < childGenes.length; i++) {
      const fromNode = childGenome.innovationHistory.get(
        childGenes[i].fromNode.id
      ) as NodeGene;
      const toNode = childGenome.innovationHistory.get(
        childGenes[i].toNode.id
      ) as NodeGene;
      childGenome.connections.push(
        childGenes[i].clone(fromNode, toNode, childGeneIsEnabled[i])
      );
    }
    return childGenome;
  }

  mutate() {
    if (this.connections.length === 0) {
      logger.log('No connections. Adding new connection');
      this.newConnection();
    }
    if (Math.random() < 0.8) {
      logger.log('Mutating connection');
      this.connections.forEach((connection) => connection.mutateWeight());
    }
    if (Math.random() < 0.04) {
      logger.log('Adding new connection');
      this.newConnection();
    }
    if (Math.random() < 0.01) {
      logger.log('Adding new node');
      this.newNode();
    }
  }

  //--------------------------ADD NODE----------------------------------------
  newNode() {
    if (this.connections.length === 0) {
      this.newConnection();
      return;
    }

    //find a connection to split
    const connection =
      this.connections[Math.floor(Math.random() * this.connections.length)];
    connection.enabled = false;

    //create new node
    const newNode = new NodeGene(this.nodes.length, connection.getLayer() + 1);
    this.nodes.push(newNode);
    this.innovationHistory.set(newNode.id, newNode);

    //create new connection
    const newConnectionToNewNode = new ConnectionGene(
      connection.fromNode,
      newNode,
      1
    );
    const newConnectionFromNewNode = new ConnectionGene(
      newNode,
      connection.toNode,
      connection.weight
    );
    this.addConnection(newConnectionToNewNode);
    this.addConnection(newConnectionFromNewNode);

    if (newNode.layer === connection.toNode.layer) {
      for (let i = 0; i < this.nodes.length - 1; i++) {
        if (this.nodes[i].layer >= newNode.layer) {
          this.nodes[i].layer++;
        }
      }
      this.layers++;
    }
  }
  //--------------------------------------------------------------------------

  //--------------------------ADD CONNECTION----------------------------------
  newConnection() {
    //check if fully connected
    if (this.isfullyConnected()) {
      return;
    }

    const [fromNode, toNode] = this.getTwoNodesFromDifferentLayers();
    //create new connection
    const connection = new ConnectionGene(fromNode, toNode, fromNode.layer);
    this.addConnection(connection);
  }

  private getTwoNodesFromDifferentLayers() {
    // find two nodes that are not in the same layer and are not already connected
    let fromNode, toNode;
    do {
      fromNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      toNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
      if (fromNode.id > toNode.id) [fromNode, toNode] = [toNode, fromNode];
    } while (
      fromNode.layer === toNode.layer ||
      this.innovationHistory.has(fromNode.id * MAX_NODES_ASSUMPTION + toNode.id)
    );

    return [fromNode, toNode];
  }

  private isfullyConnected(): boolean {
    let maxConnections = 0;
    const nodesInLayers = new Array(this.layers).fill(0);

    for (let i = 0; i < this.nodes.length; i++) {
      nodesInLayers[this.nodes[i].layer] += 1;
    }

    // connections from x layer is product of
    // sum of all nodes in layers x+1 & nodes in layer x
    for (let i = 0; i < this.layers - 1; i++) {
      let nodesInFront = 0;
      for (let j = i + 1; j < this.layers; j++) {
        nodesInFront += nodesInLayers[j];
      }
      maxConnections += nodesInLayers[i] * nodesInFront;
    }

    return maxConnections === this.connections.length;
  }
  //--------------------------------------------------------------------------
}
