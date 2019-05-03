import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Switch } from 'react-router-dom';
import { Button, Form, Grid, Header, Segment, Container, Message } from 'semantic-ui-react';
import * as actions from '../../actions/index';
// import uhLogo from '../../static/images/uhLogo.png';

export const SignUp = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const {
    loading,
    error,
    authRedirectPath,
    register,
    beginFormErrorChecking,
    setError,
    setAuthRedirectPath,
    registrationComplete,
    isAuthenticated,
  } = props;
  let hasError = false;

  useEffect(() => {
    if (authRedirectPath !== '/login') {
      setError(null);
      setAuthRedirectPath('/login');
    }
  }, []);

  if (error != null) {
    hasError = true;
  }

  let authRedirect = null;
  if (!isAuthenticated && registrationComplete) {
    authRedirect = (
      <Switch>
        <Redirect exact from="/signup" to={authRedirectPath} />
      </Switch>
    );
  }

  const validate = () => {
    beginFormErrorChecking();

    if (email === '' || password === '' || passwordConfirmation === '') {
      setError('Please fill out all fields.');
      return false;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      setPassword('');
      setPasswordConfirmation('');
      return false;
    }

    if (password.length < 8) {
      setError('Password should be at least 8 characters.');
      setPassword('');
      setPasswordConfirmation('');
      return false;
    }

    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      setError(
        'Password should contain at least one number, one lowercase and one uppercase letter.',
      );
      setPassword('');
      setPasswordConfirmation('');
      return false;
    }

    return true;
  };

  const handleSignUp = e => {
    e.preventDefault();
    const valid = validate();
    if (!valid) {
      return;
    }
    register(email, password);
  };

  return (
    <div id="loginWrapper">
      {authRedirect}
      <style>
        {`
      body > div,
      body > div > main,
      body > div > main > div#loginWrapper,
      body > div > main > div > div#login-container {
        height: 90%;
      }
    `}
      </style>
      <Container id="login-container">
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            {/* <Image src={uhLogo} size="large" /> */}
            <Header as="h2" color="red" textAlign="center">
              Sign Up
            </Header>
            <Form
              id="signUpForm"
              size="large"
              loading={loading}
              error={hasError}
              onSubmit={handleSignUp}
            >
              <Segment stacked>
                <Form.Input
                  id="emailInput"
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Form.Input
                  id="passwordInput"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <Form.Input
                  id="passwordConfirmationInput"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Confirm Password"
                  type="password"
                  value={passwordConfirmation}
                  onChange={e => setPasswordConfirmation(e.target.value)}
                />
                {error && <Message id="errorMessage" error header={error} />}

                <Button color="red" fluid size="large">
                  Sign Up
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
};
/* istanbul ignore next */
const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    authRedirectPath: state.auth.authRedirectPath,
    registrationComplete: state.auth.registrationComplete,
    isAuthenticated: state.auth.token !== null,
  };
};
/* istanbul ignore next */
const mapDispatchToProps = dispatch => {
  return {
    register: (email, password) => dispatch(actions.register(email, password)),
    beginFormErrorChecking: () => dispatch(actions.beginFormErrorChecking()),
    setError: error => dispatch(actions.setError(error)),
    setAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUp);

SignUp.propTypes = {
  register: PropTypes.func.isRequired,
  setAuthRedirectPath: PropTypes.func.isRequired,
  beginFormErrorChecking: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  registrationComplete: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  authRedirectPath: PropTypes.string.isRequired,
};
