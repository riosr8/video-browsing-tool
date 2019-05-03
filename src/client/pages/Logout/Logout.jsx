import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from '../../actions';

export const Logout = props => {
  useEffect(() => {
    props.logout();
  }, []);

  return <Redirect to="/" />;
};

/* istanbul ignore next */
const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.logout()),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(Logout);

Logout.propTypes = {
  logout: PropTypes.func.isRequired,
};
