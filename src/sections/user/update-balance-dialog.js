import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Dialog,
  Divider,
  Input,
  MenuItem,
  Stack,
  Typography,
  inputClasses,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useCallback, useEffect, useState } from 'react';
import { fCurrencyVND, fNumber } from 'src/utils/format-number';
import { enqueueSnackbar } from 'notistack';
import { ERROR_CODE } from 'src/utils/constance';
import { useUpdateBalance } from 'src/tanstack/use-user';

// ----------------------------------------------------------------------

const BALANCE_TYPES = [
  { id: 'bt_00', name: '--- Chọn đơn vị ---', value: 'none' },
  { id: 'bt_01', name: 'Hồ sơ', value: 'profile' },
  { id: 'bt_02', name: 'VND', value: 'cash' },
];

const OPERATIONS = [
  { id: 'op_01', name: 'Cộng', value: 'add' },
  { id: 'op_02', name: 'Trừ', value: 'subtract' },
];

// ----------------------------------------------------------------------

const UpdateBalanceDialog = ({ open, onClose, userInfo, handleReload }) => {
  const balanceSchema = Yup.object().shape({
    balance_type: Yup.string()
      .required('Vui lòng chọn loại số dư')
      .test('is-not-none', 'Vui lòng chọn loại số dư', (value) => value !== 'none'),
    operation: Yup.string().required('Vui lòng chọn hành động'),
    description: Yup.string().required('Vui lòng nhập nội dung'),
  });

  const [autoWidth, setAutoWidth] = useState(72);
  const [amount, setAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const defaultValues = {
    balance_type: 'none',
    operation: 'add',
    description: '',
  };

  const methods = useForm({
    resolver: yupResolver(balanceSchema),
    defaultValues,
  });

  const { watch, reset, handleSubmit } = methods;

  const watchBalanceType = watch('balance_type');
  const watchOperation = watch('operation');

  const { mutate, isPending } = useUpdateBalance();

  const onSubmit = handleSubmit(async (data) => {
    if (Number(amount) === 0) {
      setErrorMessage('Vui lòng nhập số dư cần cập nhật. Số dư cần cập nhật phải lớn hơn 0!');
      return;
    }

    const payload = {
      ...data,
      amount: Number(amount),
    };

    mutate(
      {
        userId: userInfo?.id,
        payload,
      },
      {
        onSuccess: () => {
          handleClose();
          enqueueSnackbar('Cập nhật số dư thành công!', { variant: 'success' });
        },
        onError: (error) => {
          if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
            handleClose();
            enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
          } else {
            handleClose();
            enqueueSnackbar('Có lỗi đã xẩy ra, vui lòng thử lại sau!', { variant: 'error' });
          }
        },
      }
    );
  });

  const handleClose = () => {
    onClose();
    reset();
    setAmount(0);
    setErrorMessage('');
    setAutoWidth(72);
  };

  const handleAutoWidth = useCallback(() => {
    const getNumberLength = amount.toString().length;
    if (getNumberLength * 22 > 72) setAutoWidth(getNumberLength * 22);
  }, [amount]);

  const handleChangeInput = useCallback(
    (event) => {
      let value = event.target.value.replace(/^0+/, '');
      if (value === '') {
        value = 0;
      }
      const numericValue = Number(value);
      if (numericValue < 0) {
        setAmount(Math.abs(numericValue).toString());
      } else {
        setAmount(numericValue.toString());
      }
      if (errorMessage) {
        setErrorMessage('');
      }
    },
    [errorMessage]
  );

  const handleBlur = useCallback(() => {
    if (Number(amount) < 0) {
      setAmount(0);
    }
  }, [amount]);

  useEffect(() => {
    if (amount) {
      handleAutoWidth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  const renderTotal = (
    <Stack spacing={2} alignItems="flex-end" sx={{ textAlign: 'right', typography: 'body2' }}>
      <Stack direction="row" spacing={1}>
        <Box sx={{ color: 'text.secondary' }}>Tên tài khoản</Box>
        <Box
          sx={{
            width: 160,
            typography: 'subtitle2',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {userInfo?.username}
        </Box>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Box sx={{ color: 'text.secondary' }}>Số dư hiện tại</Box>
        <Box
          sx={{
            width: 160,
            typography: 'subtitle2',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {(watchBalanceType === 'profile' && `${fNumber(userInfo?.profile_balance)} hồ sơ`) ||
            (watchBalanceType === 'cash' && fCurrencyVND(userInfo?.balance)) ||
            0}
        </Box>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Box sx={{ color: 'text.secondary' }}>{`${
          watchOperation === 'add' ? 'Thêm' : 'Trừ'
        } số dư`}</Box>
        <Box
          sx={{
            width: 160,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            ...(watchOperation === 'add' ? { color: 'primary.main' } : { color: 'error.main' }),
          }}
        >
          {`${watchOperation === 'add' ? '+' : '-'} ${
            (watchBalanceType === 'profile' && `${fNumber(Number(Number(amount)))} hồ sơ`) ||
            (watchBalanceType === 'cash' && fCurrencyVND(Number(amount))) ||
            Number(amount)
          }`}
        </Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }} spacing={1}>
        <Box>Số dư cuối</Box>
        <Box
          sx={{ width: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {(() => {
            if (watchBalanceType === 'none') return 0;
            const isProfile = watchBalanceType === 'profile';
            const balanceKey = isProfile ? 'profile_balance' : 'balance';
            const currentBalance = userInfo[balanceKey] || 0;
            const newBalance =
              watchOperation === 'add'
                ? currentBalance + Number(amount)
                : currentBalance - Number(amount);

            return isProfile ? `${fNumber(newBalance)} hồ sơ` : fCurrencyVND(newBalance);
          })()}
        </Box>
      </Stack>
    </Stack>
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <Stack spacing={2} p={3}>
        <Typography variant="h6">Cập nhật số dư</Typography>
        <Divider />
      </Stack>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2} p={3} pt={1}>
          <RHFSelect size="small" name="balance_type" label="Đơn vị">
            {BALANCE_TYPES.map((option) => (
              <MenuItem key={option.id} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect size="small" name="operation">
            {OPERATIONS.map((option) => (
              <MenuItem key={option.id} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFTextField
            name="description"
            multiline
            rows={3}
            label="Nội dụng"
            placeholder="Viết nội dung tại đây..."
            sx={{
              '& ::-webkit-scrollbar': {
                width: '3px',
              },
              '& ::-webkit-scrollbar-thumb': {
                backgroundColor: (theme) => theme.palette.grey[700],
                borderRadius: '4px',
              },
            }}
          />
          <Stack>
            <InputAmount
              error={errorMessage}
              balanceType={watchBalanceType}
              operation={watchOperation}
              onBlur={handleBlur}
              onChange={handleChangeInput}
              autoWidth={autoWidth}
              amount={amount}
              disableUnderline={false}
              sx={{ justifyContent: 'flex-end' }}
            />
            {errorMessage && (
              <Typography variant="caption" sx={{ color: 'error.main', textAlign: 'right' }}>
                {errorMessage}
              </Typography>
            )}
          </Stack>

          <Divider
            sx={{ borderStyle: 'dashed', borderColor: (theme) => theme.palette.grey[500] }}
          />

          {renderTotal}

          <Stack direction="row" spacing={2} justifyContent="end">
            <Button onClick={handleClose} variant="outlined">
              Đóng
            </Button>
            <LoadingButton loading={isPending} type="submit" color="primary" variant="contained">
              Xác nhận
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Dialog>
  );
};

export default UpdateBalanceDialog;

UpdateBalanceDialog.propTypes = {
  open: PropTypes.bool,
  userInfo: PropTypes.object,
  onClose: PropTypes.func,
  handleReload: PropTypes.func,
};

// ----------------------------------------------------------------------

function InputAmount({
  autoWidth,
  amount,
  onBlur,
  onChange,
  sx,
  balanceType,
  operation,
  error,
  ...other
}) {
  return (
    <Stack>
      <Stack direction="row" justifyContent="center" spacing={1} sx={sx}>
        <Input
          disableUnderline
          size="small"
          autoFocus
          error={!!error}
          value={amount}
          onChange={onChange}
          onBlur={onBlur}
          inputProps={{
            step: 1,
            min: 0,
            type: 'number',
          }}
          sx={{
            [`& .${inputClasses.input}`]: {
              p: 0,
              typography: 'h3',
              textAlign: 'center',
              width: autoWidth,
              color: operation === 'add' ? 'primary.main' : 'error.main',
            },
          }}
          onWheel={(e) => e.target.blur()}
          {...other}
        />

        <Typography variant="h5" color={operation === 'add' ? 'primary' : 'error'}>
          {(balanceType === 'profile' && 'hồ sơ') || (balanceType === 'profile' && '₫') || ''}
        </Typography>
      </Stack>
    </Stack>
  );
}

InputAmount.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  balanceType: PropTypes.string,
  operation: PropTypes.string,
  error: PropTypes.string,
  autoWidth: PropTypes.number,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  sx: PropTypes.object,
};
