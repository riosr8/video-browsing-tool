import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../util/util';

export const initialState = {
  status: { processed: [], processing: [], toBeProcessed: [] },
  polling: false,
  error: null,
};

const pollStatusStart = state => {
  return updateObject(state, {
    polling: true,
  });
};

const pollStatusSuccess = (state, action) => {
  let processed = [];
  let processing = [];
  let toBeProcessed = [];

  processed = processed.concat.apply(
    [],
    action.status.map(video => {
      return video.processed.map(algo => {
        return { name: video.videoName, id: video.videoUuid, algo };
      });
    }),
  );

  processing = processing.concat.apply(
    [],
    action.status.map(video => {
      return video.processing.map(algo => {
        return { name: video.videoName, id: video.videoUuid, algo };
      });
    }),
  );

  toBeProcessed = toBeProcessed.concat.apply(
    [],
    action.status.map(video => {
      return video.toBeProcessed.map(algo => {
        return { name: video.videoName, id: video.videoUuid, algo };
      });
    }),
  );

  return updateObject(state, {
    status: {
      processed,
      processing,
      toBeProcessed,
    },
    polling: false,
  });
};

const pollStatusFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    polling: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.POLL_STATUS_START:
      return pollStatusStart(state);
    case actionTypes.POLL_STATUS_SUCCESS:
      return pollStatusSuccess(state, action);
    case actionTypes.POLL_STATUS_FAIL:
      return pollStatusFail(state, action);
    default:
      return state;
  }
};

export default reducer;
