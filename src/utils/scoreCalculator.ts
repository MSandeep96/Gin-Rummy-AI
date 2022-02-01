import { Card, Rank } from '../deck/deck';

import { getCombinationsWith3Elements } from './combinatorics';

export class ScoreCalculator {
  cards: Card[];
  totalRuns = 0;
  totalScore = 0;
  possibleRuns: Card[][] = [];
  possibleSets: Card[][] = [];

  constructor(cards: Card[]) {
    this.cards = [...cards];
  }

  static getScore(cards: Card[]) {
    return new ScoreCalculator(cards).calculateScore();
  }

  private calculateScore() {
    this.totalScore = this.cards.reduce(
      (acc, card) => acc + card.getValue(),
      0
    );
    this.getCardsInRuns();
    this.getCardsInRunsWithAas1();
    if (this.totalRuns < 2) {
      return this.totalScore;
    }
    this.getCardsInSets();
    const pointsSaved = this.calculateBestPossibleHand();
    return this.totalScore - pointsSaved;
  }

  private calculateBestPossibleHand(
    ridx = 0,
    sidx = 0,
    cardsSoFar = new Set(),
    numberOfRuns = 0
  ) {
    if (
      ridx === this.possibleRuns.length &&
      sidx === this.possibleSets.length
    ) {
      return 0;
    }
    let checkSets = false;
    if (ridx === this.possibleRuns.length) {
      if (numberOfRuns < 2) {
        return 0;
      }
      checkSets = true;
    }
    const currentMeld = checkSets
      ? this.possibleSets[sidx]
      : this.possibleRuns[ridx];
    let pointsSaved = 0;
    const cardsWithMeld = new Set(cardsSoFar);
    for (let i = 0; i < currentMeld.length; i++) {
      if (cardsSoFar.has(currentMeld[i].getIndex())) {
        return this.calculateBestPossibleHand(
          checkSets ? ridx : ridx + 1,
          checkSets ? sidx + 1 : sidx,
          cardsSoFar,
          numberOfRuns
        );
      }
      pointsSaved += currentMeld[i].getValue();
      cardsWithMeld.add(currentMeld[i].getIndex());
    }
    return Math.max(
      this.calculateBestPossibleHand(
        checkSets ? ridx : ridx + 1,
        checkSets ? sidx + 1 : sidx,
        cardsWithMeld,
        numberOfRuns + (checkSets ? 0 : 1)
      ) + pointsSaved,
      this.calculateBestPossibleHand(
        checkSets ? ridx : ridx + 1,
        checkSets ? sidx + 1 : sidx,
        cardsSoFar,
        numberOfRuns
      )
    );
  }

  private getCardsInSets() {
    const rankSortedCards = this.cards.sort((a, b) => a.rank - b.rank);
    let i = 0,
      j = 1;
    while (j < this.cards.length + 1) {
      if (
        j === this.cards.length ||
        rankSortedCards[i].rank !== rankSortedCards[j].rank
      ) {
        if (j - i > 2) {
          const possibleSet = [];
          for (let k = i; k < j; k++) {
            possibleSet.push(rankSortedCards[k]);
          }
          this.possibleSets.push([...possibleSet]);
          if (possibleSet.length === 4) {
            this.possibleSets.push(
              ...getCombinationsWith3Elements(possibleSet)
            );
          }
        }
        i = j;
      }
      j++;
    }
  }

  private getCardsInRuns() {
    const suitSortedCards = this.cards.sort((a, b) =>
      a.suit === b.suit ? a.rank - b.rank : a.suit - b.suit
    );
    let i = 0,
      j = 1;
    while (j < this.cards.length + 1) {
      if (
        j === this.cards.length ||
        suitSortedCards[j].getIndex() - suitSortedCards[j - 1].getIndex() !== 1
      ) {
        if (j - i >= 3) {
          this.totalRuns += Math.floor((j - i) / 3);
          let run = [];
          for (let k = i; k < j; k++) {
            run.push(suitSortedCards[k]);
            if (run.length > 2) this.possibleRuns.push([...run]);
          }
          run = [];
          for (let k = j - 1; k > i; k--) {
            run.push(suitSortedCards[k]);
            if (run.length > 2) this.possibleRuns.push([...run]);
          }
        }
        i = j;
      }
      j++;
    }
  }

  private getCardsInRunsWithAas1() {
    //check if cards have Ace and set it to rank 1
    let hasAce = false;
    const cards = this.cards.map((card) => {
      if (card.rank === Rank.AceHigh) {
        hasAce = true;
        return new Card(card.suit, Rank.AceLow);
      }
      return card;
    });
    if (!hasAce) return;

    const suitSortedCards = cards.sort((a, b) =>
      a.suit === b.suit ? a.rank - b.rank : a.suit - b.suit
    );
    let i = 0,
      j = 1;
    while (j < this.cards.length + 1) {
      if (
        j === this.cards.length ||
        suitSortedCards[j].getIndex() - suitSortedCards[j - 1].getIndex() !==
          1 ||
        suitSortedCards[j].suit !== suitSortedCards[j - 1].suit
      ) {
        if (j - i >= 3) {
          const run = [];
          for (let k = i; k < j; k++) {
            run.push(suitSortedCards[k]);
            if (run.length > 2) {
              const hasAce = run.some((card) => card.rank === Rank.AceLow);
              if (hasAce) {
                this.totalRuns += Math.floor((j - i) / 3);
                this.possibleRuns.push(
                  run.map((card) =>
                    card.rank === Rank.AceLow
                      ? new Card(card.suit, Rank.AceHigh)
                      : card
                  )
                );
              }
            }
          }
        }
        i = j;
      }
      j++;
    }
  }
}
