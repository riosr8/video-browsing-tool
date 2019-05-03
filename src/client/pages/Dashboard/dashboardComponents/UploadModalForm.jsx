import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Form, TextArea } from 'semantic-ui-react';

const UploadModalForm = props => {
  const [videoName, setVideoName] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const {
    uploadModalToggle,
    uploadVideo,
    setUploadModalToggle,
    token,
    activePage,
    sortOrder,
    sortKey,
  } = props;
  if (!uploadModalToggle) {
    return null;
  }

  const closeModal = () => {
    setUploadModalToggle(false);
    setVideoName('');
    setVideoDescription('');
    setVideoFile(null);
  };

  return (
    <Modal size="small" open={uploadModalToggle} closeOnDimmerClick centered={false}>
      <Modal.Header>Upload a New Video</Modal.Header>
      <Modal.Content>
        <Form
          id="uploadForm"
          onSubmit={e => {
            e.preventDefault();
            const data = new FormData();
            data.append('videoName', videoName);
            data.append('videoDescription', videoDescription);
            data.append('fileName', videoFile);
            uploadVideo(data, token, activePage, sortKey, sortOrder);
            setUploadModalToggle(false);
            setVideoName('');
            setVideoDescription('');
            setVideoFile(null);
          }}
        >
          <Form.Group widths="equal">
            <Form.Field
              id="videoName"
              required
              label="Video Name"
              control="input"
              onChange={e => {
                setVideoName(e.target.value);
              }}
            />
            <Form.Field
              id="videoFile"
              required
              label="Video File"
              control="input"
              type="file"
              accept="video/*"
              onChange={e => {
                setVideoFile(e.target.files[0]);
              }}
            />
          </Form.Group>
        </Form>
        <Form>
          <TextArea
            id="uploadDescription"
            autoHeight
            placeholder="A video description should go here."
            onChange={e => {
              setVideoDescription(e.target.value);
            }}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button id="cancelUpload" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          primary
          type="submit"
          value="submit"
          form="uploadForm"
          disabled={!videoName || !videoFile}
        >
          Upload
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default UploadModalForm;

UploadModalForm.propTypes = {
  uploadModalToggle: PropTypes.bool.isRequired,
  uploadVideo: PropTypes.func.isRequired,
  setUploadModalToggle: PropTypes.func.isRequired,
  token: PropTypes.string,
  activePage: PropTypes.number.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
};
