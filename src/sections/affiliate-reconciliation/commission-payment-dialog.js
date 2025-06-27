import { useState } from 'react';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';
// mui
import { LoadingButton } from '@mui/lab';
import { Stack, TextField } from '@mui/material';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ERROR_CODE } from 'src/utils/constance';
import { commissionPaymentApi } from 'src/api/affiliate.api';
// apis

const UpdateCommissionPaymentDialog = ({ open, onClose, paymentId, handleReload }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    onClose();
    setNote('');
  };

  const handleCommissionPayment = async () => {
    try {
      setLoading(true);
      const payload = {
        note,
      };
      await commissionPaymentApi(paymentId, payload);
      handleReload();
      enqueueSnackbar('Thanh toán thành công!', { variant: 'success' });
    } catch (error) {
      console.log(error);
      if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
        enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
      }
      if (error?.error_code === ERROR_CODE.NOT_PAYMENT_INFO) {
        enqueueSnackbar('Vui lòng cập nhật thông tin thanh toán!', { variant: 'error' });
      } else {
        enqueueSnackbar('Có lỗi đã xẩy ra, vui lòng thử lại sau!', { variant: 'error' });
      }
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={handleClose}
      title="Thanh toán tiền hoa hồng?"
      type="payment"
      content={
        <Stack pt={1}>
          <TextField
            multiline
            rows={4}
            fullWidth
            label="Nhập ghi chú"
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
            }}
          />
        </Stack>
      }
      action={
        <LoadingButton
          loading={loading}
          variant="contained"
          color="primary"
          onClick={handleCommissionPayment}
        >
          Xác nhận
        </LoadingButton>
      }
    />
  );
};

export default UpdateCommissionPaymentDialog;

UpdateCommissionPaymentDialog.propTypes = {
  open: PropTypes.bool,
  paymentId: PropTypes.string,
  onClose: PropTypes.func,
  handleReload: PropTypes.func,
};
