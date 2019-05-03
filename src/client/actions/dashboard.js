import axios from 'axios';
import * as actionTypes from './actionTypes';

// FETCH VIDEO ACTION CREATORS

export const fetchVideosStart = () => {
  return {
    type: actionTypes.FETCH_VIDEOS_START,
  };
};

export const fetchVideosSuccess = (userVideos, totalPages) => {
  return {
    type: actionTypes.FETCH_VIDEOS_SUCCESS,
    userVideos,
    totalPages,
  };
};

export const fetchVideosFail = error => {
  return {
    type: actionTypes.FETCH_VIDEOS_FAIL,
    error,
  };
};

export const uploadVideoStart = () => {
  return {
    type: actionTypes.UPLOAD_VIDEO_START,
  };
};

export const uploadVideoSuccess = success => {
  return {
    type: actionTypes.UPLOAD_VIDEO_SUCCESS,
    success,
  };
};

export const uploadVideoFail = error => {
  return {
    type: actionTypes.UPLOAD_VIDEO_FAIL,
    error,
  };
};

export const requestProcessingStart = () => {
  return {
    type: actionTypes.REQUEST_PROCESSING_START,
  };
};

export const requestProcessingSuccess = message => {
  return {
    type: actionTypes.REQUEST_PROCESSING_SUCCESS,
    success: message,
  };
};

export const requestProcessingFail = error => {
  return {
    type: actionTypes.REQUEST_PROCESSING_FAIL,
    error,
  };
};

export const fetchAlgorithmsStart = () => {
  return {
    type: actionTypes.FETCH_ALGORITHMS_START,
  };
};

export const fetchAlgorithmsSuccess = algorithms => {
  return {
    type: actionTypes.FETCH_ALGORITHMS_SUCCESS,
    algorithms,
  };
};

export const fetchAlgorithmsFail = () => {
  return {
    type: actionTypes.FETCH_ALGORITHMS_FAIL,
  };
};

export const deleteVideoStart = () => {
  return {
    type: actionTypes.DELETE_VIDEO_START,
  };
};

export const deleteVideoSuccess = success => {
  return {
    type: actionTypes.DELETE_VIDEO_SUCCESS,
    success,
  };
};

export const deleteVideoFail = error => {
  return {
    type: actionTypes.DELETE_VIDEO_FAIL,
    error,
  };
};

export const fetchResultsStart = () => {
  return {
    type: actionTypes.FETCH_RESULTS_START,
  };
};

export const fetchResultsSuccess = results => {
  return {
    type: actionTypes.FETCH_RESULTS_SUCCESS,
    results,
  };
};

export const fetchResultsFail = error => {
  return {
    type: actionTypes.FETCH_RESULTS_FAIL,
    error,
  };
};

export const clearMessage = () => {
  return {
    type: actionTypes.CLEAR_MESSAGE,
  };
};

export const setActivePage = activePage => {
  return {
    type: actionTypes.SET_ACTIVE_PAGE,
    activePage,
  };
};

export const setSortKey = sortKey => {
  return {
    type: actionTypes.SET_SORT_KEY,
    sortKey,
  };
};

export const setSortOrder = sortOrder => {
  return {
    type: actionTypes.SET_SORT_ORDER,
    sortOrder,
  };
};

export const getResults = (token, uuid) => {
  return async dispatch => {
    dispatch(fetchResultsStart());
    await axios
      .post(
        '/api/results',
        {
          videoUuid: uuid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => {
        dispatch(fetchResultsSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchResultsFail(err.response.data.message));
      });
  };
};

export const getVideos = (token, pageNo, sortKey, sortOrder) => {
  return async dispatch => {
    dispatch(fetchVideosStart());
    await axios
      .get(`/api/listPagination?pageNo=${pageNo}&sortVal=${sortKey}&order=${sortOrder}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        dispatch(fetchVideosSuccess(res.data.results, res.data.totalCount));
      })
      .catch(err => {
        dispatch(fetchVideosFail(err.response.data.message));
      });
  };
};

export const getAlgorithms = () => {
  return async dispatch => {
    dispatch(fetchAlgorithmsStart());
    await axios
      .get('/noAuth/algorithmsAvailable')
      .then(res => {
        dispatch(fetchAlgorithmsSuccess(res.data.algorithms));
      })
      .catch(err => {
        dispatch(fetchAlgorithmsFail(err.response.data.message));
      });
  };
};

export const uploadVideo = (data, token, activePage, sortKey, sortOrder) => {
  return async dispatch => {
    dispatch(uploadVideoStart());
    await axios
      .post('/api/upload', data, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        dispatch(uploadVideoSuccess(`${res.data.videoName} successfully uploaded.`));
      })
      .then(() => {
        dispatch(getVideos(token, activePage, sortKey, sortOrder));
      })
      .catch(err => {
        dispatch(uploadVideoFail(err.response.data.message));
      });
  };
};

export const sendProcessingRequest = (token, selectedAlgorithms, selectedVideoUUID) => {
  return async dispatch => {
    dispatch(requestProcessingStart());
    await axios
      .post(
        '/api/algorithmInput',
        {
          videoUuid: selectedVideoUUID,
          algorithmicInput: selectedAlgorithms,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => {
        dispatch(requestProcessingSuccess(res.data.message));
      })
      .catch(err => {
        dispatch(requestProcessingFail(err.response.data.message));
      });
  };
};

export const deleteVideo = (token, uuid, activePage, sortKey, sortOrder) => {
  return async dispatch => {
    dispatch(deleteVideoStart());
    await axios
      .post(
        '/api/delete',
        {
          videoUuid: uuid,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => {
        dispatch(deleteVideoSuccess(res.data.message));
      })
      .then(() => {
        dispatch(getVideos(token, activePage, sortKey, sortOrder));
      })
      .catch(err => {
        dispatch(deleteVideoFail(err.response.data.message));
      });
  };
};
