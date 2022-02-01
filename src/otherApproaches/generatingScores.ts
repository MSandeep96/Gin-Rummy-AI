// import { writeFileSync } from 'fs';

// import { stringify } from 'csv-stringify/sync';

// import { Deck } from '../deck/deck';
// import { ScoreCalculator } from '../utils/scoreCalculator';

// const symbols = ['♣', '♦', '♥', '♠'];

// const outputHuman = [];
// const outputComputer = [];

// for (let i = 0; i < 100000; i++) {
//   const cards = Deck.newDeck().deal();
//   const suitSortedCards = cards.sort((a, b) =>
//     a.suit === b.suit ? a.rank - b.rank : a.suit - b.suit
//   );
//   const score = new ScoreCalculator(suitSortedCards).calculateScore();
//   const humanReadCards: any = suitSortedCards.map((card) => [
//     symbols[card.suit],
//     card.rank,
//   ]);
//   humanReadCards.push(score);
//   const indexedCards = suitSortedCards.map((card) => card.getIndex());
//   indexedCards.push(score);
//   outputHuman.push(humanReadCards);
//   outputComputer.push(indexedCards);
// }

// writeFileSync(__dirname + '/generated/scoreHuman.csv', stringify(outputHuman));
// writeFileSync(
//   __dirname + '/generated/scoreComp.csv',
//   stringify(outputComputer)
// );
