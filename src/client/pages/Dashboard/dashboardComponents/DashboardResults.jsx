import React, { useState } from 'react';
import {
  Transition,
  Button,
  Icon,
  Grid,
  Dropdown,
  Segment,
  Header,
  Container,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import VideoResult from './resultsComponents/VideoResult';
import ChartResult from './resultsComponents/ChartResult';

const DashboardResults = props => {
  const { resultsIsVisible, setResultsIsVisible, fetchingResults, results } = props;

  if (!resultsIsVisible) {
    return null;
  }

  if (fetchingResults) {
    return (
      <Transition.Group animation="slide down" duration="300">
        <Container style={{ marginTop: '2%' }}>
          <Segment loading placeholder />
        </Container>
      </Transition.Group>
    );
  }

  if (results.results.length === 0) {
    return (
      <Transition.Group animation="slide down" duration="300">
        <Container style={{ marginTop: '2%' }}>
          <Button
            id="closeVideoPlayer"
            icon
            color="red"
            onClick={() => {
              setResultsIsVisible(false);
            }}
          >
            <Icon name="close" size="small" />
          </Button>
          <Segment placeholder>
            <Header
              icon
              content="No results available. Please submit a processing request first."
            />
          </Segment>
        </Container>
      </Transition.Group>
    );
  }
  const [selectedResult, setSelectedResult] = useState(results.results[0].value);

  return (
    <Transition.Group animation="slide down" duration="300">
      {resultsIsVisible && (
        <Grid stackable centered style={{ marginLeft: '2%', marginRight: '2%', marginTop: '2%' }}>
          <Grid.Row columns={2}>
            <Grid.Column>
              <Button
                id="closeVideoPlayer"
                icon
                color="red"
                onClick={() => {
                  setResultsIsVisible(false);
                }}
              >
                <Icon name="close" size="small" />
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Dropdown
                placeholder="Choose an algorithm"
                fluid
                selection
                value={selectedResult}
                options={results.results}
                onChange={(e, data) => {
                  e.preventDefault();
                  setSelectedResult(data.value);
                }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
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
                  url={`http://localhost:5000/noAuth/videos/${results.videoUuid}`}
                  controls
                  width="100%"
                  height="100%"
                />
              </div>
            </Grid.Column>
            <Grid.Column>
              {results.results
                .filter(algo => algo.id === selectedResult)
                .map(algo => {
                  switch (algo.type) {
                    case 'video':
                      return <VideoResult key={algo.id} url={algo.result} />;
                    case '2Ddata':
                      return <ChartResult key={algo.id} data={algo.result} chartType="2Ddata" />;
                    case 'histogram':
                      return <ChartResult key={algo.id} data={algo.result} chartType="histogram" />;
                    default:
                      return null;
                  }
                })}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
    </Transition.Group>
  );
};

DashboardResults.propTypes = {
  resultsIsVisible: PropTypes.bool.isRequired,
  setResultsIsVisible: PropTypes.func.isRequired,
  fetchingResults: PropTypes.bool.isRequired,
  results: PropTypes.object,
};

export default DashboardResults;
