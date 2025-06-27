import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import { Button, Dialog, Divider, Stack, Typography } from '@mui/material';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFRadioGroup, RHFTextField, RHFUpload } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import { ERROR_CODE } from 'src/utils/constance';
import { formatErrors } from 'src/utils/format-errors';
import { createBannerApi, updateBannerApi } from 'src/api/banner.api';

const CreateEditBannerDialog = ({ open, onClose, handleReloadData, updateData, setUpdateData }) => {
  const userSchema = Yup.object().shape({
    title: Yup.string().required('Tiêu đề không được để trống'),
    banner_image: Yup.mixed().required('Vui lòng chọn hình ảnh'),
    link: Yup.string().required('Đương dẫn không được để trống'),
    link_type: Yup.string().required('Đương dẫn không được để trống'),
    is_active: Yup.string().required('Trạng thái không được để trống'),
  });

  const defaultValues = useMemo(
    () => ({
      title: updateData?.title ?? '',
      banner_image: updateData?.image_url ?? null,
      link: updateData?.link ?? '',
      link_type: updateData?.link_type ?? 'outside',
      is_active: updateData?.is_active ? 'true' : 'false',
    }),
    [
      updateData?.title,
      updateData?.image_url,
      updateData?.link,
      updateData?.link_type,
      updateData?.is_active,
    ]
  );

  const methods = useForm({
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { title, banner_image, link, link_type, is_active } = data;
      const formData = new FormData();
      formData.append('title', title);
      if (typeof banner_image === 'object') {
        formData.append('banner_image', banner_image);
      }
      formData.append('link', link);
      formData.append('link_type', link_type);
      formData.append('is_active', is_active);

      if (updateData?.id) {
        await updateBannerApi(updateData.id, formData);
      } else {
        await createBannerApi(formData);
      }
      handleReloadData();
      handleClose();
      enqueueSnackbar(`${updateData?.id ? 'Cập nhật' : 'Tạo'} banner thành công!`, {
        variant: 'success',
      });
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

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('banner_image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleClose = () => {
    onClose();
    reset();
    setUpdateData(null);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <Stack spacing={2} p={3}>
        <Typography variant="h6">{updateData?.id ? `Chỉnh sửa banner` : `Tạo banner`}</Typography>
        <Divider />
      </Stack>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3} p={3} pt={0}>
          <RHFTextField name="title" label="Tiêu đề banner" placeholder="Vui lòng nhập tiêu đề" />

          <RHFUpload
            name="banner_image"
            maxSize={3145728}
            accept={{ 'image/*': [] }}
            onDrop={handleDrop}
            onDelete={() => setValue('banner_image', null)}
            helperText="Chấp nhận file hình ảnh với kích thước tối đa 3 Mb"
            sx={{
              '& .MuiStack-root > svg.MuiBox-root': {
                height: 80,
              },
              '&.MuiBox-root > .MuiBox-root': {
                height: 180,
                p: 2,
              },
              '& .MuiStack-root': {
                rowGap: 1,
              },
              '& img': {
                objectFit: 'contain',
              },
            }}
          />

          <RHFTextField name="link" label="Đường dẫn" placeholder="Vui lòng nhập đường dẫn" />

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

          <RHFRadioGroup
            row
            spacing={4}
            name="link_type"
            label="Loại đường dẫn"
            options={[
              { value: 'inside', label: 'Mở trên ứng dụng' },
              { value: 'outside', label: 'Mở trên trình duyệt' },
            ]}
          />

          <Stack direction="row" spacing={2} justifyContent="end">
            <Button onClick={handleClose} variant="outlined">
              Đóng
            </Button>
            <LoadingButton loading={isSubmitting} type="submit" color="primary" variant="contained">
              {updateData?.id ? 'Cập nhật' : 'Tạo'}
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Dialog>
  );
};

export default CreateEditBannerDialog;

CreateEditBannerDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleReloadData: PropTypes.func,
  updateData: PropTypes.object,
  setUpdateData: PropTypes.func,
};
