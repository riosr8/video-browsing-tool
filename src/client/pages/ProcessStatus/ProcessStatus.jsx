import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Icon, Header, Segment, List } from 'semantic-ui-react';
import useInterval from 'react-useinterval';
import * as actions from '../../actions/index';

export const ProcessStatus = props => {
  const { status, polling, token, pollStatus } = props;

  useEffect(() => {
    pollStatus(token);
  }, []);

  useInterval(pollStatus, 5000, token);

  let processed = null;
  let processing = null;
  let toBeProcessed = null;
  if (status.processed.length > 0) {
    processed = (
      <Segment loading={polling}>
        <List divided verticalAlign="middle" size="large">
          {status.processed.map(listItem => {
            return (
              <List.Item key={`${listItem.id}-${listItem.algo}`}>
                <List.Header content={`${listItem.name}`} />
                <List.Description content={`Algorithm: ${listItem.algo}`} />
              </List.Item>
            );
          })}
        </List>
      </Segment>
    );
  } else {
    processed = (
      <Segment placeholder loading={polling}>
        <Header icon>
          <Icon name="file video outline" />
          You have no videos that have been processed.
        </Header>
      </Segment>
    );
  }

  if (status.processing.length > 0) {
    processing = (
      <Segment loading={polling}>
        <List divided verticalAlign="middle" size="large">
          {status.processing.map(listItem => {
            return (
              <List.Item key={`${listItem.id}-${listItem.algo}`}>
                <List.Header content={`${listItem.name}`} />
                <List.Description content={`Algorithm: ${listItem.algo}`} />
              </List.Item>
            );
          })}
        </List>
      </Segment>
    );
  } else {
    processing = (
      <Segment placeholder loading={polling}>
        <Header icon>
          <Icon name="file video outline" />
          You have no videos currently processing.
        </Header>
      </Segment>
    );
  }

  if (status.toBeProcessed.length > 0) {
    toBeProcessed = (
      <Segment loading={polling}>
        <List divided verticalAlign="middle" size="large">
          {status.toBeProcessed.map(listItem => {
            return (
              <List.Item key={`${listItem.id}-${listItem.algo}`}>
                <List.Header content={`${listItem.name}`} />
                <List.Description content={`Algorithm: ${listItem.algo}`} />
              </List.Item>
            );
          })}
        </List>
      </Segment>
    );
  } else {
    toBeProcessed = (
      <Segment placeholder loading={polling}>
        <Header icon>
          <Icon name="file video outline" />
          You have no pending video processing requests.
        </Header>
      </Segment>
    );
  }

  return (
    <Container
      style={{
        marginTop: '25px',
        marginBottom: '2em',
      }}
    >
      <Header as="h1">To Be Processed </Header>
      {toBeProcessed}
      <Header as="h1">Processing </Header>
      {processing}
      <Header as="h1">Processed </Header>
      {processed}
    </Container>
  );
};

/* istanbul ignore next */
const mapStateToProps = state => {
  return {
    token: state.auth.token,
    polling: state.processStatus.polling,
    status: state.processStatus.status,
  };
};
/* istanbul ignore next */
const mapDispatchToProps = dispatch => {
  return {
    pollStatus: token => dispatch(actions.pollStatus(token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProcessStatus);

ProcessStatus.propTypes = {
  status: PropTypes.object.isRequired,
  polling: PropTypes.bool.isRequired,
  token: PropTypes.string,
  pollStatus: PropTypes.func.isRequired,
};
