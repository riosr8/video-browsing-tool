import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../util/util';

export const initialState = {
  userVideos: [],
  algorithms: [],
  activePage: 1,
  totalPages: 1,
  sortKey: 'time',
  sortOrder: 'asc',
  results: null,
  error: null,
  success: null,
  uploading: false,
  fetching: false,
  fetchingResults: false,
  requestProcessing: false,
  deleting: false,
};

const fetchResultsStart = state => updateObject(state, { error: null, fetchingResults: true });

const fetchResultsSuccess = (state, action) => {
  return updateObject(state, {
    fetchingResults: false,
    results: action.results,
  });
};

const fetchResultsFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    fetchingResults: false,
  });
};

const fetchVideosStart = state => updateObject(state, { error: null, fetching: true });

const fetchVideosSuccess = (state, action) => {
  return updateObject(state, {
    userVideos: action.userVideos,
    totalPages: action.totalPages,
    fetching: false,
  });
};

const fetchVideosFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    fetching: false,
  });
};

const uploadVideoStart = state => updateObject(state, { error: null, uploading: true });

const uploadVideoSuccess = (state, action) => {
  return updateObject(state, {
    uploading: false,
    success: action.success,
  });
};

const uploadVideoFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    uploading: false,
  });
};

const requestProcessingStart = state => {
  return updateObject(state, { error: null, requestProcessing: true });
};

const requestProcessingSuccess = state => {
  return updateObject(state, {
    requestProcessing: false,
  });
};

const requestProcessingFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    requestProcessing: false,
  });
};

const deleteVideoStart = state => {
  return updateObject(state, {
    deleting: true,
  });
};

const deleteVideoSuccess = (state, action) => {
  return updateObject(state, {
    deleting: false,
    success: action.success,
  });
};

const deleteVideoFail = (state, action) => {
  return updateObject(state, {
    deleting: false,
    error: action.error,
  });
};

const fetchAlgorithmsStart = state => {
  return state;
};

const fetchAlgorithmsSuccess = (state, action) => {
  return updateObject(state, {
    algorithms: action.algorithms,
  });
};

const fetchAlgorithmsFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
  });
};

const clearMessage = state => {
  return updateObject(state, {
    success: null,
    error: null,
  });
};

const setActivePage = (state, action) => {
  return updateObject(state, {
    activePage: action.activePage,
  });
};

const setSortKey = (state, action) => {
  return updateObject(state, {
    sortKey: action.sortKey,
  });
};

const setSortOrder = (state, action) => {
  return updateObject(state, {
    sortOrder: action.sortOrder,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_VIDEOS_START:
      return fetchVideosStart(state);
    case actionTypes.FETCH_VIDEOS_SUCCESS:
      return fetchVideosSuccess(state, action);
    case actionTypes.FETCH_VIDEOS_FAIL:
      return fetchVideosFail(state, action);
    case actionTypes.UPLOAD_VIDEO_START:
      return uploadVideoStart(state);
    case actionTypes.UPLOAD_VIDEO_SUCCESS:
      return uploadVideoSuccess(state, action);
    case actionTypes.UPLOAD_VIDEO_FAIL:
      return uploadVideoFail(state, action);
    case actionTypes.REQUEST_PROCESSING_START:
      return requestProcessingStart(state);
    case actionTypes.REQUEST_PROCESSING_SUCCESS:
      return requestProcessingSuccess(state);
    case actionTypes.REQUEST_PROCESSING_FAIL:
      return requestProcessingFail(state, action);
    case actionTypes.DELETE_VIDEO_START:
      return deleteVideoStart(state);
    case actionTypes.DELETE_VIDEO_SUCCESS:
      return deleteVideoSuccess(state, action);
    case actionTypes.DELETE_VIDEO_FAIL:
      return deleteVideoFail(state, action);
    case actionTypes.FETCH_ALGORITHMS_START:
      return fetchAlgorithmsStart(state);
    case actionTypes.FETCH_ALGORITHMS_SUCCESS:
      return fetchAlgorithmsSuccess(state, action);
    case actionTypes.FETCH_ALGORITHMS_FAIL:
      return fetchAlgorithmsFail(state, action);
    case actionTypes.FETCH_RESULTS_START:
      return fetchResultsStart(state);
    case actionTypes.FETCH_RESULTS_SUCCESS:
      return fetchResultsSuccess(state, action);
    case actionTypes.FETCH_RESULTS_FAIL:
      return fetchResultsFail(state, action);
    case actionTypes.CLEAR_MESSAGE:
      return clearMessage(state);
    case actionTypes.SET_ACTIVE_PAGE:
      return setActivePage(state, action);
    case actionTypes.SET_SORT_KEY:
      return setSortKey(state, action);
    case actionTypes.SET_SORT_ORDER:
      return setSortOrder(state, action);
    case actionTypes.AUTH_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
