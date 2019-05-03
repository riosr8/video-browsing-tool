import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Home } from '../Home';

describe('Homepage get started Button', () => {
  const wrapper = mount(
    <MemoryRouter>
      <Home isAuthenticated={false} />
    </MemoryRouter>,
  );
  it('get started Button redirect to signup', () => {
    expect(
      wrapper
        .find('NavLink')
        .at(0)
        .prop('to'),
    ).toBe('/signup');
  });
});
