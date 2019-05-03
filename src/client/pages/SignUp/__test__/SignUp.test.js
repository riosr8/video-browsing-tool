import React from 'react';
import { mount } from 'enzyme';
import { Message } from 'semantic-ui-react';
import { MemoryRouter, Route } from 'react-router-dom';

// Components
import { SignUp } from '../SignUp';

describe('Sign Up', () => {
  let wrapper;
  const mockRegister = jest.fn();
  const mockSetAuthRedirectPath = jest.fn();
  const mockBeginErrorChecking = jest.fn();
  const mockSetError = jest.fn();
  const loading = false;
  const isAuthenticated = false;
  const registrationComplete = false;
  const error = null;
  const authRedirectPath = '/';

  beforeEach(() => {
    wrapper = mount(
      <SignUp
        register={mockRegister}
        setAuthRedirectPath={mockSetAuthRedirectPath}
        beginFormErrorChecking={mockBeginErrorChecking}
        setError={mockSetError}
        loading={loading}
        isAuthenticated={isAuthenticated}
        registrationComplete={registrationComplete}
        error={error}
        authRedirectPath={authRedirectPath}
      />,
    );
  });

  it('should call mock signup button', () => {
    wrapper
      .find('#emailInput')
      .hostNodes()
      .simulate('change', { target: { name: 'email', value: 'test@test.com' } });

    wrapper
      .find('#passwordInput')
      .hostNodes()
      .simulate('change', { target: { name: 'password', value: 'Password123' } });

    wrapper
      .find('#passwordConfirmationInput')
      .hostNodes()
      .simulate('change', { target: { name: 'passwordConfirmation', value: 'Password123' } });
    wrapper
      .find('#signUpForm')
      .hostNodes()
      .simulate('submit', { preventDefault() {} });
    expect(mockRegister.mock.calls).toHaveLength(1);
  });

  it('should render an error message', () => {
    wrapper.setProps({ error: 'oops' });
    expect(wrapper.find(Message)).toHaveLength(1);
  });

  const errorTestInputs = [
    { testName: 'incomplete fields', email: '', password: '', password2: '' },
    { testName: 'invalid email', email: 'test', password: 'Password123', password2: 'Password123' },
    {
      testName: 'passwords dont match',
      email: 'test@test.com',
      password: 'Password123',
      password2: 'Password1',
    },
    {
      testName: 'password length < 8',
      email: 'test@test.com',
      password: 'pass1',
      password2: 'pass1',
    },
    {
      testName: 'password does not contain at least one uppercase character',
      email: 'test@test.com',
      password: 'password123',
      password2: 'password1',
    },
    {
      testName: 'password does not contain at least one number',
      email: 'test@test.com',
      password: 'Password',
      password2: 'Password',
    },
    {
      testName: 'password does not contain at least one lowercase character',
      email: 'test@test.com',
      password: 'PASSWORD123',
      password2: 'PASSWORD123',
    },
  ];

  errorTestInputs.forEach(test => {
    it(`should render error message for form inputs: ${test.testName}`, () => {
      wrapper
        .find('#emailInput')
        .hostNodes()
        .simulate('change', { target: { name: 'email', value: test.email } });

      wrapper
        .find('#passwordInput')
        .hostNodes()
        .simulate('change', { target: { name: 'password', value: test.password } });

      wrapper
        .find('#passwordConfirmationInput')
        .hostNodes()
        .simulate('change', { target: { name: 'passwordConfirmation', value: test.password2 } });
      wrapper
        .find('#signUpForm')
        .hostNodes()
        .simulate('submit', { preventDefault() {} });
    });
  });
});

describe('Signup redirect', () => {
  const mockRegister = jest.fn();
  const mockSetAuthRedirectPath = jest.fn();
  const mockBeginErrorChecking = jest.fn();
  const mockSetError = jest.fn();
  const loading = false;
  const isAuthenticated = false;
  const error = null;
  const authRedirectPath = '/login';

  const getWrapper = registrationComplete => {
    const getSignUpComponent = registerComplete => (
      <SignUp
        register={mockRegister}
        setAuthRedirectPath={mockSetAuthRedirectPath}
        beginFormErrorChecking={mockBeginErrorChecking}
        setError={mockSetError}
        loading={loading}
        isAuthenticated={isAuthenticated}
        registrationComplete={registerComplete}
        error={error}
        authRedirectPath={authRedirectPath}
      />
    );
    const wrapper = mount(
      <MemoryRouter initialEntries={['/signup']} initialIndex={0}>
        <Route exact component={() => getSignUpComponent(registrationComplete)} />
      </MemoryRouter>,
    );
    return wrapper;
  };

  it('should redirect to login when registration complete', () => {
    const wrapper = getWrapper(true);
    expect(wrapper.find('component').props().location.pathname).toBe('/login');
  });
});
