import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../util/util';

export const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  registering: false,
  registrationComplete: false,
  authRedirectPath: '/',
};
const authStart = state => updateObject(state, { error: null, loading: true });

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.idToken,
    userId: action.userId,
    error: null,
    loading: false,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const authLogout = state => {
  return updateObject(state, { token: null, userId: null });
};

const beginFormErrorChecking = state => {
  return updateObject(state, {
    error: null,
  });
};

const setFormErrorStart = state => {
  return updateObject(state, {
    error: null,
  });
};

const setFormErrorEnd = (state, action) => {
  return updateObject(state, {
    error: action.error,
  });
};

const registrationStart = state => {
  return updateObject(state, {
    error: null,
    loading: true,
    registering: true,
    registrationComplete: false,
  });
};

const registrationSuccess = state => {
  return updateObject(state, {
    error: null,
    loading: false,
    registering: false,
    registrationComplete: true,
  });
};

const registrationFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
    registering: false,
    registrationComplete: false,
  });
};

const resetRegistrationCompleted = state => {
  return updateObject(state, {
    registrationComplete: false,
  });
};

const setAuthRedirectPath = (state, action) => {
  return updateObject(state, { authRedirectPath: action.path });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_START:
      return authStart(state);
    case actionTypes.LOGIN_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.LOGIN_FAIL:
      return authFail(state, action);
    case actionTypes.REGISTRATION_START:
      return registrationStart(state);
    case actionTypes.REGISTRATION_SUCCESS:
      return registrationSuccess(state);
    case actionTypes.REGISTRATION_FAIL:
      return registrationFail(state, action);
    case actionTypes.RESET_REGISTRATION_COMPLETED:
      return resetRegistrationCompleted(state);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state);
    case actionTypes.BEGIN_FORM_ERROR_CHECKING:
      return beginFormErrorChecking(state);
    case actionTypes.SET_FORM_ERROR_START:
      return setFormErrorStart(state);
    case actionTypes.SET_FORM_ERROR_END:
      return setFormErrorEnd(state, action);
    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state, action);
    default:
      return state;
  }
};

export default reducer;
