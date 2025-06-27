import { memo, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// mui
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  alpha,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { sharePublishWorkflow, shareWorkflow } from 'src/api/workflow.api';
import { enqueueSnackbar } from 'notistack';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFRadioGroup, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';

const ShareWorkflowDialog = ({ open, onClose, shareId, type = 'publish' }) => {
  const FormSchema = Yup.object().shape({
    is_encrypted: Yup.string().required('Trường này là bắt buộc'),
    is_limited: Yup.string().required('Trường này là bắt buộc'),
    number_of_uses: Yup.number().when('is_limited', {
      is: (value) => value === 'true',
      then: (schema) =>
        schema
          .required('Trường này là bắt buộc')
          .min(1, 'Giá trị tối thiểu là 1')
          .typeError('Giá trị không hợp lệ'),
      otherwise: (schema) => schema.notRequired(),
    }),
    is_expiry_time: Yup.string().required('Trường này là bắt buộc'),
    expiry_time: Yup.number().when('is_expiry_time', {
      is: (value) => value === 'true',
      then: (schema) =>
        schema
          .required('Trường này là bắt buộc')
          .min(1, 'Giá trị tối thiểu là 1')
          .typeError('Giá trị không hợp lệ'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const { copy } = useCopyToClipboard();
  const [displayCopyTooltip, setDisplayCopyTooltip] = useState(false);
  const [shareCode, setShareCode] = useState('');

  const defaultValues = useMemo(
    () => ({
      is_encrypted: 'true',
      is_limited: 'true',
      is_expiry_time: 'true',
      expiry_time: 24,
      number_of_uses: 1,
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const watchIsLimited = watch('is_limited');
  const watchIsExpiryTime = watch('is_expiry_time');

  const onSubmit = handleSubmit(async (data) => {
    data.is_encrypted = data.is_encrypted === 'true';
    data.is_limited = data.is_limited === 'true';
    data.is_expiry_time = data.is_expiry_time === 'true';
    try {
      setShareCode('');

      let response;

      if (type === 'publish') {
        response = await sharePublishWorkflow(shareId, data);
      } else {
        response = await shareWorkflow(shareId, data);
      }
      if (response?.data) {
        const { activation_code } = response.data;
        setShareCode(activation_code);
      }
    } catch (error) {
      if (error?.message) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else {
        enqueueSnackbar('Thao tác thất bại!', { variant: 'error' });
      }
    }
  });

  const handleClose = () => {
    onClose();
    setShareCode('');
    reset();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle
          sx={{
            pb: 0,
          }}
        >
          Chia sẻ quy trình bằng mã kích hoạt
        </DialogTitle>
        <DialogContent
          sx={{
            '&.MuiDialogContent-root': {
              pt: 3,
            },
          }}
        >
          <Stack spacing={2}>
            <RHFRadioGroup
              row
              spacing={4}
              name="is_encrypted"
              label="Mã hóa quy trình"
              options={[
                { value: true, label: 'Mã hóa' },
                { value: false, label: 'Không mã hóa' },
              ]}
            />
            <Stack spacing={1}>
              <RHFRadioGroup
                row
                spacing={4}
                name="is_limited"
                label="Giới hạn số lần nhập"
                options={[
                  { value: true, label: 'Có giới hạn' },
                  { value: false, label: 'Không giới hạn' },
                ]}
              />
              {watchIsLimited && watchIsLimited !== 'false' && (
                <RHFTextField
                  type="number"
                  name="number_of_uses"
                  label="Số lần giới hạn nhập"
                  size="small"
                />
              )}
            </Stack>

            <Stack spacing={1}>
              <RHFRadioGroup
                row
                spacing={4}
                name="is_expiry_time"
                label="Giới hạn thời gian nhập mã"
                options={[
                  { value: true, label: 'Có giới hạn' },
                  { value: false, label: 'Khôn giới hạn' },
                ]}
              />

              {watchIsExpiryTime && watchIsExpiryTime !== 'false' && (
                <RHFTextField type="number" name="expiry_time" label="Số giờ" size="small" />
              )}
            </Stack>

            <Divider sx={{ my: 1 }} />

            <TextField
              fullWidth
              size="small"
              value={shareCode}
              placeholder='Click vào "Tạo mã" để lấy mã kích hoạt'
              readOnly
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                pointerEvents: 'none',
                border: '1px solid',
                borderColor: (theme) => alpha(theme.palette.grey[500], 0.32),
                borderRadius: 1,
              }}
              InputProps={{
                endAdornment: (
                  <Tooltip
                    onClose={() => setDisplayCopyTooltip(false)}
                    open={displayCopyTooltip}
                    title="Sao chép"
                    placement="top"
                  >
                    <IconButton
                      onClick={() => {
                        setDisplayCopyTooltip(true);
                        copy(shareCode);
                        enqueueSnackbar('Đã sao chép!');
                      }}
                      sx={{
                        marginLeft: 1,
                        pointerEvents: 'auto',
                      }}
                    >
                      <Iconify icon="solar:copy-bold-duotone" />
                    </IconButton>
                  </Tooltip>
                ),
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Đóng
          </Button>
          <LoadingButton
            loading={isSubmitting}
            disabled={isSubmitting}
            variant="contained"
            type="submit"
          >
            Tạo mã
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default memo(ShareWorkflowDialog);

ShareWorkflowDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  shareId: PropTypes.number,
  type: PropTypes.string,
};
