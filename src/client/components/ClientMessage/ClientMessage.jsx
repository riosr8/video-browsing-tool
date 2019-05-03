import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';

const ClientMessage = props => {
  const { error, success } = props;

  const renderMessage = (messageType, content) => {
    return (
      <Message positive={messageType === 'positive'} negative={messageType === 'negative'}>
        <Message.Header>{content}</Message.Header>
      </Message>
    );
  };

  if (error) {
    return renderMessage('negative', error);
  }

  if (success) {
    return renderMessage('positive', success);
  }

  return null;
};

ClientMessage.propTypes = {
  success: PropTypes.string,
  error: PropTypes.string,
};

export default ClientMessage;
