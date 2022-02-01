import { Genome } from '../neat/Genome';
import { ConnectionGene } from '../neat/genes/ConnectionGene';
import { NodeGene } from '../neat/genes/NodeGene';
import { Player } from '../player/player';

import { Round } from './round';

export default async ({ player1, player2 }) => {
  const players = [player1, player2];
  players.forEach((player) => {
    Object.setPrototypeOf(player, Player.prototype);
    Object.setPrototypeOf(player.brain, Genome.prototype);
    player.brain.nodes.forEach((node) => {
      Object.setPrototypeOf(node, NodeGene.prototype);
    });
    player.brain.connections.forEach((connection) => {
      Object.setPrototypeOf(connection, ConnectionGene.prototype);
    });
    Object.setPrototypeOf(player.brain.innovationHistory, Map.prototype);
    for (const gene of player.brain.innovationHistory.values()) {
      if (gene.layer !== undefined) {
        Object.setPrototypeOf(gene, NodeGene.prototype);
      } else {
        Object.setPrototypeOf(gene, ConnectionGene.prototype);
      }
    }
  });
  const round = new Round([player1, player2]);
  round.play();
};
