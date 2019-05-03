import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import mockData from '../mocks/mockData';
import mockLocalStorage from '../mocks/mockLocalStorage';
import {
  auth,
  register,
  setError,
  beginFormErrorChecking,
  resetRegistrationCompleted,
  checkAuthState,
  setAuthRedirectPath,
  checkAuthTimeout,
} from '../auth';
import * as actionTypes from '../actionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
window.localStorage = mockLocalStorage;
jest.useFakeTimers();

let store;
describe('Auth actions', () => {
  beforeEach(() => {
    moxios.install();
    store = mockStore({});
  });

  afterEach(() => {
    moxios.uninstall();
    window.localStorage.clear();
  });

  it('should return LOGIN_START and LOGIN_SUCCESS', async done => {
    const { authLoginResponse, authData } = mockData;
    moxios.stubRequest('/auth/login', {
      status: 200,
      response: authLoginResponse,
    });

    const expectedActions = [
      {
        type: actionTypes.LOGIN_START,
      },
      {
        type: actionTypes.LOGIN_SUCCESS,
        idToken: authLoginResponse.token,
        userId: authLoginResponse.email,
      },
    ];

    await store.dispatch(auth(authData.email, authData.password)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });

  it('should return LOGIN_START and LOGIN_FAIL', async done => {
    const { authErrorLoginResponse, authData } = mockData;
    moxios.stubRequest('/auth/login', {
      status: 400,
      response: authErrorLoginResponse,
    });

    const expectedActions = [
      {
        type: actionTypes.LOGIN_START,
      },
      {
        type: actionTypes.LOGIN_FAIL,
        error: authErrorLoginResponse.message,
      },
    ];

    await store.dispatch(auth(authData.email, authData.password)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });

  it('should return REGISTRATION_START and REGISTRATION_SUCCESS', async done => {
    const { authData } = mockData;
    moxios.stubRequest('/register/newUser', {
      status: 200,
      response: {},
    });

    const expectedActions = [
      {
        type: actionTypes.REGISTRATION_START,
      },
      {
        type: actionTypes.REGISTRATION_SUCCESS,
      },
    ];

    await store.dispatch(register(authData.email, authData.password)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });

  it('should return REGISTRATION_START and REGISTRATION_FAIL', async done => {
    const { authData } = mockData;
    moxios.stubRequest('/register/newUser', {
      status: 400,
      response: {},
    });

    const expectedActions = [
      {
        type: actionTypes.REGISTRATION_START,
      },
      {
        type: actionTypes.REGISTRATION_FAIL,
      },
    ];

    await store.dispatch(register(authData.email, authData.password)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });

  it('should return RESET_REGISTRATION_COMPLETED', () => {
    const expectedActions = [
      {
        type: actionTypes.RESET_REGISTRATION_COMPLETED,
      },
    ];

    store.dispatch(resetRegistrationCompleted());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return BEGIN_FORM_ERROR_CHECKING', () => {
    const expectedActions = [
      {
        type: actionTypes.BEGIN_FORM_ERROR_CHECKING,
      },
    ];

    store.dispatch(beginFormErrorChecking());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return SET_FORM_ERROR_START and SET_FORM_ERROR_END', () => {
    const { testError } = mockData;
    const expectedActions = [
      {
        type: actionTypes.SET_FORM_ERROR_START,
      },
      {
        type: actionTypes.SET_FORM_ERROR_END,
        error: testError,
      },
    ];

    store.dispatch(setError(testError));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return AUTH_LOGOUT if no token in local storage', () => {
    const expectedActions = [
      {
        type: actionTypes.AUTH_LOGOUT,
      },
    ];

    store.dispatch(checkAuthState());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return AUTH_LOGOUT if token has expired', () => {
    const { authLoginResponse } = mockData;
    const expectedActions = [
      {
        type: actionTypes.AUTH_LOGOUT,
      },
    ];

    const expirationDate = new Date(new Date().getTime() - authLoginResponse.expiresIn);
    window.localStorage.setItem('token', authLoginResponse.token);
    window.localStorage.setItem('expirationDate', expirationDate);
    window.localStorage.setItem('userId', authLoginResponse.email);

    store.dispatch(checkAuthState());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return AUTH_LOGOUT if token expires while user is on web application', () => {
    const { authLoginResponse } = mockData;
    const expectedActions = [
      {
        type: actionTypes.AUTH_LOGOUT,
      },
    ];

    const expirationDate = new Date(new Date().getTime() + authLoginResponse.expiresIn);
    window.localStorage.setItem('token', authLoginResponse.token);
    window.localStorage.setItem('expirationDate', expirationDate);
    window.localStorage.setItem('userId', authLoginResponse.email);
    store.dispatch(checkAuthTimeout(0));
    jest.advanceTimersByTime(1000);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return LOGIN_SUCCESS if token in local storage is still valid', () => {
    const { authLoginResponse } = mockData;
    const expectedActions = [
      {
        type: actionTypes.LOGIN_SUCCESS,
        idToken: authLoginResponse.token,
        userId: authLoginResponse.email,
      },
    ];

    const expirationDate = new Date(new Date().getTime() + authLoginResponse.expiresIn);
    window.localStorage.setItem('token', authLoginResponse.token);
    window.localStorage.setItem('expirationDate', expirationDate);
    window.localStorage.setItem('userId', authLoginResponse.email);

    store.dispatch(checkAuthState());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return SET_AUTH_REDIRECT_PATH', () => {
    const expectedActions = [
      {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: '/',
      },
    ];

    store.dispatch(setAuthRedirectPath('/'));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
