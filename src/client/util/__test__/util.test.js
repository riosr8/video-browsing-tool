import { updateObject } from '../util';

describe('Object update utility', () => {
  const oldState = { propOne: 'a', propTwo: 'b' };
  const newState = { propTwo: 'c' };

  it('should update properties in old object with properties in new object', () => {
    expect(updateObject(oldState, newState)).toEqual({ propOne: 'a', propTwo: 'c' });
  });
});
