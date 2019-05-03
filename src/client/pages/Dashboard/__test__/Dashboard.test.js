import React from 'react';
import { mount } from 'enzyme';
import { Dashboard } from '../Dashboard';
import mockResults from '../dashboardComponents/mock-data/mockData';

describe('Dashboard', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <Dashboard
        getVideos={jest.fn()}
        uploadVideo={jest.fn()}
        userVideos={[]}
        uploading={false}
        fetching={false}
        fetchingResults={false}
        getResults={jest.fn()}
        results={mockResults}
        sendProcessingRequest={jest.fn()}
        requestProcessing={false}
        token="random-token"
        deleteVideo={jest.fn()}
        fetchAlgorithms={jest.fn()}
        clearMessage={jest.fn()}
        location={{ search: '?pageNo=1' }}
        history={{}}
        activePage={1}
        setActivePage={jest.fn()}
        totalPages={1}
        sortKey=""
        setSortKey={jest.fn()}
        sortOrder="asc"
        setSortOrder={jest.fn()}
        algorithms={[{ name: 'Algorithm 1', description: 'the Video' }]}
      />,
    );
  });

  it('renders without crashing with default props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders without crashing while fetching', () => {
    wrapper.setProps({ fetching: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('render without crashing with user videos', () => {
    wrapper.setProps({
      userVideos: [
        {
          _id: '5cb6381c80e4c0001232c6d8',
          userId: 'test@gmail.com',
          videoName: 'iiii',
          videoUuid: '20cd334f-888c-4206-893d-bfa6e3404a4abig_buck_bunny.mp4',
          videoLength: '60.095',
          videoThumbnail: '20cd334f-888c-4206-893d-bfa6e3404a4abig_buck_bunny.png',
          videoDescription: '',
        },
      ],
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders if no query params specified', () => {
    wrapper.setProps({ location: { search: '' } });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with all query params specified', () => {
    wrapper.setProps({ location: { search: '?pageNo=1&sortVal=videoName&order=asc' } });
    expect(wrapper).toMatchSnapshot();
  });
});
