import mockLocalStorage from '../mockLocalStorage';

describe('Mock Local Storage', () => {
  const localStorage = mockLocalStorage;

  it('should set an item in local storage and be able to retrive it', () => {
    localStorage.setItem('key', 'value');
    expect(localStorage.getItem('key')).toEqual('value');
  });

  it('should return null', () => {
    expect(localStorage.getItem('random')).toEqual(null);
  });

  it('should remove an item from local storage', () => {
    localStorage.removeItem('key');
    expect(localStorage.getLocalStorage()).toEqual({});
  });

  it('should remove everything in local storage', () => {
    localStorage.setItem('key', 'value');
    expect(localStorage.getItem('key')).toEqual('value');
    localStorage.clear();
    expect(localStorage.getLocalStorage()).toEqual({});
  });
});
