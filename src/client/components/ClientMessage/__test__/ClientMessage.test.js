import React from 'react';
import { mount } from 'enzyme';
import { Message } from 'semantic-ui-react';
import ClientMessage from '../ClientMessage';

describe('Client Message', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<ClientMessage success={null} error={null} />);
  });

  it('should return nothing', () => {
    expect(wrapper.children()).toHaveLength(0);
  });

  it('should return message with positive prop', () => {
    wrapper.setProps({ success: 'positive' });
    expect(wrapper.find(Message).props().negative).toBe(false);
    expect(wrapper.find(Message).props().positive).toBe(true);
  });

  it('should return message with negative prop', () => {
    wrapper.setProps({ error: 'error' });
    expect(wrapper.find(Message).props().positive).toBe(false);
    expect(wrapper.find(Message).props().negative).toBe(true);
  });
});
