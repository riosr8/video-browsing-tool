import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import { Login } from '../Login';

describe('Login', () => {
  let wrapper;
  const mockOnAuth = jest.fn();
  const mockSetError = jest.fn();
  const loading = false;
  const isAuthenticated = false;
  let authRedirectPath = '/';
  const error = null;
  const registering = false;
  let registrationComplete = false;
  const mockResetRegistrationCompleted = jest.fn(() => {
    registrationComplete = false;
  });
  const mockSetAuthRedirectPath = jest.fn(() => {
    authRedirectPath = '/';
  });

  beforeEach(() => {
    wrapper = mount(
      <Login
        onAuth={mockOnAuth}
        loading={loading}
        isAuthenticated={isAuthenticated}
        authRedirectPath={authRedirectPath}
        error={error}
        setAuthRedirectPath={mockSetAuthRedirectPath}
        registering={registering}
        resetRegistrationCompleted={mockResetRegistrationCompleted}
        registrationComplete={registrationComplete}
        setError={mockSetError}
      />,
    );
  });

  it('should call the mock login function', () => {
    wrapper
      .find('#loginForm')
      .hostNodes()
      .simulate('submit', { preventDefault() {} });
    // console.log(
    //   wrapper
    //     .find('#loginForm')
    //     .last()
    //     .html(),
    // );
    expect(mockOnAuth.mock.calls).toHaveLength(1);
  });

  it('should be called with the email and password in the state as arguments', () => {
    wrapper
      .find('#emailInput')
      .hostNodes()
      .simulate('change', { target: { name: 'email', value: 'test@test.com' } });
    // fill in password field with cats
    wrapper
      .find('#passwordInput')
      .hostNodes()
      .simulate('change', { target: { name: 'password', value: 'password' } });
    // simulate form submission
    wrapper
      .find('#loginForm')
      .hostNodes()
      .simulate('submit', { preventDefault() {} });
    // test to see arguments used after its been submitted
    // console.log(mockOnAuth.mock.calls);
    expect(mockOnAuth.mock.calls[0][0]).toEqual('test@test.com');
    expect(mockOnAuth.mock.calls[0][1]).toEqual('password');
  });

  registrationComplete = true;
  it('should reset registration complete to false', () => {
    expect(wrapper.props().registrationComplete).toEqual(false);
  });

  it('should render an error message', () => {
    wrapper.setProps({ error: {} });
    expect(wrapper.find('#errorMessage').hostNodes()).toHaveLength(1);
  });

  authRedirectPath = '/login';
  it('should set authRedirectPath to /', () => {
    expect(wrapper.props().authRedirectPath).toEqual('/');
  });
});

describe('Login redirect', () => {
  // let wrapper;
  const mockOnAuth = jest.fn();
  const mockResetRegistrationCompleted = jest.fn();
  const mockSetAuthRedirectPath = jest.fn();
  const mockSetError = jest.fn();
  const loading = false;
  // const isAuthenticated = true;
  const authRedirectPath = '/';
  const error = null;
  const registering = false;
  const registrationComplete = false;

  const getWrapper = isAuthenticated => {
    const getLoginComponent = isAuth => (
      <Login
        onAuth={mockOnAuth}
        loading={loading}
        isAuthenticated={isAuth}
        authRedirectPath={authRedirectPath}
        error={error}
        setAuthRedirectPath={mockSetAuthRedirectPath}
        registering={registering}
        resetRegistrationCompleted={mockResetRegistrationCompleted}
        registrationComplete={registrationComplete}
        setError={mockSetError}
      />
    );
    const wrapper = mount(
      <MemoryRouter initialEntries={['/login']} initialIndex={0}>
        <Route exact component={() => getLoginComponent(isAuthenticated)} />
      </MemoryRouter>,
    );
    return wrapper;
  };

  it('should redirect to home if authenticated', () => {
    const wrapper = getWrapper(true);
    expect(wrapper.find('component').props().location.pathname).toBe('/');
  });
  it('should be on login route if not redirected', () => {
    const wrapper = getWrapper(false);
    expect(wrapper.find('component').props().location.pathname).toBe('/login');
  });
});
