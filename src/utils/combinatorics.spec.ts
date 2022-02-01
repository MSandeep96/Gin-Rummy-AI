import { getCombinationsWith3Elements } from './combinatorics';

test('Must generate all combination', () => {
  expect(getCombinationsWith3Elements(['a', 'b', 'c', 'd'])).toEqual([
    ['a', 'b', 'c'],
    ['a', 'b', 'd'],
    ['a', 'c', 'd'],
    ['b', 'c', 'd'],
  ]);
});
