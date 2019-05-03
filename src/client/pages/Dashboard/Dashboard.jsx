import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Segment, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';
import UploadModalForm from './dashboardComponents/UploadModalForm';
import Toolbar from './dashboardComponents/Toolbar';
import VideoList from './dashboardComponents/VideoList';
import NoVideosMessage from './dashboardComponents/NoVideosMessage';
import DashboardPlayer from './dashboardComponents/DashboardPlayer';
import DeleteConfirmationModal from './dashboardComponents/DeleteConfirmationModal';
import ProcessRequestModalForm from './dashboardComponents/ProcessRequestModalForm';
import DashboardResults from './dashboardComponents/DashboardResults';
import ClientMessage from '../../components/ClientMessage/ClientMessage';
import * as actions from '../../actions/index';

export const Dashboard = props => {
  const {
    userVideos,
    algorithms,
    uploading,
    requestProcessing,
    getVideos,
    uploadVideo,
    fetching,
    userId,
    token,
    sendProcessingRequest,
    deleteVideo,
    fetchAlgorithms,
    fetchingResults,
    results,
    getResults,
    error,
    success,
    clearMessage,
    totalPages,
    history,
    location,
    activePage,
    setActivePage,
    sortKey,
    setSortKey,
    sortOrder,
    setSortOrder,
  } = props;

  const [uploadModalToggle, setUploadModalToggle] = useState(false);
  const [deleteModalToggle, setDeleteModalToggle] = useState(false);
  const [processRequestModalToggle, setProcessRequestModalToggle] = useState(false);
  const [videoIsVisible, setVideoIsVisible] = useState(false);
  const [resultsIsVisible, setResultsIsVisible] = useState(false);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [videoURL, setVideoURL] = useState('');
  const [selectedVideoUUID, setSelectedVideoUUID] = useState('');
  const params = new URLSearchParams(location.search);
  // const [activePage, setActivePage] = useState(params.get('page'));

  useEffect(() => {
    const page = params.get('pageNo') ? params.get('pageNo') : 1;
    const key = params.get('sortVal') ? params.get('sortVal') : 'time';
    const order = params.get('order') ? params.get('order') : 'asc';
    setActivePage(parseInt(page));
    setSortKey(key);
    setSortOrder(order);
    getVideos(token, page, key, order);
    clearMessage();
    fetchAlgorithms();
  }, [location]);

  return (
    <Fragment>
      <Container
        style={{
          marginTop: '25px',
        }}
      >
        <Toolbar
          uploadModalToggle={uploadModalToggle}
          setUploadModalToggle={setUploadModalToggle}
          uploading={uploading}
          clearMessage={clearMessage}
          activePage={activePage}
          sortKey={sortKey}
          getVideos={getVideos}
          token={token}
          history={history}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        <ClientMessage error={error} success={success} />
      </Container>
      <Container fluid>
        <DashboardResults
          resultsIsVisible={resultsIsVisible}
          setResultsIsVisible={setResultsIsVisible}
          results={results}
          fetchingResults={fetchingResults}
        />
      </Container>

      <Container
        style={{
          marginTop: '25px',
        }}
      >
        <DashboardPlayer
          videoIsVisible={videoIsVisible}
          setVideoIsVisible={setVideoIsVisible}
          setVideoURL={setVideoURL}
          videoURL={videoURL}
          token={token}
        />
        <UploadModalForm
          uploadModalToggle={uploadModalToggle}
          setUploadModalToggle={setUploadModalToggle}
          uploadVideo={uploadVideo}
          token={token}
          userId={userId}
          activePage={activePage}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />
        <DeleteConfirmationModal
          deleteModalToggle={deleteModalToggle}
          setDeleteModalToggle={setDeleteModalToggle}
          deleteVideo={deleteVideo}
          token={token}
          selectedVideoUUID={selectedVideoUUID}
          activePage={activePage}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />
        <ProcessRequestModalForm
          processRequestModalToggle={processRequestModalToggle}
          setProcessRequestModalToggle={setProcessRequestModalToggle}
          sendProcessingRequest={sendProcessingRequest}
          selectedVideoUUID={selectedVideoUUID}
          token={token}
          userId={userId}
          algorithms={algorithms}
          selectedAlgorithms={selectedAlgorithms}
          setSelectedAlgorithms={setSelectedAlgorithms}
        />
        <Header as="h2">Your Videos</Header>
        <Divider />
        {fetching && <Segment loading={fetching} style={{ height: '500px' }} />}
        {!fetching && userVideos.length > 0 ? (
          <VideoList
            userVideos={userVideos}
            setVideoIsVisible={setVideoIsVisible}
            setResultsIsVisible={setResultsIsVisible}
            setVideoURL={setVideoURL}
            setDeleteModalToggle={setDeleteModalToggle}
            setProcessRequestModalToggle={setProcessRequestModalToggle}
            setSelectedVideoUUID={setSelectedVideoUUID}
            selectedVideoUUID={selectedVideoUUID}
            requestProcessing={requestProcessing}
            getResults={getResults}
            fetchingResults={fetchingResults}
            token={token}
            clearMessage={clearMessage}
            totalPages={totalPages}
            history={history}
            getVideos={getVideos}
            activePage={activePage}
            setActivePage={setActivePage}
            params={params}
            sortKey={sortKey}
            sortOrder={sortOrder}
          />
        ) : null}
        {!fetching && userVideos.length === 0 ? <NoVideosMessage /> : null}
      </Container>
    </Fragment>
  );
};

