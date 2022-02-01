import { Card, Deck } from '../deck/deck';
import { Player, PlayerActions } from '../player/player';

export class Round {
  deck: Deck;
  players: Player[];
  discardedTopCard: Card;
  winner: Player | undefined;
  turnsAllowed = 60;

  static newRound(players: Player[]) {
    return new Round(players);
  }

  constructor(players: Player[]) {
    this.deck = Deck.newDeck();
    this.players = players;
    this.players.forEach((player) => {
      player.newRound();
      player.deal(this.deck.deal());
    });
    this.discardedTopCard = this.deck.dealOne();
  }

  play() {
    while (this.deck.hasCards() && this.turnsAllowed-- !== 0) {
      for (let i = 0; i < this.players.length; i++) {
        const player = this.players[i];
        let hasPickedFromDeck = false;
        let playerMove = player.play(this.discardedTopCard, hasPickedFromDeck);
        if (playerMove.action === PlayerActions.PICK_FROM_DECK) {
          hasPickedFromDeck = true;
          this.discardedTopCard = this.deck.dealOne();
          playerMove = player.play(this.discardedTopCard, hasPickedFromDeck);
        }

        let illegalAction = false;

        switch (playerMove.action) {
          case PlayerActions.PICK_FROM_DECK:
            illegalAction = true;
            break;
          case PlayerActions.DISCARD: {
            if (playerMove.card === this.discardedTopCard) {
              if (hasPickedFromDeck) {
                illegalAction = true;
                break;
              }
              continue;
            }
            const validDiscard = player.tryAndReplaceCard(
              playerMove.card,
              this.discardedTopCard
            );
            if (validDiscard === false) {
              illegalAction = true;
              break;
            }
            this.discardedTopCard = playerMove.card;
            break;
          }
          case PlayerActions.FOLD:
            player.score = 100;
            this.players[1 - i].score = 90;
            this.winner = this.players[1 - i];
            return;
          case PlayerActions.SHOW:
            if (player.score !== 0) {
              illegalAction = true;
              break;
            }
            this.players[1 - i].calculateScore();
            this.winner = player;
            return;
        }

        if (illegalAction) {
          player.score = 150; //heavily penalize for illegal move
          this.players[1 - i].score = 90;
          this.winner = this.players[1 - i];
          this.players.forEach((p) => {
            p.calculateScore();
            p.calculateFitness();
          });
          return;
        }
      }
    }
    this.winner = undefined;
    this.players.forEach((p) => {
      p.calculateScore();
      p.calculateFitness();
    });
  }
}
