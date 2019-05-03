import React from 'react';
import { Modal, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const DeleteConfirmationModal = props => {
  const {
    deleteModalToggle,
    setDeleteModalToggle,
    deleteVideo,
    token,
    selectedVideoUUID,
    activePage,
    sortOrder,
    sortKey,
  } = props;
  if (!deleteModalToggle) {
    return null;
  }

  const handleOnCancelDelete = () => {
    setDeleteModalToggle(false);
  };

  const handleOnConfirmDelete = () => {
    deleteVideo(token, selectedVideoUUID, activePage, sortKey, sortOrder);
    setDeleteModalToggle(false);
  };

  return (
    <Modal open={deleteModalToggle} centered={false}>
      <Modal.Header>Delete Video</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>Are you sure you want to delete this video?</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          id="cancelDeleteVideo"
          color="red"
          inverted
          onClick={() => {
            handleOnCancelDelete();
          }}
        >
          <Icon name="remove" /> No
        </Button>
        <Button
          id="confirmDeleteVideo"
          color="green"
          inverted
          onClick={() => {
            handleOnConfirmDelete();
          }}
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

DeleteConfirmationModal.propTypes = {
  deleteModalToggle: PropTypes.bool.isRequired,
  setDeleteModalToggle: PropTypes.func.isRequired,
  deleteVideo: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  selectedVideoUUID: PropTypes.string.isRequired,
  activePage: PropTypes.number.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
};

export default DeleteConfirmationModal;
