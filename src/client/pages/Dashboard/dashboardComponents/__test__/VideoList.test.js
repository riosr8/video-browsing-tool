import React from 'react';
import { mount } from 'enzyme';
import VideoList from '../VideoList';

describe('Video List', () => {
  let wrapper;
  const userVideos = [
    {
      userId: 'test@gmail.com',
      videoName: '437b4a03-d2d7-4862-87e4-55ecf555cb47big_buck_bunny.mp4',
      videoUuid: '437b4a03-d2d7-4862-87e4-55ecf555cb47big_buck_bunny.mp4',
      videoLength: '60.095',
      videoThumbnail: '437b4a03-d2d7-4862-87e4-55ecf555cb47big_buck_bunny.png',
    },
  ];
  const mockSetVideoIsVisible = jest.fn();
  const mockSetVideoURL = jest.fn();
  const mockSetDeleteModalToggle = jest.fn();
  const mockShowResultsButton = jest.fn();
  const mockSetProcessRequestModalToggle = jest.fn();
  const mockSetSelectedVideoUUID = jest.fn();
  const mockSetActivePage = jest.fn();
  const mockGetVideos = jest.fn();
  const mockHistory = { push: jest.fn() };
  const selectedVideoUUID = '';
  const requestProcessing = false;

  beforeEach(() => {
    wrapper = mount(
      <VideoList
        userVideos={userVideos}
        setVideoIsVisible={mockSetVideoIsVisible}
        setVideoURL={mockSetVideoURL}
        setDeleteModalToggle={mockSetDeleteModalToggle}
        setProcessRequestModalToggle={mockSetProcessRequestModalToggle}
        setSelectedVideoUUID={mockSetSelectedVideoUUID}
        selectedVideoUUID={selectedVideoUUID}
        requestProcessing={requestProcessing}
        setResultsIsVisible={mockShowResultsButton}
        clearMessage={jest.fn()}
        token="token"
        getResults={jest.fn()}
        totalPages={2}
        history={mockHistory}
        activePage={1}
        setActivePage={mockSetActivePage}
        sortKey=""
        sortOrder="asc"
        getVideos={mockGetVideos}
      />,
    );
  });

  it('should call setDeleteModalToggle to open delete video modal', () => {
    wrapper
      .find('#deleteVideoButton')
      .hostNodes()
      .simulate('click');

    expect(mockSetDeleteModalToggle.mock.calls).toHaveLength(1);
  });

  it('should call setVideoIsVisible to open video player', () => {
    wrapper
      .find('#playVideoButton')
      .hostNodes()
      .simulate('click');

    expect(mockSetVideoIsVisible.mock.calls).toHaveLength(1);
  });

  it('should call setProcessRequestModalToggle to open video player', () => {
    wrapper
      .find('#processVideoButton')
      .hostNodes()
      .simulate('click');

    expect(mockSetProcessRequestModalToggle.mock.calls).toHaveLength(1);
  });

  it('should call setResultsIsVisible to open results view', () => {
    wrapper
      .find('#showResultsButton')
      .hostNodes()
      .simulate('click');

    expect(mockShowResultsButton.mock.calls).toHaveLength(1);
  });

  it('processing button should be in a loading state while processing', () => {
    wrapper.setProps({
      requestProcessing: true,
      selectedVideoUUID: '437b4a03-d2d7-4862-87e4-55ecf555cb47big_buck_bunny.mp4',
    });

    expect(
      wrapper
        .find('#processVideoButton')
        .hostNodes()
        .hasClass('loading'),
    ).toBe(true);
  });

  it('should call setActivePage and getVideos on page change', () => {
    wrapper
      .find('PaginationItem')
      .at(4)
      .simulate('click');
    expect(mockHistory.push.mock.calls).toHaveLength(1);
    expect(mockSetActivePage.mock.calls).toHaveLength(1);
    expect(mockGetVideos.mock.calls).toHaveLength(1);
  });
});
