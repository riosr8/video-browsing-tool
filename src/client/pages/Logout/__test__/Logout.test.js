import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import { Logout } from '../Logout';

describe('Logout', () => {
  const logout = jest.fn();

  const getWrapper = () => {
    const getLogoutComponent = () => <Logout logout={logout} />;
    const wrapper = mount(
      <MemoryRouter initialEntries={['/results']} initialIndex={0}>
        <Route exact component={() => getLogoutComponent()} />
      </MemoryRouter>,
    );
    return wrapper;
  };

  it('should redirect to home', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('component').props().location.pathname).toBe('/');
  });
});
