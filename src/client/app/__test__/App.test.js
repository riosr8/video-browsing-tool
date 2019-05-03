import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import App from '../App';

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

describe('App root', () => {
  tests.forEach(test => {
    it(test.testName, () => {
      const fakeRoute = {
        routes: [
          {
            path: '/',
            exact: true,
            component: () => (
              <div>
                <h1>App root</h1>
              </div>
            ),
          },
        ],
      };

      const tree = renderer
        .create(
          <Provider store={test.fakeStore}>
            <MemoryRouter>
              <App route={fakeRoute} />
            </MemoryRouter>
          </Provider>,
        )
        .toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
