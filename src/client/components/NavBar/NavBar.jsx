import React from 'react';
import PropTypes from 'prop-types';
import { Container, Menu, Responsive } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

const NavBar = props => {
  const { isAuthenticated, userId, activePage, sortKey, sortOrder } = props;
  return (
    <Responsive>
      <Menu attached="top" inverted style={{ backgroundColor: '#e11b37' }} size="huge">
        <Container>
          <Menu.Item header>Behaviorics</Menu.Item>
          <Menu.Item as={NavLink} to="/" exact>
            Home
          </Menu.Item>
          {isAuthenticated ? (
            <React.Fragment>
              <Menu.Item
                as={NavLink}
                to={`/dashboard?pageNo=${activePage}&sortVal=${sortKey}&order=${sortOrder}`}
              >
                Dashboard
              </Menu.Item>
              <Menu.Item as={NavLink} to="/process-status">
                Process Status
              </Menu.Item>
            </React.Fragment>
          ) : null}

          {!isAuthenticated ? (
            <Menu.Menu position="right">
              <Menu.Item as={NavLink} to="/signup">
                Sign Up
              </Menu.Item>
              <Menu.Item as={NavLink} to="/login">
                Log In
              </Menu.Item>
            </Menu.Menu>
          ) : (
            <Menu.Menu position="right">
              <Menu.Item content={`Signed in as ${userId}`} />
              <Menu.Item as={NavLink} to="/logout">
                Log Out
              </Menu.Item>
            </Menu.Menu>
          )}
        </Container>
      </Menu>
    </Responsive>
  );
};

export default NavBar;

NavBar.propTypes = {
  isAuthenticated: PropTypes.bool,
  userId: PropTypes.string,
  activePage: PropTypes.number.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
};
