let localStorage = {};

export default {
  setItem: (key, value) => {
    localStorage[key] = value.toString();
  },
  getItem: key => {
    return localStorage[key] || null;
  },
  clear: () => {
    localStorage = {};
  },
  removeItem: key => {
    delete localStorage[key];
  },
  getLocalStorage: () => localStorage,
};