/* istanbul ignore next */
const mapStateToProps = state => {
  return {
    userVideos: state.dashboard.userVideos,
    uploading: state.dashboard.uploading,
    fetching: state.dashboard.fetching,
    token: state.auth.token,
    userId: state.auth.userId,
    requestProcessing: state.dashboard.requestProcessing,
    fetchingResults: state.dashboard.fetchingResults,
    algorithms: state.dashboard.algorithms,
    results: state.dashboard.results,
    error: state.dashboard.error,
    success: state.dashboard.success,
    totalPages: state.dashboard.totalPages,
    activePage: state.dashboard.activePage,
    sortKey: state.dashboard.sortKey,
    sortOrder: state.dashboard.sortOrder,
  };
};
/* istanbul ignore next */
const mapDispatchToProps = dispatch => {
  return {
    getVideos: (token, pageNo, sortKey, sortOrder) => {
      dispatch(actions.getVideos(token, pageNo, sortKey, sortOrder));
    },
    uploadVideo: (data, token, pageNo, sortKey, sortOrder) => {
      dispatch(actions.uploadVideo(data, token, pageNo, sortKey, sortOrder));
    },
    sendProcessingRequest: (data, token, userId) => {
      dispatch(actions.sendProcessingRequest(data, token, userId));
    },
    deleteVideo: (token, uuid, pageNo, sortKey, sortOrder) => {
      dispatch(actions.deleteVideo(token, uuid, pageNo, sortKey, sortOrder));
    },
    fetchAlgorithms: () => dispatch(actions.getAlgorithms()),
    getResults: (token, uuid) => dispatch(actions.getResults(token, uuid)),
    clearMessage: () => dispatch(actions.clearMessage()),
    setActivePage: activePage => dispatch(actions.setActivePage(activePage)),
    setSortKey: sortKey => dispatch(actions.setSortKey(sortKey)),
    setSortOrder: sortOrder => dispatch(actions.setSortOrder(sortOrder)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard);

Dashboard.propTypes = {
  getVideos: PropTypes.func.isRequired,
  deleteVideo: PropTypes.func.isRequired,
  uploadVideo: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  sendProcessingRequest: PropTypes.func.isRequired,
  fetchAlgorithms: PropTypes.func.isRequired,
  userVideos: PropTypes.array.isRequired,
  algorithms: PropTypes.array.isRequired,
  uploading: PropTypes.bool.isRequired,
  requestProcessing: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  fetchingResults: PropTypes.bool.isRequired,
  getResults: PropTypes.func.isRequired,
  results: PropTypes.object,
  userId: PropTypes.string,
  token: PropTypes.string,
  error: PropTypes.string,
  success: PropTypes.string,
  totalPages: PropTypes.number.isRequired,
  setActivePage: PropTypes.func.isRequired,
  activePage: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  sortKey: PropTypes.string.isRequired,
  setSortKey: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  setSortOrder: PropTypes.func.isRequired,
};
