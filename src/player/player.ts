import { Card } from '../deck/deck';
import { logger } from '../logger/logger';
import { Genome } from '../neat/Genome';
import { ScoreCalculator } from '../utils/scoreCalculator';

export enum PlayerActions {
  DISCARD,
  PICK_FROM_DECK,
  SHOW,
  FOLD,
}

export class Player {
  initialCards: Card[];
  initialScore = 0;
  cards: Card[];
  brain: Genome;
  score = 100; //every player starts with a score of 100
  turns = 1;
  fitness = 0;
  generation = 0;
  idx = 0;

  constructor(generation, idx) {
    this.generation = generation;
    this.idx = idx;
  }

  static randomPlayer(generation, idx): Player {
    const player = new Player(generation, idx);
    player.brain = Genome.getRandom(14, 5);
    return player;
  }

  crossover(parent2: Player, idx) {
    const child = new Player(this.generation + 1, idx);
    child.brain = this.brain.crossover(parent2.brain);
    return child;
  }

  mutate() {
    this.brain.mutate();
  }

  deal(cards: Card[]) {
    this.initialCards = cards;
    this.cards = cards;
    this.initialScore = ScoreCalculator.getScore(this.cards);
  }

  newRound() {
    this.cards = [];
    this.score = 100;
  }

  calculateScore() {
    this.score = ScoreCalculator.getScore(this.cards);
  }

  calculateFitness() {
    this.fitness = Math.max(this.initialScore - this.score, 0); // set zero if improvement is negative
  }

  tryAndReplaceCard(droppedCard, pickedCard): boolean {
    const index = this.cards.indexOf(droppedCard);
    if (index === -1) {
      return false;
    }
    this.cards[index] = pickedCard;
    return true;
  }

  private mapOutputToAction(output: number[]) {
    let maxOutputIndex = 0;
    for (let i = 1; i < output.length - 1; i++) {
      if (output[i] > output[maxOutputIndex]) {
        maxOutputIndex = i;
      }
    }
    const discardCardIdx = Math.floor(output[output.length - 1] * 52);
    const discardCard = Card.getCardFromIndex(discardCardIdx);
    switch (maxOutputIndex) {
      case 0:
        return { action: PlayerActions.DISCARD, card: discardCard };
      case 1:
        return { action: PlayerActions.PICK_FROM_DECK, card: null };
      case 2:
        return { action: PlayerActions.SHOW, card: null };
      default:
        return { action: PlayerActions.FOLD, card: null };
    }
  }

  play(
    availableCard: Card,
    hasPickedFromDeck: boolean
  ): { card: Card; action: PlayerActions } {
    this.turns++;
    const inputs: number[] = [];
    this.cards.forEach((card) => inputs.push(card.getIndex())); //send all cards indices
    inputs.sort();
    inputs.push(availableCard.getIndex()); //send top card index
    inputs.push(hasPickedFromDeck ? 1 : 0); //send if player picked from deck
    inputs.push(this.turns); //send turns
    const output: number[] = this.brain.evaluate(inputs);
    logger.critical('Output: ' + this.generation, { output: output });
    return this.mapOutputToAction(output);
  }

  toJson() {
    return {
      brain: this.brain.toJson(),
      generation: this.generation,
    };
  }
}
