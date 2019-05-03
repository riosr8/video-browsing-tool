import React, { useEffect } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConnectedHome from '../pages/Home/Home';
import ConnectedDashboard from '../pages/Dashboard/Dashboard';
import ConnectedLogin from '../pages/Login/Login';
import ConnectedProcessStatus from '../pages/ProcessStatus/ProcessStatus';
import ConnectedSignUp from '../pages/SignUp/SignUp';
import Layout from '../hoc/Layout/Layout';
import ConnectedLogout from '../pages/Logout/Logout';
import * as actions from '../actions/index';

const App = props => {
  const { checkAuthState, isAuthenticated, activePage, sortKey, sortOrder } = props;
  useEffect(() => {
    checkAuthState();
  }, []);

  let routes = (
    <Switch>
      <Route exact path="/" component={ConnectedHome} />
      <Route path="/login" component={ConnectedLogin} />
      <Route path="/signup" component={ConnectedSignUp} />
      <Redirect to="/login" />
    </Switch>
  );

  if (isAuthenticated) {
    routes = (
      <Switch>
        <Route exact path="/" component={ConnectedHome} />
        <Route path="/dashboard" component={ConnectedDashboard} />
        <Route path="/process-status" component={ConnectedProcessStatus} />
        <Route path="/logout" component={ConnectedLogout} />
        <Redirect to={`/dashboard?pageNo=${activePage}&sortVal=${sortKey}&order=${sortOrder}`} />
      </Switch>
    );
  }

  return (
    <React.Fragment>
      <Layout>{routes}</Layout>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    activePage: state.dashboard.activePage,
    sortKey: state.dashboard.sortKey,
    sortOrder: state.dashboard.sortOrder,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    checkAuthState: () => dispatch(actions.checkAuthState()),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(App),
);

App.propTypes = {
  checkAuthState: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  activePage: PropTypes.number.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
};
