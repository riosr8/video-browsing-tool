import reducer, { initialState } from '../processStatus';
import * as actions from '../../actions/processStatus';

const status = [
  {
    toBeProcessed: ['Algorithm 2', 'Algorithm 3', 'Algorithm 1'],
    processed: ['Algorithm 2', 'Algorithm 3', 'Algorithm 1'],
    processing: ['Algorithm 2', 'Algorithm 3', 'Algorithm 1'],
    _id: '5ca43317e04d0b0037360113',
    videoUuid: '4bfe8a99-b6bc-44f0-b92d-9451dff10ca1big_buck_bunny.mp4',
    __v: 0,
  },
];

const tests = [
  { name: 'should hanlde POLL_STATUS_START', action: actions.pollStatusStart },
  {
    name: 'should handle POLL_STATUS_SUCCESS',
    action: () => {
      return actions.pollStatusSuccess(status);
    },
  },
  {
    name: 'should handle POLL_STATUS_FAIL',
    action: () => {
      return actions.pollStatusFail('fail');
    },
  },
];

describe('Process Status reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  tests.forEach(test => {
    it(test.name, () => {
      expect(reducer(initialState, test.action())).toMatchSnapshot();
    });
  });
});
