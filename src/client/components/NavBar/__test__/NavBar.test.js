import React from 'react';
import { mount } from 'enzyme';
import ReactDOM from 'react-dom';
import { MemoryRouter, Route } from 'react-router-dom';
import NavBar from '../NavBar';

describe('Navbar Canary Test', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MemoryRouter>
        <NavBar isAuthenticated activePage={1} sortKey="time" sortOrder="asc" />
      </MemoryRouter>,
      div,
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
describe('Navbar Redirect', () => {
  const getWrapper = isAuthenticated => {
    const getLoginComponent = isAuth => (
      <NavBar isAuthenticated={isAuth} activePage={1} sortKey="time" sortOrder="asc" />
    );
    const wrapper = mount(
      <MemoryRouter initialEntries={['/login']} initialIndex={0}>
        <Route exact component={() => getLoginComponent(isAuthenticated)} />
      </MemoryRouter>,
    );
    return wrapper;
  };

  it('Authorized Home button redirect to Home', () => {
    const wrapper = getWrapper(true);
    expect(
      wrapper
        .find('NavLink')
        .at(0)
        .prop('to'),
    ).toBe('/');
  });
  it('!Authorized Home button redirect to Home', () => {
    const wrapper = getWrapper(false);
    expect(
      wrapper
        .find('NavLink')
        .at(0)
        .prop('to'),
    ).toBe('/');
  });
  // Authorized
  it('Authorized Dashboard button redirect to Dashboard', () => {
    const wrapper = getWrapper(true);
    expect(
      wrapper
        .find('NavLink')
        .at(1)
        .prop('to'),
    ).toBe('/dashboard?pageNo=1&sortVal=time&order=asc');
  });
  it('Authorized Process-Status button redirect to Process-Status', () => {
    const wrapper = getWrapper(true);
    expect(
      wrapper
        .find('NavLink')
        .at(2)
        .prop('to'),
    ).toBe('/process-status');
  });
  it('Authorized Logout button redirect to Logout', () => {
    const wrapper = getWrapper(true);
    expect(
      wrapper
        .find('NavLink')
        .at(3)
        .prop('to'),
    ).toBe('/logout');
  });
  // unAuthorized
  it('!Authorized Signup button redirect to Signup', () => {
    const wrapper = getWrapper(false);
    expect(
      wrapper
        .find('NavLink')
        .at(1)
        .prop('to'),
    ).toBe('/signup');
  });
  it('!Authorized Login button redirect to Login', () => {
    const wrapper = getWrapper(false);
    expect(
      wrapper
        .find('NavLink')
        .at(2)
        .prop('to'),
    ).toBe('/login');
  });
});
