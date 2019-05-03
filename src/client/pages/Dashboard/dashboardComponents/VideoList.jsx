import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Item, Button, Icon, Pagination, Grid } from 'semantic-ui-react';

const VideoList = props => {
  const {
    userVideos,
    setVideoIsVisible,
    setResultsIsVisible,
    setVideoURL,
    setDeleteModalToggle,
    setProcessRequestModalToggle,
    requestProcessing,
    setSelectedVideoUUID,
    selectedVideoUUID,
    getResults,
    clearMessage,
    token,
    totalPages,
    history,
    getVideos,
    activePage,
    setActivePage,
    sortOrder,
    sortKey,
  } = props;
  const urlVideoPrefix = 'http://localhost:5000/noAuth/videos/';
  const urlImagePrefix = 'http://localhost:5000/noAuth/thumbnail/';
  return (
    <Fragment>
      <Item.Group divided style={{ minHeight: '65vh' }}>
        {userVideos.map(video => {
          const date = new Date(null);
          date.setSeconds(video.videoLength);
          return (
            <Item key={video.videoUuid}>
              <Item.Image src={urlImagePrefix + video.videoThumbnail} />

              <Item.Content>
                <Item.Header>{video.videoName}</Item.Header>
                <Item.Meta>
                  <span>Length: {date.toISOString().substr(11, 8)}</span>
                </Item.Meta>
                <Item.Description>
                  {`Upload Date: ${new Date(parseInt(video.time)).toDateString()}`}
                </Item.Description>
                <Item.Description>{video.videoDescription}</Item.Description>
                <Item.Extra>
                  <Button
                    id="processVideoButton"
                    loading={requestProcessing && selectedVideoUUID === video.videoUuid}
                    value={video.videoUuid}
                    primary
                    floated="right"
                    onClick={(e, data) => {
                      e.preventDefault();
                      clearMessage();
                      setSelectedVideoUUID(data.value);
                      setVideoIsVisible(false);
                      setResultsIsVisible(false);
                      setProcessRequestModalToggle(true);
                    }}
                  >
                    Process
                    <Icon name="right chevron" />
                  </Button>
                  <Button
                    id="playVideoButton"
                    secondary
                    value={video.videoUuid}
                    floated="right"
                    onClick={(e, data) => {
                      e.preventDefault();
                      clearMessage();
                      setVideoURL(urlVideoPrefix + data.value);
                      setResultsIsVisible(false);
                      setVideoIsVisible(true);
                    }}
                  >
                    <Icon name="play" />
                    Play
                  </Button>
                  <Button
                    id="deleteVideoButton"
                    value={video.videoUuid}
                    negative
                    floated="right"
                    onClick={(e, data) => {
                      e.preventDefault();
                      clearMessage();
                      setSelectedVideoUUID(data.value);
                      setResultsIsVisible(false);
                      setVideoIsVisible(false);
                      setDeleteModalToggle(true);
                    }}
                  >
                    <Icon name="delete" />
                    Delete
                  </Button>
                  <Button
                    id="showResultsButton"
                    value={video.videoUuid}
                    floated="right"
                    onClick={(e, data) => {
                      e.preventDefault();
                      clearMessage();
                      getResults(token, data.value);
                      setVideoIsVisible(false);
                      setResultsIsVisible(true);
                    }}
                  >
                    <Icon name="chart bar" />
                    Results
                  </Button>
                </Item.Extra>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
      <Grid centered>
        <Pagination
          activePage={activePage}
          totalPages={totalPages}
          onPageChange={(e, data) => {
            e.preventDefault();
            history.push({
              pathname: '/dashboard',
              search: `?pageNo=${data.activePage}&sortVal=${sortKey}&order=${sortOrder}`,
            });
            setActivePage(data.activePage);
            getVideos(token, data.activePage);
          }}
          style={{ marginBottom: '2em' }}
        />
      </Grid>
    </Fragment>
  );
};

export default VideoList;

VideoList.propTypes = {
  userVideos: PropTypes.array.isRequired,
  setResultsIsVisible: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  setVideoIsVisible: PropTypes.func.isRequired,
  setVideoURL: PropTypes.func.isRequired,
  setDeleteModalToggle: PropTypes.func.isRequired,
  setProcessRequestModalToggle: PropTypes.func.isRequired,
  setSelectedVideoUUID: PropTypes.func.isRequired,
  selectedVideoUUID: PropTypes.string.isRequired,
  requestProcessing: PropTypes.bool.isRequired,
  getResults: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  totalPages: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  getVideos: PropTypes.func.isRequired,
  activePage: PropTypes.number.isRequired,
  setActivePage: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
};
