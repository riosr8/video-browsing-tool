import React from 'react';
import ReactDOM from 'react-dom';
import ChartResult from '../ChartResult';

describe('ChartResult renders without crashing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ChartResult data={[]} chartType="2Ddata" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
