import { expect } from 'chai';
import { map } from './map';
describe('map', () => {
  it('should maintain array length', () => {
    const arr = [ 1, 2, 3 ];
    expect(map(arr, x => x*2)).to.have.length(arr.length);
  });
  it('should return an empty array when passed an empty array', () => {
    expect(map([], x => x*2)).to.deep.equal([]);
  });
});
