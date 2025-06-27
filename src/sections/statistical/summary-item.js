import PropTypes from 'prop-types';

// mui
import { Button, Card, CardContent, Stack, Typography, alpha, useTheme } from '@mui/material';
import Iconify from 'src/components/iconify';
import { bgGradient } from 'src/theme/css';
import { fCurrencyVND } from 'src/utils/format-number';

const SummaryItem = ({
  title,
  total,
  compareTotal,
  icon,
  color,
  handleChangeTypeData,
  active,
  type,
}) => {
  const theme = useTheme();
  const compareValue = total - compareTotal;

  return (
    <Card
      component={Button}
      onClick={handleChangeTypeData}
      sx={{
        width: 1,
        p: 0,
        position: 'relative',
        boxShadow: theme.customShadows.z8,
        borderRadius: 1,
        cursor: 'pointer',
        transition: theme.transitions.create(['all'], {
          duration: theme.transitions.duration.shortest,
        }),
        ...(active && {
          transform: 'scale(1.02)',
        }),
        '&::before': {
          content: "''",
          position: 'absolute',
          bottom: 0,
          width: 0,
          height: 4,
          ...bgGradient({
            direction: 'to right',
            startColor: alpha(color[0], 0.9),
            endColor: alpha(color[1], 0.9),
          }),
          ...(active && {
            width: 1,
          }),
          transition: theme.transitions.create(['width'], {
            duration: theme.transitions.duration.shortest,
          }),
        },
      }}
    >
      <CardContent
        sx={{
          width: 1,
          textAlign: 'left',
          p: 2,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={1} width={1} alignItems="start" justifyContent="center">
            <Typography
              variant="subtitle2"
              color="text.secondary"
              textAlign="center"
              whiteSpace="nowrap"
              textTransform="capitalize"
            >
              {title}
            </Typography>
            <Stack
              direction="row"
              flexWrap="wrap"
              spacing={0.5}
              alignItems="center"
              whiteSpace="normal"
            >
              <Typography variant="h5" color={color[0]}>
                {type === 'money' ? fCurrencyVND(total) : total || 0}
              </Typography>
              {/* <Typography variant="subtitle1" color="text.primary">
                Người
              </Typography> */}
            </Stack>
          </Stack>
          <Stack
            p={1.5}
            borderRadius="50%"
            boxShadow={theme.customShadows.z8}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              ...bgGradient({
                direction: '135deg',
                startColor: alpha(color[0], 0.9),
                endColor: alpha(color[1], 0.9),
              }),
            }}
          >
            <Iconify icon={icon} color="white" />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center" mt={1}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Iconify
              icon={compareValue >= 0 ? 'ci:trending-up' : 'ci:trending-down'}
              color={compareValue >= 0 ? 'success.main' : 'error.main'}
            />
            <Typography color={compareValue >= 0 ? 'success.main' : 'error.main'}>
              {type === 'money' ? fCurrencyVND(compareValue) : compareValue || 0}
            </Typography>
          </Stack>
          <Typography
            color="text.secondary"
            variant="caption"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {compareValue >= 0 ? 'tăng lên' : 'giảm xuống'}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SummaryItem;

SummaryItem.propTypes = {
  title: PropTypes.string,
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  compareTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.string,
  type: PropTypes.string,
  color: PropTypes.array,
  handleChangeTypeData: PropTypes.func,
  active: PropTypes.bool,
};
