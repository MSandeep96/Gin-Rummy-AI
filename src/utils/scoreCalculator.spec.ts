import { Card } from '../deck/deck';

import { ScoreCalculator } from './scoreCalculator';

describe('score calculator', () => {
  test('should return 0 if all runs', () => {
    const cardsRep = [
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [1, 6],
      [1, 7],
      [1, 8],
      [2, 4],
      [2, 5],
      [2, 6],
      [3, 10],
      [3, 11],
      [3, 12],
    ];
    const cards = cardsRep.map((card) => new Card(card[0], card[1]));
    expect(ScoreCalculator.getScore(cards)).toBe(0);
  });

  test('should return 0 if two runs and two sets', () => {
    const cardsRep = [
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [1, 6],
      [1, 7],
      [1, 8],
      [0, 10],
      [1, 10],
      [2, 10],
      [3, 11],
      [1, 11],
      [2, 11],
    ];
    const cards = cardsRep.map((card) => new Card(card[0], card[1]));
    expect(ScoreCalculator.getScore(cards)).toBe(0);
  });

  test('should return 0 if two runs and two sets but with overlap in runs', () => {
    const cardsRep = [
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [1, 6],
      [1, 7],
      [1, 8],
      [0, 9],
      [1, 9],
      [2, 9],
      [3, 10],
      [1, 10],
      [2, 10],
    ];
    const cards = cardsRep.map((card) => new Card(card[0], card[1]));
    expect(ScoreCalculator.getScore(cards)).toBe(0);
  });

  test('should consider A as both 1 and 14', () => {
    const cardsRep = [
      [0, 2],
      [0, 3],
      [0, 14],
      [0, 4],
      [1, 12],
      [1, 13],
      [1, 14],
      [0, 9],
      [1, 9],
      [2, 9],
      [3, 10],
      [1, 10],
      [2, 10],
    ];
    const cards = cardsRep.map((card) => new Card(card[0], card[1]));
    expect(ScoreCalculator.getScore(cards)).toBe(0);
  });

  test("should return score if there aren't two runs", () => {
    const cardsRep = [
      [0, 2],
      [0, 6],
      [0, 14],
      [0, 5],
      [1, 6],
      [3, 2],
      [1, 8],
      [0, 10],
      [1, 10],
      [2, 10],
      [3, 11],
      [1, 11],
      [2, 11],
    ];
    const cards = cardsRep.map((card) => new Card(card[0], card[1]));
    expect(ScoreCalculator.getScore(cards)).toBe(99);
  });

  test('should prefer set if it reduces score over run when there are two runs', () => {
    const cardsRep = [
      [0, 6],
      [0, 7],
      [0, 8],
      [0, 9],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 2],
      [2, 3],
      [2, 4],
      [2, 5],
      [2, 9],
      [3, 9],
    ];
    const cards = cardsRep.map((card) => new Card(card[0], card[1]));
    expect(ScoreCalculator.getScore(cards)).toBe(0);
  });

  test('should not return -1', () => {
    const cardsRep = [
      [0, 4],
      [0, 5],
      [1, 2],
      [1, 3],
      [2, 5],
      [2, 10],
      [2, 11],
      [2, 12],
      [2, 13],
      [3, 5],
      [3, 12],
      [3, 13],
      [3, 14],
    ];
    const cards = cardsRep.map((card) => new Card(card[0], card[1]));
    expect(ScoreCalculator.getScore(cards)).toBe(9);
  });

  test('should not return -1 as well', () => {
    const cardsRep = [
      [0, 6],
      [0, 14],
      [1, 3],
      [1, 11],
      [1, 12],
      [1, 13],
      [2, 2],
      [2, 3],
      [2, 7],
      [2, 8],
      [2, 9],
      [2, 14],
      [3, 14],
    ];
    const cards = cardsRep.map((card) => new Card(card[0], card[1]));
    expect(ScoreCalculator.getScore(cards)).toBe(14);
  });

  test('should not create double array', () => {
    const cardsRep = [
      [0, 4],
      [1, 4],
      [3, 4],
      [1, 11],
      [2, 11],
      [3, 11],
      [0, 11],
      [1, 12],
      [2, 12],
      [1, 13],
      [2, 13],
      [3, 13],
      [1, 14],
    ];
    const cards = cardsRep.map((card) => new Card(card[0], card[1]));
    expect(ScoreCalculator.getScore(cards)).toBe(10);
  });

  test('check score', () => {
    const cardsRep = [
      [1, 10],
      [1, 9],
      [0, 3],
      [1, 11],
      [2, 14],
      [2, 7],
      [2, 3],
      [2, 8],
      [2, 9],
      [2, 10],
      [3, 3],
      [2, 12],
      [2, 13],
    ];
    const cards = cardsRep.map((card) => new Card(card[0], card[1]));
    expect(ScoreCalculator.getScore(cards)).toBe(0);
  });
});
