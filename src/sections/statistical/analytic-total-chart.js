// components
import { Card, CardHeader } from '@mui/material';
import PropTypes from 'prop-types';
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function AnalyticTotalChart({
  title,
  subheader,
  series,
  colors,
  categories,
  ...other
}) {
  const chartOptions = useChart({
    stroke: { show: false },
    colors,
    plotOptions: {
      bar: {
        columnWidth: '12px',
        distributed: true,
      },
    },
    xaxis: {
      categories,
    },
    labels: {
      style: {
        colors,
        fontSize: '12px',
      },
    },
  });

  return (
    <Card
      {...other}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '& .apexcharts-legend': {
          display: 'none',
        },
      }}
    >
      <CardHeader title={title} subheader={subheader} />
      <Chart
        dir="ltr"
        type="bar"
        series={[
          {
            name: 'Tổng',
            data: series,
          },
        ]}
        options={chartOptions}
        height={400}
      />
    </Card>
  );
}

AnalyticTotalChart.propTypes = {
  series: PropTypes.array,
  colors: PropTypes.array,
  categories: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
