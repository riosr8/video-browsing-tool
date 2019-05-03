import React from 'react';
import { mount } from 'enzyme';
import Toolbar from '../Toolbar';

describe('Toolbar', () => {
  let wrapper;
  const uploadModalToggle = false;
  const uploading = false;
  const mockSetUploadModalToggle = jest.fn();
  const mockPush = jest.fn();
  const mockSetOrder = jest.fn();

  beforeEach(() => {
    wrapper = mount(
      <Toolbar
        uploadModalToggle={uploadModalToggle}
        uploading={uploading}
        setUploadModalToggle={mockSetUploadModalToggle}
        clearMessage={jest.fn()}
        sortKey=""
        history={{ push: mockPush }}
        sortOrder="asc"
        setSortOrder={mockSetOrder}
      />,
    );
  });

  it('should call function to open upload modal on click', () => {
    wrapper
      .find('#uploadButton')
      .hostNodes()
      .simulate('click');

    expect(mockSetUploadModalToggle.mock.calls).toHaveLength(1);
  });

  it('should call the push function of the history object on sort change', () => {
    wrapper
      .find('#sort_dropdown')
      .hostNodes()
      .simulate('change', { target: { value: 'videoName' } });
    expect(mockPush.mock.calls).toHaveLength(1);
  });

  it('should call the push function of the history object on order change', () => {
    wrapper
      .find('#order_dropdown')
      .hostNodes()
      .simulate('change', { target: { value: 'desc' } });
    expect(mockPush.mock.calls).toHaveLength(1);
  });
});
