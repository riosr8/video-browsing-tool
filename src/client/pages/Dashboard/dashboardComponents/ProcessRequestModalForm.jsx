/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, Checkbox } from 'semantic-ui-react';

const ProcessRequestModalForm = props => {
  // const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const {
    processRequestModalToggle,
    setProcessRequestModalToggle,
    sendProcessingRequest,
    selectedVideoUUID,
    token,
    algorithms,
    selectedAlgorithms,
    setSelectedAlgorithms,
  } = props;

  const closeModal = () => {
    setSelectedAlgorithms([]);
    setProcessRequestModalToggle(false);
  };

  return (
    <Modal size="small" open={processRequestModalToggle} closeOnDimmerClick centered={false}>
      <Modal.Header>Process Request</Modal.Header>
      <Modal.Content>
        <Form
          id="requestForm"
          onSubmit={e => {
            e.preventDefault();
            sendProcessingRequest(token, selectedAlgorithms, selectedVideoUUID);
            setSelectedAlgorithms([]);
            setProcessRequestModalToggle(false);
          }}
        >
          <Form.Group as={Form.Field} grouped required>
            <label>Available Algorithms</label>
            {algorithms.map(algo => (
              <Form.Field
                className="algorithm"
                key={algo.name}
                control={Checkbox}
                label={`${algo.name}: ${algo.description}`}
                value={algo.id}
                onChange={(e, data) => {
                  e.preventDefault();
                  if (selectedAlgorithms.includes(data.value)) {
                    setSelectedAlgorithms(selectedAlgorithms.filter(a => a !== data.value));
                  } else {
                    setSelectedAlgorithms(selectedAlgorithms.concat(data.value));
                  }
                }}
              />
            ))}
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button id="cancelProcessingRequest" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          id="submitProcessingButton"
          primary
          type="submit"
          value="submit"
          form="requestForm"
          disabled={selectedAlgorithms.length === 0}
        >
          Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

ProcessRequestModalForm.propTypes = {
  processRequestModalToggle: PropTypes.bool.isRequired,
  setProcessRequestModalToggle: PropTypes.func.isRequired,
  sendProcessingRequest: PropTypes.func.isRequired,
  selectedVideoUUID: PropTypes.string.isRequired,
  algorithms: PropTypes.array.isRequired,
  token: PropTypes.string,
  selectedAlgorithms: PropTypes.array.isRequired,
  setSelectedAlgorithms: PropTypes.func.isRequired,
};

export default ProcessRequestModalForm;
