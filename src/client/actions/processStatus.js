import axios from 'axios';
import * as actionTypes from './actionTypes';

export const pollStatusStart = () => {
  return {
    type: actionTypes.POLL_STATUS_START,
  };
};

export const pollStatusSuccess = status => {
  return {
    type: actionTypes.POLL_STATUS_SUCCESS,
    status,
  };
};

export const pollStatusFail = error => {
  return {
    type: actionTypes.POLL_STATUS_FAIL,
    error,
  };
};

export const pollStatus = token => {
  return async dispatch => {
    dispatch(pollStatusStart());
    await axios
      .get('/api/status', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        dispatch(pollStatusSuccess(res.data));
      })
      .catch(err => {
        dispatch(pollStatusFail(err.response.data.message));
      });
  };
};
