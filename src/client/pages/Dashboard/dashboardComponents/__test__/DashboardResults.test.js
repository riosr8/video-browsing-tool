import React from 'react';
import { mount } from 'enzyme';
import { Segment, Header, Dropdown } from 'semantic-ui-react';
import { act } from 'react-dom/test-utils';
import DashboardResults from '../DashboardResults';
import mockResults from '../mock-data/mockData';
import ChartResult from '../resultsComponents/ChartResult';

describe('Dashboard Results', () => {
  let wrapper;
  const mockSetResultsIsVisible = jest.fn();

  beforeEach(() => {
    wrapper = mount(
      <DashboardResults
        results={mockResults}
        resultsIsVisible
        setResultsIsVisible={mockSetResultsIsVisible}
        fetchingResults={false}
      />,
    );
  });

  it('renders with out crashing ', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should close results view on close click', () => {
    wrapper
      .find('#closeVideoPlayer')
      .hostNodes()
      .simulate('click');
    expect(mockSetResultsIsVisible.mock.calls).toHaveLength(1);
  });

  it('should trigger dropdown onChange function', () => {
    act(() => {
      wrapper.find(Dropdown).prop('onChange')({ preventDefault: jest.fn() }, { value: '1' });
    });

    expect(wrapper.find(Dropdown).props().value).toBe('1');
  });

  it('should render a chart given 2D data', () => {
    wrapper.setProps({
      results: {
        videoUuid: '19616905-83ff-4671-8c02-7c62d13e2458big_buck_bunny.mp4',
        results: [
          {
            key: 'Algorithm 1',
            value: '1',
            text: 'Algorithm 1',
            id: '1',
            result: [],
            type: '2Ddata',
          },
        ],
      },
    });

    expect(wrapper.find(ChartResult)).toHaveLength(1);
  });

  it('should render a chart given histogram data', () => {
    wrapper.setProps({
      results: {
        videoUuid: '19616905-83ff-4671-8c02-7c62d13e2458big_buck_bunny.mp4',
        results: [
          {
            key: 'Algorithm 1',
            value: '1',
            text: 'Algorithm 1',
            id: '1',
            result: [],
            type: 'histogram',
          },
        ],
      },
    });

    expect(wrapper.find(ChartResult)).toHaveLength(1);
  });

  it('should return null if chart type is not handled', () => {
    wrapper.setProps({
      results: {
        videoUuid: '19616905-83ff-4671-8c02-7c62d13e2458big_buck_bunny.mp4',
        results: [
          {
            key: 'Algorithm 1',
            value: '1',
            text: 'Algorithm 1',
            id: '1',
            result: [],
            type: '',
          },
        ],
      },
    });

    expect(wrapper.find(ChartResult)).toHaveLength(0);
  });

  it('should return segment in loading state', () => {
    wrapper.setProps({ fetchingResults: true });
    expect(wrapper.find(Segment).findWhere(n => n.prop('loading') === true)).toHaveLength(1);
  });

  it('should return a header with message if no results', () => {
    wrapper.setProps({ results: { videoUuid: 'id', results: [] } });
    expect(
      wrapper.find(Header).findWhere(n => {
        return (
          n.prop('content') === 'No results available. Please submit a processing request first.'
        );
      }),
    ).toHaveLength(1);
  });

  it('should close header with message if no results on close click', () => {
    wrapper.setProps({ results: { videoUuid: 'id', results: [] } });
    wrapper
      .find('#closeVideoPlayer')
      .hostNodes()
      .simulate('click');
    expect(mockSetResultsIsVisible.mock.calls).toHaveLength(1);
  });
});
