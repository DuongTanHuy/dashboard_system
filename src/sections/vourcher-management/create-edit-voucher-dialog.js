import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { styled } from '@mui/material/styles';

import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import {
  Button,
  Dialog,
  Divider,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFRadioGroup, RHFSlider, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import { ERROR_CODE } from 'src/utils/constance';
import { formatErrors } from 'src/utils/format-errors';
import { DatePicker } from '@mui/x-date-pickers';
import { fDate } from 'src/utils/format-time';
import Iconify from 'src/components/iconify';
import { cloneDeep } from 'lodash';
import { useCreateVoucher, useUpdateVoucher } from 'src/tanstack/use-voucher';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  backgroundColor: 'transparent',
  border: '1px solid #eeeeee24',
  borderRadius: '4px',
  '& .MuiAccordionSummary-content': {
    margin: 0,
  },
  '&.Mui-expanded': {
    margin: 0,
    boxShadow: 'none',
  },
  '& .MuiButtonBase-root.MuiAccordionSummary-root.Mui-expanded': {
    // minHeight: '48px',
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<Iconify icon="mingcute:right-line" />} {...props} />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
    transform: 'rotate(90deg)',
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const CONDITION_OPTIONS = [{ id: 'user_created_at', label: 'Ngày đăng ký' }];

const CreateEditVoucherDialog = ({
  open,
  onClose,
  handleReloadData,
  updateData,
  setUpdateData,
}) => {
  const userSchema = Yup.object().shape({
    name: Yup.string().required('Tên voucher không được để trống'),
    code: Yup.string().required('Mã voucher không được để trống'),
    user_usage_limit: Yup.number()
      .min(1, 'Số lượt sử dụng/người phải lớn hơn 0')
      .required('Số lượt sử dụng/người không được để trống'),
    voucher_usage_limit: Yup.number()
      .min(1, 'Số lượng voucher phải lớn hơn 0')
      .required('Số lượng voucher không được để trống'),
    voucher_type: Yup.string().required('Loại voucher không được để trống'),
    discount: Yup.number()
      .min(1, 'Giá trị giảm phải lớn hơn 0')
      .required('Giá trị giảm không được để trống'),
    date_expired: Yup.date().required('Ngày hết hạn không được để trống'),
    is_active: Yup.string().required('Trạng thái không được để trống'),
  });

  const [condition, setCondition] = useState([]);
  const [errorDate, setErrorDate] = useState(false);

  const defaultValues = useMemo(() => {
    if (updateData?.cond_type === 'user_created_at') {
      setCondition([
        {
          id: Math.random(),
          type: 'user_created_at',
          value: {
            start_date: updateData?.cond_start_date ? new Date(updateData?.cond_start_date) : null,
            end_date: updateData?.cond_end_date ? new Date(updateData?.cond_end_date) : null,
          },
        },
      ]);
    }
    return {
      name: updateData?.name ?? '',
      code: updateData?.code ?? '',
      user_usage_limit: updateData?.name ? updateData?.user_usage_limit : 1,
      voucher_usage_limit: updateData?.name ? updateData?.voucher_usage_limit : 1,
      voucher_type: updateData?.voucher_type ?? 'percentage',
      discount: updateData?.discount ?? 0,
      date_expired: updateData?.date_expired ? new Date(updateData?.date_expired) : null,
      is_active: updateData?.is_active ? 'true' : 'false',
      cond_type: updateData?.cond_type || '',
    };
  }, [
    updateData?.cond_type,
    updateData?.name,
    updateData?.code,
    updateData?.user_usage_limit,
    updateData?.voucher_usage_limit,
    updateData?.voucher_type,
    updateData?.discount,
    updateData?.date_expired,
    updateData?.is_active,
    updateData?.cond_start_date,
    updateData?.cond_end_date,
  ]);

  const addNewCondition = () => {
    const _clone = cloneDeep(condition);
    _clone.push({
      id: _clone.length + Math.random(),
      type: 'user_created_at',
      value: {
        start_date: null,
        end_date: null,
      },
    });

    setCondition(_clone);
  };

  const updateCondition = (name, event, id) => {
    const _clone = cloneDeep(condition);
    const _find = _clone.findIndex((i) => i.id === id);
    if (name === 'value') {
      setErrorDate(false);
      _clone[_find].value[event.target.name] = event.target.value;
    } else {
      _clone[_find][name] = event.target.value;
    }

    setCondition(_clone);
  };

  const deleteCondition = (id) => {
    const _find = condition.findIndex((i) => i.id === id);
    const _clone = cloneDeep(condition);
    _clone.splice(_find, 1);

    setCondition(_clone);
  };

  const methods = useForm({
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  const { handleSubmit, reset, watch, setValue, control, setError } = methods;

  const watchType = watch('voucher_type');
  const watchCondition = watch('cond_type');

  const { mutateAsync: createVoucher, isPending: isCreating } = useCreateVoucher();
  const { mutateAsync: updateVoucher, isPending: isUpdating } = useUpdateVoucher();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const {
        name,
        code,
        user_usage_limit,
        voucher_usage_limit,
        voucher_type,
        discount,
        date_expired,
        is_active,
        cond_type,
      } = data;

      if (cond_type && !condition[0]?.value.start_date && !condition[0]?.value.end_date) {
        setErrorDate(true);
        return;
      }

      const payload = {
        name,
        code,
        user_usage_limit,
        voucher_usage_limit,
        voucher_type,
        discount,
        date_expired: fDate(date_expired, 'yyyy-MM-dd'),
        is_active: is_active === 'true',
        cond_type,
        ...(cond_type && {
          cond_start_date: condition[0].value.start_date
            ? fDate(condition[0].value.start_date, 'yyyy-MM-dd')
            : null,

          cond_end_date: condition[0].value.end_date
            ? fDate(condition[0].value.end_date, 'yyyy-MM-dd')
            : condition[0].value.end_date,
        }),
      };

      if (updateData?.id) {
        await updateVoucher(
          {
            voucherId: updateData.id,
            payload,
          },
          {
            onSuccess: () => {
              enqueueSnackbar('Cập nhật voucher thành công!', {
                variant: 'success',
              });
              handleClose();
            },
          }
        );
      } else {
        await createVoucher(payload, {
          onSuccess: () => {
            enqueueSnackbar('Thêm voucher thành công!', {
              variant: 'success',
            });
            handleClose();
          },
        });
      }
    } catch (error) {
      console.log(error);
      if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
        enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
        handleClose();
      } else if (error?.error_fields) {
        formatErrors(error.error_fields, setError);
      } else {
        enqueueSnackbar('Có lỗi đã xẩy ra, vui lòng thử lại sau!', { variant: 'error' });
      }
    }
  });

  const handleClose = () => {
    onClose();
    setCondition([]);
    setErrorDate(false);
    reset();
    setUpdateData(null);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (watchType === 'percentage') {
      setValue('discount', 0);
    } else {
      setValue('discount', 0);
    }
  }, [watchType, setValue]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <Stack spacing={2} p={3}>
        <Typography variant="h6">
          {updateData?.id ? `Chỉnh sửa voucher` : `Thêm voucher`}
        </Typography>
        <Divider />
      </Stack>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3} p={3} pt={0}>
          <RHFTextField name="name" label="Tên voucher" placeholder="Vui lòng nhập tên voucher" />
          <RHFTextField name="code" label="Mã voucher" placeholder="Vui lòng nhập mã voucher" />
          <Stack direction="row" spacing={3}>
            <RHFTextField
              name="user_usage_limit"
              label="Số lượt / người"
              placeholder="Nhập số lượt sử dụng/người"
              type="number"
            />
            <RHFTextField
              name="voucher_usage_limit"
              label="Số lượng voucher"
              placeholder="Nhập số lượng voucher"
              type="number"
            />
          </Stack>

          <Controller
            name="date_expired"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                {...field}
                label="Ngày hết hạn"
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    placeholder: 'Ngày/Tháng/Năm',
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
                sx={{
                  '& .MuiButtonBase-root.MuiIconButton-root': {
                    zIndex: 1,
                  },
                }}
              />
            )}
          />

          <RHFRadioGroup
            row
            spacing={4}
            name="voucher_type"
            label="Loại voucher"
            options={[
              { value: 'percentage', label: 'Phần trăm' },
              { value: 'amount', label: 'Giá trị cố định' },
            ]}
          />

          {watchType === 'percentage' && (
            <RHFSlider
              name="discount"
              label="Giá trị giảm"
              getAriaValueText={(value) => `${value}%`}
              marks={Array.from({ length: 11 }, (_, i) => ({
                value: i * 10,
                label: `${i * 10}%`,
              }))}
              min={0}
              max={100}
            />
          )}

          {watchType === 'amount' && (
            <RHFTextField
              name="discount"
              label="Giá trị giảm"
              placeholder="Vui lòng nhập giá trị giảm"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">VND</InputAdornment>,
              }}
            />
          )}

          <RHFRadioGroup
            row
            spacing={4}
            name="cond_type"
            label="Điều kiện sử dụng"
            options={[
              { value: 'user_created_at', label: 'Có điều kiện' },
              { value: '', label: 'Không có diều kiện' },
            ]}
          />

          {watchCondition === 'user_created_at' && (
            <Stack spacing={1}>
              <Accordion defaultExpanded>
                <AccordionSummary>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    width={1}
                    pl={0.5}
                  >
                    <Typography variant="body2">Điều kiện</Typography>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<Iconify icon="solar:add-circle-linear" width={20} />}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        addNewCondition();
                      }}
                      disabled={condition.length >= 1}
                    >
                      Thêm
                    </Button>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    pt: 1,
                    ...(condition.length === 0 && { p: 0 }),
                  }}
                >
                  <Stack spacing={1}>
                    {condition.map((item) => (
                      <Stack key={item.id} spacing={1}>
                        <Stack
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center"
                          spacing={2}
                          width={1}
                        >
                          <TextField
                            select
                            label="Loại điều kiện"
                            value={item.type}
                            onChange={(e) => updateCondition('type', e, item.id)}
                            size="small"
                            sx={{
                              width: 240,
                            }}
                          >
                            {CONDITION_OPTIONS.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>

                          <DatePicker
                            label="Ngày bắt đầu"
                            name='start_date"'
                            value={item.value.start_date}
                            onChange={(value) => {
                              updateCondition(
                                'value',
                                {
                                  target: {
                                    name: 'start_date',
                                    value,
                                  },
                                },
                                item.id
                              );
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                placeholder: 'Ngày/Tháng/Năm',
                                size: 'small',
                                error: errorDate,
                              },
                            }}
                            sx={{
                              width: 'fit-content',
                              '& svg': {
                                zIndex: 1,
                              },
                            }}
                          />
                          <DatePicker
                            label="Ngày kết thúc"
                            name="end_date"
                            value={item.value.end_date}
                            onChange={(value) => {
                              updateCondition(
                                'value',
                                {
                                  target: {
                                    name: 'end_date',
                                    value,
                                  },
                                },
                                item.id
                              );
                            }}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                placeholder: 'Ngày/Tháng/Năm',
                                size: 'small',
                                error: errorDate,
                              },
                            }}
                            sx={{
                              width: 'fit-content',
                              '& svg': {
                                zIndex: 1,
                              },
                            }}
                          />

                          <Iconify
                            onClick={() => deleteCondition(item.id)}
                            icon="carbon:close-outline"
                            sx={{
                              width: '35px',
                              color: 'text.disabled',
                              '&:hover': { cursor: 'pointer', color: 'white' },
                            }}
                          />
                        </Stack>
                        {errorDate && (
                          <Typography
                            sx={{
                              color: 'error.main',
                            }}
                            variant="caption"
                          >
                            Vui lòng nhập ít nhất một trường thời gian
                          </Typography>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
              {condition.length === 0 && errorDate && (
                <Typography
                  sx={{
                    color: 'error.main',
                  }}
                  variant="caption"
                >
                  Vui lòng nhập ít nhất một trường thời gian
                </Typography>
              )}
            </Stack>
          )}

          <RHFRadioGroup
            row
            spacing={4}
            name="is_active"
            label="Trạng thái"
            options={[
              { value: true, label: 'Hoạt động' },
              { value: false, label: 'Không hoạt động' },
            ]}
          />

          <Stack direction="row" spacing={2} justifyContent="end">
            <Button onClick={handleClose} variant="outlined">
              Đóng
            </Button>
            <LoadingButton
              loading={isCreating || isUpdating}
              type="submit"
              color="primary"
              variant="contained"
            >
              {updateData?.id ? 'Cập nhật' : 'Thêm'}
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Dialog>
  );
};

export default CreateEditVoucherDialog;

CreateEditVoucherDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleReloadData: PropTypes.func,
  updateData: PropTypes.object,
  setUpdateData: PropTypes.func,
};
