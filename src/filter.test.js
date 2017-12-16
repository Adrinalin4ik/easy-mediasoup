import { expect } from 'chai';
import { filter } from './filter';
describe('filter', () => {
  it('should remove items that don\'t evaluate to true when passed to predicate function', () => {
    const arr = [ 1, 2, 3 ];
    const expected = [ 2, 3 ];
    expect(filter(arr, x => x > 1)).to.deep.equal(expected);
  });
  it('should return an empty array when passed an empty array', () => {
    expect(filter([], x=> x === 1)).to.deep.equal([]);
  });
});
