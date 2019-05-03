import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';
import mockData from '../mocks/mockData';
import {
  getVideos,
  uploadVideo,
  sendProcessingRequest,
  deleteVideo,
  getAlgorithms,
  getResults,
  clearMessage,
  setActivePage,
  setSortKey,
  setSortOrder,
} from '../dashboard';
import * as actionTypes from '../actionTypes';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
jest.useFakeTimers();

let store;

describe('Dashboard Actions - Video Fetching', () => {
  beforeEach(() => {
    moxios.install();
    store = mockStore({});
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should return FETCH_VIDEOS_START and FETCH_VIDEOS_SUCCESS', async done => {
    const { fetchVideosResponse, authData } = mockData;
    moxios.stubRequest('/api/listPagination?pageNo=1&sortVal=key&order=asc', {
      status: 200,
      response: fetchVideosResponse,
    });

    const expectedActions = [
      {
        type: actionTypes.FETCH_VIDEOS_START,
      },
      {
        type: actionTypes.FETCH_VIDEOS_SUCCESS,
        userVideos: fetchVideosResponse.results,
        totalPages: fetchVideosResponse.totalCount,
      },
    ];

    await store.dispatch(getVideos(authData.token, 1, 'key', 'asc')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });

  it('should return FETCH_VIDEOS_START and FETCH_VIDEOS_FAIL', async done => {
    const { error, authData } = mockData;
    moxios.stubRequest('/api/listPagination?pageNo=1&sortVal=key&order=asc', {
      status: 400,
      response: { message: error },
    });

    const expectedActions = [
      {
        type: actionTypes.FETCH_VIDEOS_START,
      },
      {
        type: actionTypes.FETCH_VIDEOS_FAIL,
        error,
      },
    ];

    await store.dispatch(getVideos(authData.token, 1, 'key', 'asc')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });
});

describe('Dashboard Actions - Other', () => {
  beforeEach(() => {
    store = mockStore({});
  });

  it('should return CLEAR_MESSAGE', () => {
    const expectedActions = [
      {
        type: actionTypes.CLEAR_MESSAGE,
      },
    ];

    store.dispatch(clearMessage());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return SET_ACTIVE_PAGE', () => {
    const expectedActions = [
      {
        type: actionTypes.SET_ACTIVE_PAGE,
      },
    ];

    store.dispatch(setActivePage());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return SET_SORT_KEY', () => {
    const expectedActions = [
      {
        type: actionTypes.SET_SORT_KEY,
      },
    ];

    store.dispatch(setSortKey());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return SET_SORT_ORDER', () => {
    const expectedActions = [
      {
        type: actionTypes.SET_SORT_ORDER,
      },
    ];

    store.dispatch(setSortOrder());
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('Dashboard Actions - Video Uploading', () => {
  beforeEach(() => {
    moxios.install();
    store = mockStore({});
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should return UPLOAD_VIDEO_START and UPLOAD_VIDEO_SUCCESS', async done => {
    const { uploadVideoResponse, authData } = mockData;
    moxios.stubRequest('/api/upload', {
      status: 200,
      response: uploadVideoResponse,
    });

    const expectedActions = [
      {
        type: actionTypes.UPLOAD_VIDEO_START,
      },
      {
        type: actionTypes.UPLOAD_VIDEO_SUCCESS,
        success: `${uploadVideoResponse.videoName} successfully uploaded.`,
      },
      {
        type: actionTypes.FETCH_VIDEOS_START,
      },
    ];
    const data = new FormData();
    await store.dispatch(uploadVideo(data, authData.token, 1, 'time', 'asc')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });

  it('should return UPLOAD_VIDEO_START and UPLOAD_VIDEO_FAIL', async done => {
    const { error, authData } = mockData;
    moxios.stubRequest('/api/upload', {
      status: 400,
      response: { message: error },
    });

    const expectedActions = [
      {
        type: actionTypes.UPLOAD_VIDEO_START,
      },
      {
        type: actionTypes.UPLOAD_VIDEO_FAIL,
        error,
      },
    ];
    const data = new FormData();
    await store.dispatch(uploadVideo(data, authData.token, authData.email)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });
});

describe('Dashboard Actions - Submitting Video Processing Request', () => {
  beforeEach(() => {
    moxios.install();
    store = mockStore({});
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should return REQUEST_PROCESSING_START and REQUEST_PROCESSING_SUCCESS', async done => {
    const { authData, processingRequestResponse } = mockData;
    // commented until endpoint is ready
    moxios.stubRequest('/api/algorithmInput', {
      status: 200,
      response: processingRequestResponse,
    });

    const expectedActions = [
      {
        type: actionTypes.REQUEST_PROCESSING_START,
      },
      {
        type: actionTypes.REQUEST_PROCESSING_SUCCESS,
        success: 'Success',
      },
    ];
    await store.dispatch(sendProcessingRequest(authData.token, ['algo 1'], '123456')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });

  it('should return REQUEST_PROCESSING_START and REQUEST_PROCESSING_FAIL', async done => {
    const { authData, error } = mockData;
    // commented until endpoint is ready
    moxios.stubRequest('/api/algorithmInput', {
      status: 400,
      response: { message: error },
    });

    const expectedActions = [
      {
        type: actionTypes.REQUEST_PROCESSING_START,
      },
      {
        type: actionTypes.REQUEST_PROCESSING_FAIL,
        error,
      },
    ];
    await store.dispatch(sendProcessingRequest(authData.token, ['algo 1'], '123456')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });
});

describe('Dashboard Actions - Deleting a video', () => {
  beforeEach(() => {
    moxios.install();
    store = mockStore({});
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should return DELETE_VIDEO_START and DELETE_VIDEO_SUCCESS', async done => {
    const { deleteVideoResponse, authData } = mockData;
    moxios.stubRequest('/api/delete', {
      status: 200,
      response: deleteVideoResponse,
    });

    const expectedActions = [
      {
        type: actionTypes.DELETE_VIDEO_START,
      },
      {
        type: actionTypes.DELETE_VIDEO_SUCCESS,
        success: 'message',
      },
      {
        type: actionTypes.FETCH_VIDEOS_START,
      },
    ];

    await store.dispatch(deleteVideo(authData.token, 'uuid')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });

  it('should return DELETE_VIDEO_START and DELETE_VIDEO_FAIL', async done => {
    const { deleteVideoResponse, authData } = mockData;
    moxios.stubRequest('/api/delete', {
      status: 400,
      response: deleteVideoResponse,
    });

    const expectedActions = [
      {
        type: actionTypes.DELETE_VIDEO_START,
      },
      {
        type: actionTypes.DELETE_VIDEO_FAIL,
        error: 'message',
      },
    ];

    await store.dispatch(deleteVideo(authData.token, 'uuid')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });
});

describe('Dashboard Actions -  Requesting available algorithms', () => {
  beforeEach(() => {
    moxios.install();
    store = mockStore({});
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should return FETCH_ALGORITHMS_START and FETCH_ALGORITHMS_SUCCESS', async done => {
    const { algorithmAvailableRespose } = mockData;
    moxios.stubRequest('/noAuth/algorithmsAvailable', {
      status: 200,
      response: algorithmAvailableRespose,
    });

    const expectedActions = [
      {
        type: actionTypes.FETCH_ALGORITHMS_START,
      },
      {
        type: actionTypes.FETCH_ALGORITHMS_SUCCESS,
        algorithms: algorithmAvailableRespose.algorithms,
      },
    ];

    await store.dispatch(getAlgorithms()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });

  it('should return DELETE_VIDEO_START and DELETE_VIDEO_FAIL', async done => {
    const { algorithmAvailableRespose } = mockData;
    moxios.stubRequest('/noAuth/algorithmsAvailable', {
      status: 400,
      response: algorithmAvailableRespose,
    });

    const expectedActions = [
      {
        type: actionTypes.FETCH_ALGORITHMS_START,
      },
      {
        type: actionTypes.FETCH_ALGORITHMS_FAIL,
      },
    ];

    await store.dispatch(getAlgorithms()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });
});

describe('Dashboard Actions - Results Fetching ', () => {
  beforeEach(() => {
    moxios.install();
    store = mockStore({});
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should return FETCH_RESULTS_START and FETCH_RESULTS_SUCCESS', async done => {
    const { resultsResponse } = mockData;
    moxios.stubRequest('/api/results', {
      status: 200,
      response: resultsResponse,
    });

    const expectedActions = [
      {
        type: actionTypes.FETCH_RESULTS_START,
      },
      {
        type: actionTypes.FETCH_RESULTS_SUCCESS,
        results: resultsResponse,
      },
    ];

    await store.dispatch(getResults()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });

  it('should return FETCH_RESULTS_START and FETCH_RESULTS_FAIL', async done => {
    const { error } = mockData;
    moxios.stubRequest('/api/results', {
      status: 400,
      response: { message: error },
    });

    const expectedActions = [
      {
        type: actionTypes.FETCH_RESULTS_START,
      },
      {
        type: actionTypes.FETCH_RESULTS_FAIL,
        error,
      },
    ];

    await store.dispatch(getResults()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });

    done();
  });
});
