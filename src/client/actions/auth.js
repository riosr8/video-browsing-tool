import axios from 'axios';
import * as actionTypes from './actionTypes';

export const loginStart = () => {
  return {
    type: actionTypes.LOGIN_START,
  };
};

export const loginSuccess = (token, userId) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    idToken: token,
    userId,
  };
};

export const loginFail = error => {
  return {
    type: actionTypes.LOGIN_FAIL,
    error,
  };
};

export const registrationStart = () => {
  return {
    type: actionTypes.REGISTRATION_START,
  };
};

export const registrationSuccess = () => {
  return {
    type: actionTypes.REGISTRATION_SUCCESS,
  };
};

export const registrationFail = error => {
  return {
    type: actionTypes.REGISTRATION_FAIL,
    error,
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const beginFormErrorChecking = () => {
  return {
    type: actionTypes.BEGIN_FORM_ERROR_CHECKING,
  };
};

export const setFormErrorStart = () => {
  return {
    type: actionTypes.SET_FORM_ERROR_START,
  };
};

export const setFormErrorEnd = error => {
  return {
    type: actionTypes.SET_FORM_ERROR_END,
    error,
  };
};

export const resetRegistrationCompleted = () => {
  return {
    type: actionTypes.RESET_REGISTRATION_COMPLETED,
  };
};

export const setError = error => {
  return dispatch => {
    dispatch(setFormErrorStart());
    dispatch(setFormErrorEnd(error));
  };
};

export const auth = (email, password) => {
  return async dispatch => {
    dispatch(loginStart());
    const authData = {
      email,
      password,
    };
    await axios
      .post('/auth/login', authData)
      .then(response => {
        const expirationDate = new Date(new Date().getTime() + response.data.expiresIn);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', response.data.email);
        dispatch(loginSuccess(response.data.token, response.data.email));
      })
      .catch(err => {
        dispatch(loginFail(err.response.data.message));
      });
  };
};

export const register = (email, password) => {
  return async dispatch => {
    dispatch(registrationStart());
    const registrationData = {
      email,
      password,
    };
    await axios
      .post('/register/newUser', registrationData)
      // eslint-disable-next-line no-unused-vars
      .then(response => {
        dispatch(registrationSuccess());
      })
      .catch(err => {
        dispatch(registrationFail(err.response.message));
      });
  };
};

export const setAuthRedirectPath = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path,
  };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const checkAuthState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        dispatch(loginSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  };
};
