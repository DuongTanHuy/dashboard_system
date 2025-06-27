import { cloneDeep } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
// components
import { useSettingsContext } from 'src/components/settings';
import {
  Divider,
  IconButton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
  toggleButtonGroupClasses,
  useTheme,
} from '@mui/material';
import { shortDateLabel, useDateRangePicker } from 'src/components/custom-date-range-picker';
import { fDate, fDateTime } from 'src/utils/format-time';
import CustomDateRangePicker from 'src/components/custom-date-range-picker/custom-date-range-picker';
import Iconify from 'src/components/iconify';
import { COLORS } from 'src/utils/constance';
import { chart_data, compare_summary_data, statistic_summary_data } from 'src/utils/mock';
import SummaryItem from '../summary-item';
import AnalyticChart from '../analytic-line-chart';

// ----------------------------------------------------------------------

const SUMMARY_ITEM = [
  {
    id: 'total_register',
    name: 'Tổng số người đăng ký',
    color: COLORS[0],
    icon: 'mdi:register',
    data: [],
    total: 0,
    display: true,
  },
  {
    id: 'total_purchase_package',
    name: 'Tổng số người mua gói',
    color: COLORS[1],
    icon: 'icon-park-solid:buy',
    data: [],
    total: 0,
    display: true,
  },
  {
    id: 'total_recharge',
    name: 'Tổng số nạp tiền',
    color: COLORS[2],
    icon: 'fluent:payment-16-filled',
    data: [],
    total: 0,
    display: true,
  },
  {
    id: 'total_revenue',
    name: 'Tổng số doanh thu',
    color: COLORS[3],
    icon: 'ph:cash-register-fill',
    data: [],
    total: 0,
    display: true,
  },
];

const OPTIONS = [
  { id: 'op_01', value: 'yesterday', label: 'Hôm qua' },
  { id: 'op_02', value: 'today', label: 'Hôm nay' },
  { id: 'op_03', value: 'week', label: 'Tuần này' },
  { id: 'op_04', value: 'month', label: 'Tháng này' },
  { id: 'op_09', value: 'year', label: 'Năm này' },
  { id: 'op_05', value: '7_ago', label: '7 ngày trước' },
  { id: 'op_06', value: '14_ago', label: '14 ngày trước' },
  { id: 'op_07', value: '30_ago', label: '30 ngày trước' },
  { id: 'op_08', value: 'month_ago', label: 'Tháng trước' },
];

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
    minWidth: 'fit-content',
  },
  [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]: {
    marginLeft: -1,
    borderLeft: '1px solid transparent',
  },
}));

// ----------------------------------------------------------------------

