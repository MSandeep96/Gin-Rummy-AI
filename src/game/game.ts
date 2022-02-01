import { Player } from '../player/player';
import { Round } from '../round/round';

export class Game {
  players: Player[]; //2 players for now
  MAX_SCORE = 100;
  scores: number[];
  winner: Player;

  constructor(players: Player[]) {
    this.scores = new Array(players.length).fill(0);
  }

  startGame() {
    let roundCount = 0;
    while (roundCount < 10) {
      if (this.hasWinner()) {
        break;
      }
      const round = Round.newRound(this.players);
      round.play();
      if (round.winner !== undefined) {
        for (let i = 0; i < this.players.length; i++) {
          this.scores[i] += this.players[i].score;
        }
      }
      roundCount++;
    }
  }

  hasWinner(): boolean {
    for (let i = 0; i < this.scores.length; i++) {
      if (this.scores[i] >= this.MAX_SCORE) {
        this.winner = this.players[1 - i]; //select the other player
        return true;
      }
    }
    return false;
  }
}
