import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';
// components
import Chart, { useChart } from 'src/components/chart';
import { useTheme } from '@mui/material';
import Scrollbar from 'src/components/scrollbar';
import { useResponsive } from 'src/hooks/use-responsive';
import { fCurrencyVND } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function AnalyticChart({ title, subheader, chart, label, dataType, ...other }) {
  const { colors, categories, data, options } = chart;
  const theme = useTheme();
  const smUp = useResponsive('up', 'sm');

  const chartOptions = useChart({
    colors: colors?.map((color) => theme.palette[color?.split('.')[0]][color?.split('.')[1]]),
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    chart: {
      stacked: false,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter(value) {
          return dataType === 'money' ? fCurrencyVND(value) : value;
        },
      },
    },
    xaxis: {
      categories,
      tickAmount: 12,
      labels: {
        rotate: 0,
      },
    },
    ...options,
  });

  return (
    <Card
      {...other}
      sx={{
        height: 500,
      }}
    >
      <CardHeader title={title} subheader={subheader} />

      <Box
        sx={{
          mt: 3,
          mx: 1,
          '& .apexcharts-legend.apexcharts-align-right.apx-legend-position-top': {
            display: 'none',
          },
          height: 1,
        }}
      >
        <Scrollbar
          sx={{
            height: 1,
          }}
        >
          <Chart
            dir="ltr"
            type="area"
            series={data}
            options={chartOptions}
            height={364}
            width={smUp ? '100%' : 600}
          />
        </Scrollbar>
      </Box>
    </Card>
  );
}

AnalyticChart.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  dataType: PropTypes.string,
};
