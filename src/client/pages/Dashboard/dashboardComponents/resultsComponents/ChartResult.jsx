import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-google-charts';

const ChartResult = props => {
  const { data, chartType } = props;
  if (chartType === '2Ddata') {
    return (
      <Chart
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={data}
        options={{
          hAxis: {
            title: 'Threshold',
          },
          vAxis: {
            title: 'Correlation',
          },
          series: {
            1: { curveType: 'function' },
          },
          legend: {
            position: 'none',
          },
        }}
      />
    );
  }
  if (chartType === 'histogram') {
    return (
      <Chart
        chartType="Bar"
        loader={<div>Loading Chart</div>}
        data={data}
        options={{
          // Material design options
          legend: {
            position: 'top',
          },
        }}
      />
    );
  }
};

export default ChartResult;

ChartResult.propTypes = {
  data: PropTypes.array.isRequired,
  chartType: PropTypes.string.isRequired,
};
