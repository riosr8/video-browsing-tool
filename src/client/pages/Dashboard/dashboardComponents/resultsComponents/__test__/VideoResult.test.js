import React from 'react';
import ReactDOM from 'react-dom';
import VideoResult from '../VideoResult';

describe('VideoResult renders without crashing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<VideoResult url="test-url" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
