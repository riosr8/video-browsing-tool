import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon, Button } from 'semantic-ui-react';

const sortOptions = [
  { key: 'time', text: 'Upload Date', value: 'time' },
  { key: 'videoLength', text: 'Video Length', value: 'videoLength' },
  { key: 'videoName', text: 'Video Name', value: 'videoName' },
];

const orderOptions = [
  { key: 'asc', text: 'Ascending', value: 'asc' },
  { key: 'desc', text: 'Descending', value: 'desc' },
];

const Toolbar = props => {
  const {
    uploadModalToggle,
    setUploadModalToggle,
    uploading,
    clearMessage,
    sortKey,
    sortOrder,
    setSortOrder,
    history,
  } = props;
  return (
    <Menu>
      <Dropdown
        id="sort_dropdown"
        item
        simple
        text="Sort"
        options={sortOptions}
        value={sortKey}
        onChange={(e, data) => {
          history.push({
            pathname: '/dashboard',
            search: `?pageNo=${1}&sortVal=${data.value}&order=${sortOrder}`,
          });
        }}
      />
      <Dropdown
        id="order_dropdown"
        item
        simple
        text="Order"
        options={orderOptions}
        value={sortOrder}
        onChange={(e, data) => {
          setSortOrder(data.value);
          history.push({
            pathname: '/dashboard',
            search: `?pageNo=${1}&sortVal=${sortKey}&order=${data.value}`,
          });
        }}
      />
      <Menu.Menu position="right">
        <Menu.Item name="upload" active={uploadModalToggle}>
          <Button
            id="uploadButton"
            primary
            icon={<Icon name="upload" />}
            content="Upload"
            loading={uploading}
            disabled={uploading}
            onClick={() => {
              clearMessage();
              setUploadModalToggle(true);
            }}
          />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

Toolbar.propTypes = {
  uploadModalToggle: PropTypes.bool.isRequired,
  setUploadModalToggle: PropTypes.func.isRequired,
  uploading: PropTypes.bool.isRequired,
  clearMessage: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  setSortOrder: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default Toolbar;
