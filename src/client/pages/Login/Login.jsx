import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Switch } from 'react-router-dom';
import { Button, Form, Grid, Header, Segment, Container, Message } from 'semantic-ui-react';
import * as actions from '../../actions/index';
// import uhLogo from '../../static/images/uhLogo.png';

export const Login = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {
    loading,
    error,
    authRedirectPath,
    isAuthenticated,
    registering,
    setAuthRedirectPath,
    registrationComplete,
    resetRegistrationCompleted,
    setError,
  } = props;
  let hasError = false;

  useEffect(() => {
    if (registrationComplete) {
      resetRegistrationCompleted();
    }

    if (!registering && authRedirectPath !== '/') {
      setError(null);
      setAuthRedirectPath();
    }
  }, []);

  if (error != null) {
    hasError = true;
  }

  let authRedirect = null;
  if (isAuthenticated) {
    authRedirect = (
      <Switch>
        <Redirect exact from="/login" to={authRedirectPath} />
      </Switch>
    );
  }

  const login = e => {
    e.preventDefault();
    props.onAuth(email, password);
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
              Log-in to your account
            </Header>
            <Form id="loginForm" size="large" loading={loading} error={hasError} onSubmit={login}>
              <Segment stacked>
                <Form.Input
                  id="emailInput"
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Email"
                  onChange={e => setEmail(e.target.value)}
                />
                <Form.Input
                  id="passwordInput"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  onChange={e => setPassword(e.target.value)}
                />
                {error && <Message id="errorMessage" error header={error} />}

                <Button color="red" fluid size="large">
                  Login
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
    registering: state.auth.registering,
    registrationComplete: state.auth.registrationComplete,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    authRedirectPath: state.auth.authRedirectPath,
  };
};
/* istanbul ignore next */
const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password) => dispatch(actions.auth(email, password)),
    setAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
    resetRegistrationCompleted: () => dispatch(actions.resetRegistrationCompleted()),
    setError: error => dispatch(actions.setError(error)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

Login.propTypes = {
  setAuthRedirectPath: PropTypes.func.isRequired,
  onAuth: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  registering: PropTypes.bool.isRequired,
  resetRegistrationCompleted: PropTypes.func.isRequired,
  registrationComplete: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  isAuthenticated: PropTypes.bool.isRequired,
  authRedirectPath: PropTypes.string.isRequired,
};
