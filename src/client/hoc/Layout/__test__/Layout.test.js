import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import Layout from '../Layout';

const tests = [
  {
    testName: 'should render without crashing if token present',

    fakeStore: {
      default: () => {},
      subscribe: () => {},
      dispatch: () => {},
      getState: () => ({
        auth: { token: 'token' },
        dashboard: { activePage: 1, sortKey: 'time', sortOrder: 'asc' },
      }),
    },
  },
  {
    testName: 'should render without crashing if no token present',

    fakeStore: {
      default: () => {},
      subscribe: () => {},
      dispatch: () => {},
      getState: () => ({
        auth: { token: null },
        dashboard: { activePage: 1, sortKey: 'time', sortOrder: 'asc' },
      }),
    },
  },
];

describe('Layout HOC', () => {
  tests.forEach(test => {
    it(test.testName, () => {
      const tree = renderer
        .create(
          <Provider store={test.fakeStore}>
            <MemoryRouter>
              <Layout>
                <div>Test</div>
              </Layout>
            </MemoryRouter>
          </Provider>,
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