export default function RevenueStatisticalView() {
  const theme = useTheme();
  const settings = useSettingsContext();

  const [summaryItem, setSummaryItem] = useState(SUMMARY_ITEM);
  const [categories, setCategories] = useState([]);
  const [dateFilter, setDateFilter] = useState('month');
  const rangeCalendarPicker = useDateRangePicker(null, null);

  const [compareDateFilter, setCompareDateFilter] = useState({
    startDate: null,
    endDate: null,
  });
  const [compareSummary, setCompareSummary] = useState({});

  const handleChangeTypeData = (id) => {
    const _clone = cloneDeep(summaryItem);
    const _find = _clone.findIndex((i) => i.id === id);
    _clone[_find].display = !_clone[_find].display;
    setSummaryItem(_clone);
  };

  const handleChangeDateFilter = useCallback(() => {
    const today = new Date();
    let startDate;
    let endDate;
    function getFirstAndLastDayOfWeek(date) {
      const firstDay = new Date(date);
      firstDay.setDate(firstDay.getDate() - firstDay.getDay());
      const lastDay = new Date(firstDay);
      lastDay.setDate(lastDay.getDate() + 6);
      rangeCalendarPicker.setStartDate(new Date(firstDay));
      rangeCalendarPicker.setEndDate(new Date(lastDay));

      firstDay.setDate(firstDay.getDate() - 7);
      lastDay.setDate(lastDay.getDate() - 7);
      setCompareDateFilter((prev) => ({
        startDate: fDate(firstDay, 'yyyy-MM-dd'),
        endDate: fDate(lastDay, 'yyyy-MM-dd'),
      }));
    }

    function getFirstAndLastDayOfMonth(date) {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      rangeCalendarPicker.setStartDate(new Date(firstDay));
      rangeCalendarPicker.setEndDate(new Date(lastDay));

      firstDay.setMonth(firstDay.getMonth() - 1);
      lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
      setCompareDateFilter((prev) => ({
        startDate: fDate(firstDay, 'yyyy-MM-dd'),
        endDate: fDate(lastDay, 'yyyy-MM-dd'),
      }));
    }

    function getFirstAndLastDayOfYear(date) {
      const firstDay = new Date(date.getFullYear(), 0, 1);
      const lastDay = new Date(date.getFullYear(), 11, 31);
      rangeCalendarPicker.setStartDate(new Date(firstDay));
      rangeCalendarPicker.setEndDate(new Date(lastDay));

      firstDay.setFullYear(firstDay.getFullYear() - 1);
      lastDay.setFullYear(lastDay.getFullYear() - 1);
      setCompareDateFilter((prev) => ({
        startDate: fDate(firstDay, 'yyyy-MM-dd'),
        endDate: fDate(lastDay, 'yyyy-MM-dd'),
      }));
    }

    switch (dateFilter) {
      case 'yesterday':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        rangeCalendarPicker.setStartDate(new Date(startDate));
        rangeCalendarPicker.setEndDate(new Date(startDate));

        startDate.setDate(startDate.getDate() - 1);
        setCompareDateFilter((prev) => ({
          startDate: fDate(startDate, 'yyyy-MM-dd'),
          endDate: fDate(startDate, 'yyyy-MM-dd'),
        }));
        break;
      case 'today':
        rangeCalendarPicker.setStartDate(today);
        rangeCalendarPicker.setEndDate(today);

        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        setCompareDateFilter((prev) => ({
          startDate: fDate(startDate, 'yyyy-MM-dd'),
          endDate: fDate(startDate, 'yyyy-MM-dd'),
        }));
        break;
      case 'week':
        getFirstAndLastDayOfWeek(today);
        break;
      case 'month':
        getFirstAndLastDayOfMonth(today);
        break;
      case 'year':
        getFirstAndLastDayOfYear(today);
        break;
      case '7_ago':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = new Date(today);
        endDate.setDate(today.getDate() - 1);
        rangeCalendarPicker.setStartDate(new Date(startDate));
        rangeCalendarPicker.setEndDate(new Date(endDate));

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() - 1);
        startDate.setDate(startDate.getDate() - 7);
        setCompareDateFilter((prev) => ({
          startDate: fDate(startDate, 'yyyy-MM-dd'),
          endDate: fDate(endDate, 'yyyy-MM-dd'),
        }));
        break;
      case '14_ago':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 14);
        endDate = new Date(today);
        endDate.setDate(today.getDate() - 1);
        rangeCalendarPicker.setStartDate(new Date(startDate));
        rangeCalendarPicker.setEndDate(new Date(endDate));

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() - 1);
        startDate.setDate(startDate.getDate() - 14);
        setCompareDateFilter((prev) => ({
          startDate: fDate(startDate, 'yyyy-MM-dd'),
          endDate: fDate(endDate, 'yyyy-MM-dd'),
        }));
        break;
      case '30_ago':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        endDate = new Date(today);
        endDate.setDate(today.getDate() - 1);
        rangeCalendarPicker.setStartDate(new Date(startDate));
        rangeCalendarPicker.setEndDate(new Date(endDate));

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() - 1);
        startDate.setDate(startDate.getDate() - 30);
        setCompareDateFilter((prev) => ({
          startDate: fDate(startDate, 'yyyy-MM-dd'),
          endDate: fDate(endDate, 'yyyy-MM-dd'),
        }));
        break;
      case 'month_ago':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        rangeCalendarPicker.setStartDate(new Date(startDate));
        rangeCalendarPicker.setEndDate(new Date(endDate));

        startDate.setMonth(startDate.getMonth() - 1);
        endDate = new Date(today.getFullYear(), today.getMonth() - 1, 0);

        setCompareDateFilter((prev) => ({
          startDate: fDate(startDate, 'yyyy-MM-dd'),
          endDate: fDate(endDate, 'yyyy-MM-dd'),
        }));
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  useEffect(() => {
    handleChangeDateFilter();
  }, [handleChangeDateFilter]);

  useEffect(() => {
    const handleFetchTotalData = async () => {
      try {
        const params = {
          start_date: fDateTime(rangeCalendarPicker.startDate, 'yyyy-MM-dd'),
          end_date: fDateTime(rangeCalendarPicker.endDate, 'yyyy-MM-dd'),
        };
        console.log(params);

        // api not available
        // const response = await getStatisticSummaryApi(params);
        const data = statistic_summary_data;
        setSummaryItem((prev) =>
          prev.map((item) => ({
            ...item,
            total: data?.[item.id] || 0,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    const handleFetchCompareData = async () => {
      try {
        const params = {
          start_date: compareDateFilter.startDate,
          end_date: compareDateFilter.endDate,
        };
        console.log(params);

        // api not available
        // const response = await getStatisticSummaryApi(params);
        setCompareSummary(compare_summary_data);
      } catch (error) {
        console.log(error);
      }
    };

    if (rangeCalendarPicker.startDate && rangeCalendarPicker.endDate) {
      handleFetchTotalData();
    }

    if (compareDateFilter.startDate && compareDateFilter.endDate) {
      handleFetchCompareData();
    }
  }, [
    compareDateFilter.endDate,
    compareDateFilter.startDate,
    rangeCalendarPicker.endDate,
    rangeCalendarPicker.startDate,
  ]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        let statistical_by;

        switch (dateFilter) {
          case 'year':
            statistical_by = 'month';
            break;
          case 'month':
          case 'week':
            statistical_by = 'day';
            break;
          case 'today':
          case 'yesterday':
            statistical_by = 'hour';
            break;
          default:
            if (
              rangeCalendarPicker.startDate.getFullYear() ===
                rangeCalendarPicker.endDate.getFullYear() &&
              rangeCalendarPicker.startDate.getMonth() === rangeCalendarPicker.endDate.getMonth() &&
              rangeCalendarPicker.startDate.getDate() === rangeCalendarPicker.endDate.getDate()
            ) {
              statistical_by = 'hour';
            } else {
              statistical_by = 'day';
            }
        }

        const params = {
          start_date: fDateTime(rangeCalendarPicker.startDate, 'yyyy-MM-dd'),
          end_date: fDateTime(rangeCalendarPicker.endDate, 'yyyy-MM-dd'),
          statistical_by,
        };
        console.log(params);

        // api not available
        // const response = await getStatisticChartApi(params);
        const { categories: category, data } = chart_data;
        setCategories(category);
        setSummaryItem((prev) =>
          prev.map((item) => ({
            ...item,
            data: data?.[item.id] || [],
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    if (rangeCalendarPicker.startDate && rangeCalendarPicker.endDate) {
      fetchChartData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeCalendarPicker.endDate, rangeCalendarPicker.startDate]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={3}>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            border: `1px solid ${theme.palette.divider}`,
            flexWrap: 'wrap',
            width: 'fit-content',
            ml: 'auto',
            '& .MuiToggleButtonGroup-root': {
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            },
          }}
        >
          <StyledToggleButtonGroup
            color="primary"
            size="small"
            value={dateFilter}
            exclusive
            onChange={(event) => {
              setDateFilter(event.target.value);
            }}
            sx={{
              border: 'none',
            }}
          >
            {OPTIONS.map((option) => (
              <ToggleButton key={option.id} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
            <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{ color: 'text.secondary', cursor: 'pointer', px: 1 }}
              onClick={rangeCalendarPicker.onOpen}
            >
              <Typography variant="subtitle2">{`${
                fDate(rangeCalendarPicker.startDate, 'dd:MM:yy') || 'DD:MM:YY'
              } - ${fDate(rangeCalendarPicker.endDate, 'dd:MM:yy') || 'DD:MM:YY'}`}</Typography>
              <IconButton>
                <Iconify icon="solar:calendar-bold" />
              </IconButton>
            </Stack>
          </StyledToggleButtonGroup>
        </Paper>
        <Grid container spacing={3}>
          {summaryItem.map((item, index) => (
            <Grid key={item.id} item xs={6} md={3}>
              <SummaryItem
                active={item.display}
                handleChangeTypeData={() => handleChangeTypeData(item.id)}
                type={index > 1 ? 'money' : 'user'}
                title={item.name}
                total={item.total}
                compareTotal={compareSummary?.[item.id]}
                color={[
                  theme.palette[item.color[0].split('.')[0]][item.color[0].split('.')[1]],
                  theme.palette[item.color[1].split('.')[0]][item.color[1].split('.')[1]],
                ]}
                icon={item.icon}
              />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AnalyticChart
              dataType="user"
              title="Biểu đồ thống kê người dùng"
              subheader={`Thống kê theo thời gian: ${shortDateLabel(
                rangeCalendarPicker.startDate,
                rangeCalendarPicker.endDate,
                "d 'tháng' M yyyy",
                "d 'tháng' M"
              )}`}
              chart={{
                categories,
                data: summaryItem
                  .slice(0, 2)
                  .filter((item) => item.display)
                  .map((i) => ({
                    name: i.name,
                    data: i.data,
                  })),
                colors: summaryItem
                  .slice(0, 2)
                  .filter((item) => item.display)
                  .map((item) => item.color[0]),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <AnalyticChart
              dataType="money"
              title="Biểu đồ thống kê doanh thu"
              subheader={`Thống kê theo thời gian: ${shortDateLabel(
                rangeCalendarPicker.startDate,
                rangeCalendarPicker.endDate,
                "d 'tháng' M yyyy",
                "d 'tháng' M"
              )}`}
              chart={{
                categories,
                data: summaryItem
                  .slice(2)
                  .filter((item) => item.display)
                  .map((i) => ({
                    name: i.name,
                    data: i.data,
                  })),
                colors: summaryItem
                  .slice(2)
                  .filter((item) => item.display)
                  .map((item) => item.color[0]),
              }}
            />
          </Grid>
          {/* <Grid item xs={12} lg={4}>
            <AnalyticTotalChart
              title="Số liệu tổng quan"
              subheader=""
              series={summaryItem.filter((item) => item.display).map((i) => i.total)}
              categories={summaryItem
                .filter((cate) => cate.display)
                .map((item) => ['Tổng số', item.name.split(' ').slice(2).join(' ')])}
              colors={summaryItem
                .filter((item) => item.display)
                .map((item) => item.color)
                .map((i) => theme.palette[i[0].split('.')[0]][i[0].split('.')[1]])}
            />
          </Grid> */}
        </Grid>
      </Stack>

      <CustomDateRangePicker
        variant="calendar"
        open={rangeCalendarPicker.open}
        startDate={rangeCalendarPicker.startDate}
        endDate={rangeCalendarPicker.endDate}
        onChangeStartDate={(value) => {
          rangeCalendarPicker.onChangeStartDate(value);
          setCompareDateFilter((prev) => ({ ...prev, startDate: fDate(value, 'yyyy-MM-dd') }));
          setDateFilter('');
        }}
        onChangeEndDate={(value) => {
          rangeCalendarPicker.onChangeEndDate(value);
          setCompareDateFilter((prev) => ({ ...prev, endDate: fDate(value, 'yyyy-MM-dd') }));

          setDateFilter('');
        }}
        setCompareDateFilter={setCompareDateFilter}
        onClose={rangeCalendarPicker.onClose}
        error={rangeCalendarPicker.error}
      />
    </Container>
  );
}
