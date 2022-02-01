import { chance } from '../utils/chance';

export enum Suit {
  Clubs = 0,
  Diamonds = 1,
  Hearts = 2,
  Spades = 3,
}

export enum Rank {
  AceLow = 1,
  Two = 2,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack,
  Queen,
  King,
  AceHigh,
}

export class Card {
  readonly suit: number;
  rank: number;

  constructor(suit: number, rank: number) {
    this.suit = suit;
    this.rank = rank;
  }

  getIndex(): number {
    return this.suit * 13 + (this.rank - 2);
  }

  getValue(): number {
    return this.rank >= Rank.Ten ? 10 : this.rank;
  }

  static getCardFromIndex(index: number): Card {
    return new Card(index / 13, (index % 13) + 2);
  }
}

export class Deck {
  cards: Card[];
  readonly CARDS_PER_DEAL = 13;

  static newDeck() {
    return new Deck();
  }

  constructor() {
    const cards = [];
    for (let i = Suit.Clubs; i <= Suit.Spades; i++) {
      for (let j = Rank.Two; j <= Rank.AceHigh; j++) {
        cards.push(new Card(i, j));
      }
    }
    this.cards = chance.shuffle(cards);
  }

  deal() {
    const cards = [];
    for (let i = 0; i < this.CARDS_PER_DEAL; i++) {
      cards.push(this.dealOne());
    }
    return cards;
  }

  dealOne() {
    if (this.cards.length === 0) throw new Error('No more cards in deck');
    return this.cards.pop();
  }

  hasCards() {
    return this.cards.length > 0;
  }
}
