/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { Transition, Icon, Button } from 'semantic-ui-react';
import ReactPlayer from 'react-player';
// import Hls from "hls.js";

const DashboardPlayer = props => {
  const { videoIsVisible, setVideoIsVisible, videoURL, setVideoURL, token } = props;
  // eslint-disable-next-line no-console
  // console.log(videoURL)
  // console.log(Hls.isSupported());
  return (
    <Transition.Group animation="slide down" duration={500}>
      {videoIsVisible && (
        <Button
          id="closeVideoPlayer"
          icon
          color="red"
          onClick={() => {
            setVideoIsVisible(false);
            setVideoURL('');
          }}
        >
          <Icon name="close" size="small" />
        </Button>
      )}
      {videoIsVisible && (
        <ReactPlayer
          style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}
          url={videoURL}
          controls
        />
      )}
    </Transition.Group>
  );
};

export default DashboardPlayer;

DashboardPlayer.propTypes = {
  videoIsVisible: PropTypes.bool.isRequired,
  setVideoIsVisible: PropTypes.func.isRequired,
  setVideoURL: PropTypes.func.isRequired,
  videoURL: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};
