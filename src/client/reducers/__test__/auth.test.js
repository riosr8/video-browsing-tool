import reducer, { initialState } from '../auth';
import * as actions from '../../actions/auth';

const tests = [
  { name: 'should handle LOGIN_START', action: actions.loginStart },
  {
    name: 'should handle LOGIN_SUCCESS',
    action: () => {
      return actions.loginSuccess('token', 'userid');
    },
  },
  {
    name: 'should handle LOGIN_FAIL',
    action: () => {
      return actions.loginFail('fail');
    },
  },
  { name: 'should handle AUTH_LOGOUT', action: actions.logout },
  { name: 'should handle REGISTRATION_START', action: actions.registrationStart },
  { name: 'should handle REGISTRATION_SUCCESS', action: actions.registrationSuccess },
  {
    name: 'should handle REGISTRATION_FAIL',
    action: () => {
      return actions.registrationFail('fail');
    },
  },
  {
    name: 'should handle RESET_REGISTRATION_COMPLETED',
    action: actions.resetRegistrationCompleted,
  },
  { name: 'should handle BEGIN_FORM_ERROR_CHECKING', action: actions.beginFormErrorChecking },
  { name: 'should handle SET_FORM_ERROR_START', action: actions.setFormErrorStart },
  {
    name: 'should handle SET_FORM_ERROR_END',
    action: () => {
      return actions.setFormErrorEnd('fail');
    },
  },
  {
    name: 'should handle SET_AUTH_REDIRECT_PATH',
    action: () => {
      return actions.setAuthRedirectPath('/');
    },
  },
];

describe('Auth reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  tests.forEach(test => {
    it(test.name, () => {
      expect(reducer(initialState, test.action())).toMatchSnapshot();
    });
  });
});
