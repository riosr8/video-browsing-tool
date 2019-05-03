import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

const VideoResult = props => {
  const { url } = props;

  return (
    <React.Fragment>
      <div
        style={{
          paddingTop: '56.25%',
          position: 'relative',
        }}
      >
        <ReactPlayer
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
          }}
          url={url}
          controls
          width="100%"
          height="100%"
        />
      </div>
    </React.Fragment>
  );
};

export default VideoResult;

VideoResult.propTypes = {
  url: PropTypes.string.isRequired,
};
