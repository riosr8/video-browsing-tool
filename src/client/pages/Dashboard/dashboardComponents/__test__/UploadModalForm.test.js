import React from 'react';
import { mount } from 'enzyme';
import UploadModalForm from '../UploadModalForm';

describe('Delete Confirmation Modal', () => {
  let wrapper;
  const uploadModalToggle = true;
  const mockUploadVideo = jest.fn();
  const mockSetUploadModalToggle = jest.fn();

  beforeEach(() => {
    wrapper = mount(
      <UploadModalForm
        uploadModalToggle={uploadModalToggle}
        uploadVideo={mockUploadVideo}
        setUploadModalToggle={mockSetUploadModalToggle}
        userId=""
        token=""
        activePage={1}
        sortKey="time"
        sortOrder="asc"
      />,
    );
  });

  it('should toggle the modal after submitting upload request', () => {
    wrapper
      .find('#videoName')
      .hostNodes()
      .simulate('change', { target: { value: 'Test Video' } });

    wrapper
      .find('#videoFile')
      .hostNodes()
      .simulate('change', { target: { files: 'Test File' } });

    wrapper
      .find('#uploadDescription')
      .hostNodes()
      .simulate('change', { target: { value: 'Test Description' } });

    wrapper
      .find('#uploadForm')
      .hostNodes()
      .simulate('submit', { preventDefault() {} });

    expect(mockSetUploadModalToggle.mock.calls).toHaveLength(1);
  });

  it('should close modal on cancel button click', () => {
    wrapper
      .find('#cancelUpload')
      .hostNodes()
      .simulate('click');
    expect(mockSetUploadModalToggle.mock.calls).toHaveLength(1);
  });
});
