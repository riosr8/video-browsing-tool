import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Aux from '../Auxdir/Auxfile';
import NavBar from '../../components/NavBar/NavBar';

const Layout = props => {
  const { children, isAuthenticated, userId, activePage, sortKey, sortOrder } = props;
  return (
    <Aux>
      <NavBar
        isAuthenticated={isAuthenticated}
        userId={userId}
        activePage={activePage}
        sortKey={sortKey}
        sortOrder={sortOrder}
      />
      <main>{children}</main>
    </Aux>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    userId: state.auth.userId,
    activePage: state.dashboard.activePage,
    sortKey: state.dashboard.sortKey,
    sortOrder: state.dashboard.sortOrder,
  };
};

export default connect(mapStateToProps)(Layout);

Layout.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  activePage: PropTypes.number.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
};
