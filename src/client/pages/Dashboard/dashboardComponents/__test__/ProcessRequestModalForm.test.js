import React from 'react';
import { mount } from 'enzyme';
import ProcessRequestModalForm from '../ProcessRequestModalForm';

const mockAlgos = [
  {
    id: 1,
    name: 'Algorithm 1',
    description: 'Performs face detection on the Video',
  },
  {
    id: 2,
    name: 'Algorithm 2',
    description: 'Performs dog detection on the Video',
  },
];

describe('ProcessRequestModalForm', () => {
  let wrapper;
  const processRequestModalToggle = true;
  const mockSetProcessRequestModalToggle = jest.fn();
  const mockSendProcessingRequest = jest.fn();
  let mockArray = [];
  const mockSetSelectedAlgorithms = jest.fn(arr => {
    mockArray = arr;
  });

  beforeEach(() => {
    wrapper = mount(
      <ProcessRequestModalForm
        processRequestModalToggle={processRequestModalToggle}
        setProcessRequestModalToggle={mockSetProcessRequestModalToggle}
        sendProcessingRequest={mockSendProcessingRequest}
        selectedVideoUUID="selectedVideoUUID"
        userId="userId"
        token="token"
        algorithms={mockAlgos}
        selectedAlgorithms={mockArray}
        setSelectedAlgorithms={mockSetSelectedAlgorithms}
      />,
    );
  });

  it('should submit processing request', () => {
    wrapper
      .find({ type: 'checkbox' })
      .hostNodes()
      .first()
      .simulate('change', { target: { checked: true } });

    expect(wrapper.find('.checked').hostNodes()).toHaveLength(1);

    wrapper
      .find('#requestForm')
      .hostNodes()
      .simulate('submit', { preventDefault() {} });

    expect(mockSendProcessingRequest.mock.calls).toHaveLength(1);
    expect(mockSetProcessRequestModalToggle.mock.calls).toHaveLength(1);
  });

  it('should close modal on cancel button click', () => {
    wrapper
      .find('#cancelProcessingRequest')
      .hostNodes()
      .simulate('click');
    expect(mockSetProcessRequestModalToggle.mock.calls).toHaveLength(1);
  });

  it('should remove algo from selected algo array', () => {
    mockArray = [1];
    wrapper.setProps({ selectedAlgorithms: mockArray });

    wrapper
      .find({ type: 'checkbox' })
      .hostNodes()
      .first()
      .simulate('change', { target: { checked: true } });

    expect(mockSetSelectedAlgorithms.mock.calls).toHaveLength(1);
    expect(mockArray).toHaveLength(0);
  });
});
