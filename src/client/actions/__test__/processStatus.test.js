import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import * as actionTypes from '../actionTypes';
import mockData from '../mocks/mockData';
import { pollStatus } from '../processStatus';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let store;

describe('Process Status Actions - Polling', () => {
  beforeEach(() => {
    moxios.install();
    store = mockStore({});
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should return POLL_STATUS_START and POLL_STATUS_SUCCESS', async done => {
    const { pollStatusResponse, authData } = mockData;
    moxios.stubRequest('/api/status', {
      status: 200,
      response: pollStatusResponse,
    });

    const expectedActions = [
      {
        type: actionTypes.POLL_STATUS_START,
      },
      {
        type: actionTypes.POLL_STATUS_SUCCESS,
        status: pollStatusResponse,
      },
    ];

    await store.dispatch(pollStatus(authData.token)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });

  it('should return POLL_STATUS_START and POLL_STATUS_FAIL', async done => {
    const { error, authData } = mockData;
    moxios.stubRequest('/api/status', {
      status: 400,
      response: { message: error },
    });

    const expectedActions = [
      {
        type: actionTypes.POLL_STATUS_START,
      },
      {
        type: actionTypes.POLL_STATUS_FAIL,
        error,
      },
    ];

    await store.dispatch(pollStatus(authData.token)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });
});
