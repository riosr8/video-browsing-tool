import React from 'react';
import { mount } from 'enzyme';
import ReactPlayer from 'react-player';
import DashboardPlayer from '../DashboardPlayer';

describe('Dashboard Player', () => {
  let wrapper;
  let videoIsVisible = false;
  const mockSetVideoIsVisible = jest.fn(() => {
    videoIsVisible = false;
  });
  const setVideoURL = jest.fn();
  const videoURL = 'http://localhost:5000/video';

  beforeEach(() => {
    wrapper = mount(
      <DashboardPlayer
        videoIsVisible={videoIsVisible}
        setVideoIsVisible={mockSetVideoIsVisible}
        setVideoURL={setVideoURL}
        videoURL={videoURL}
        token="random-token"
      />,
    );
  });

  it('should not display video player', () => {
    expect(wrapper.find(ReactPlayer)).toHaveLength(0);
  });

  it('should display video player', () => {
    wrapper.setProps({ videoIsVisible: true });
    expect(wrapper.find(ReactPlayer)).toHaveLength(1);
  });

  it('should not display video player on close button click', () => {
    wrapper.setProps({ videoIsVisible: true });
    expect(wrapper.find(ReactPlayer)).toHaveLength(1);
    wrapper
      .find('#closeVideoPlayer')
      .hostNodes()
      .simulate('click');
    expect(wrapper.find(ReactPlayer).hostNodes()).toHaveLength(0);
  });
});
