import reducer, { initialState } from '../dashboard';
import * as actions from '../../actions/dashboard';
import { logout } from '../../actions/auth';

const userVideos = [
  {
    _id: '5c8f0e406745e00852125e82',
    userId: 'test@gmail.com',
    videoName: '437b4a03-d2d7-4862-87e4-55ecf555cb47big_buck_bunny.mp4',
    videoUuid: '437b4a03-d2d7-4862-87e4-55ecf555cb47big_buck_bunny.mp4',
    videoLength: '60.095',
    videoThumbnail: '437b4a03-d2d7-4862-87e4-55ecf555cb47big_buck_bunny.png',
    __v: 0,
  },
];

const results = [
  {
    videoUuid: '437b4a03-d2d7-4862-87e4-55ecf555cb47big_buck_bunny.mp4',
  },
];

const tests = [
  { name: 'should handle FETCH_RESULTS_START', action: actions.fetchResultsStart },
  {
    name: 'should handle FETCH_RESULTS_SUCCESS',
    action: () => {
      return actions.fetchResultsSuccess(results);
    },
  },
  {
    name: 'should handle FETCH_RESULTS_FAIL',
    action: () => {
      return actions.fetchResultsFail('fail');
    },
  },
  { name: 'should handle FETCH_VIDEOS_START', action: actions.fetchVideosStart },
  {
    name: 'should handle FETCH_VIDEOS_SUCCESS',
    action: () => {
      return actions.fetchVideosSuccess(userVideos);
    },
  },
  {
    name: 'should handle FETCH_VIDEOS_FAIL',
    action: () => {
      return actions.fetchVideosFail('fail');
    },
  },
  { name: 'should handle UPLOAD_VIDEO_START', action: actions.uploadVideoStart },
  {
    name: 'should handle UPLOAD_VIDEO_SUCCESS',
    action: () => {
      return actions.uploadVideoSuccess('success');
    },
  },
  {
    name: 'should handle UPLOAD_VIDEO_FAIL',
    action: () => {
      return actions.uploadVideoFail('fail');
    },
  },
  { name: 'should handle REQUEST_PROCESSING_START', action: actions.requestProcessingStart },
  {
    name: 'should handle REQUEST_PROCESSING_SUCCESS',
    action: () => {
      return actions.requestProcessingSuccess('success');
    },
  },
  {
    name: 'should handle REQUEST_PROCESSING_FAIL',
    action: () => {
      return actions.requestProcessingFail('fail');
    },
  },
  { name: 'should handle DELETE_VIDEO_START', action: actions.deleteVideoStart },
  {
    name: 'should handle DELETE_VIDEO_SUCCESS',
    action: () => {
      return actions.deleteVideoSuccess('success');
    },
  },
  {
    name: 'should handle DELETE_VIDEO_FAIL',
    action: () => {
      return actions.deleteVideoFail('fail');
    },
  },
  { name: 'should handle AUTH_LOGOUT', action: logout },
  { name: 'should handle FETCH_ALGORITHMS_START', action: actions.fetchAlgorithmsStart },
  {
    name: 'should handle FETCH_ALGORITHMS_SUCCESS',
    action: () => {
      return actions.fetchAlgorithmsSuccess('success');
    },
  },
  {
    name: 'should handle FETCH_ALGORITHMS_FAIL',
    action: () => {
      return actions.fetchAlgorithmsFail('fail');
    },
  },
  {
    name: 'should handle CLEAR_MESSAGE',
    action: () => {
      return actions.clearMessage();
    },
  },
  {
    name: 'should handle SET_ACTIVE_PAGE',
    action: () => {
      return actions.setActivePage();
    },
  },
  {
    name: 'should handle SET_SORT_KEY',
    action: () => {
      return actions.setSortKey();
    },
  },
  {
    name: 'should handle SET_SORT_ORDER',
    action: () => {
      return actions.setSortOrder();
    },
  },
];

describe('Dashboard reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  tests.forEach(test => {
    it(test.name, () => {
      expect(reducer(initialState, test.action())).toMatchSnapshot();
    });
  });
});
