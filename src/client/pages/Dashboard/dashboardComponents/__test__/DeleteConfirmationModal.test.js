import React from 'react';
import { mount } from 'enzyme';
import DeleteConfirmationModal from '../DeleteConfirmationModal';

describe('Delete Confirmation Modal', () => {
  let wrapper;
  const deleteModalToggle = true;
  const setDeleteModalToggle = jest.fn();

  beforeEach(() => {
    wrapper = mount(
      <DeleteConfirmationModal
        deleteModalToggle={deleteModalToggle}
        setDeleteModalToggle={setDeleteModalToggle}
        deleteVideo={jest.fn()}
        token="token"
        selectedVideoUUID="uuid"
        activePage={1}
        sortKey="time"
        sortOrder="asc"
      />,
    );
  });

  it('should call setDeleteModalToggle on cancel delete', () => {
    expect(setDeleteModalToggle.mock.calls).toHaveLength(0);
    wrapper
      .find('#cancelDeleteVideo')
      .hostNodes()
      .simulate('click');
    expect(setDeleteModalToggle.mock.calls).toHaveLength(1);
  });

  it('should call setDeleteModalToggle on confirm delete', () => {
    // wrapper.setProps({ deleteModalToggle: true });
    expect(setDeleteModalToggle.mock.calls).toHaveLength(0);
    wrapper
      .find('#confirmDeleteVideo')
      .hostNodes()
      .simulate('click');
    expect(setDeleteModalToggle.mock.calls).toHaveLength(1);
  });
});
