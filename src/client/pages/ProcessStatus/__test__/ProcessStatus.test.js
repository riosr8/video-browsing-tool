import React from 'react';
import ReactDOM from 'react-dom';
import { ProcessStatus } from '../ProcessStatus';

describe('ProcessStatus', () => {
  it('renders with items', () => {
    const div = document.createElement('div');
    const status = {
      processed: [
        {
          name: '4bfe8a99-b6bc-44f0-b92d-9451dff10ca1big_buck_bunny.mp4',
          id: '4bfe8a99-b6bc-44f0-b92d-9451dff10ca1big_buck_bunny.mp4',
          algo: 'Algorithm 2',
        },
      ],
      processing: [
        {
          name: '4bfe8a99-b6bc-44f0-b92d-9451dff10ca1big_buck_bunny.mp4',
          id: '4bfe8a99-b6bc-44f0-b92d-9451dff10ca1big_buck_bunny.mp4',
          algo: 'Algorithm 2',
        },
      ],
      toBeProcessed: [
        {
          name: '4bfe8a99-b6bc-44f0-b92d-9451dff10ca1big_buck_bunny.mp4',
          id: '4bfe8a99-b6bc-44f0-b92d-9451dff10ca1big_buck_bunny.mp4',
          algo: 'Algorithm 2',
        },
      ],
    };
    ReactDOM.render(
      <ProcessStatus status={status} polling={false} pollStatus={jest.fn()} token="token" />,
      div,
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders without items', () => {
    const div = document.createElement('div');
    const status = {
      processed: [],
      processing: [],
      toBeProcessed: [],
    };
    ReactDOM.render(
      <ProcessStatus status={status} polling={false} pollStatus={jest.fn()} token="token" />,
      div,
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
