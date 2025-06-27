import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import { Button, Dialog, Divider, MenuItem, Stack, Typography } from '@mui/material';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFRadioGroup, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import { ERROR_CODE } from 'src/utils/constance';
import { formatErrors } from 'src/utils/format-errors';
import { createPermissionApi, updatePermissionApi } from 'src/api/permission.api';

const CreateEditPermissionDialog = ({
  open,
  onClose,
  handleReloadData,
  groupOptions,
  onRefreshGroup,
  updateData,
  setUpdateData,
}) => {
  const userSchema = Yup.object().shape({
    name: Yup.string().required('Tên không được để trống'),
    description: Yup.string().required('Mô tả không được để trống'),
    slug: Yup.string().required('Slug không được để trống'),
    type: Yup.string().required('Loại không được để trống'),
    parent: Yup.string()
      .nullable()
      .when('type', {
        is: 'permission',
        then: (schema) => schema.required('Vui lòng chọn nhóm quyền'),
        otherwise: (schema) => schema.nullable(true),
      }),
  });

  const defaultValues = useMemo(
    () => ({
      name: updateData?.name || '',
      description: updateData?.description || '',
      slug: updateData?.slug || '',
      type: (updateData?.id && updateData?.parent?.id) || !updateData?.id ? 'permission' : 'group',
      parent: updateData?.parent?.id || '',
    }),
    [
      updateData?.description,
      updateData?.id,
      updateData?.name,
      updateData?.parent?.id,
      updateData?.slug,
    ]
  );

  const methods = useForm({
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { isSubmitting },
  } = methods;

  const watchType = watch('type');

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { name, description, slug, parent, type } = data;
      const payload = {
        name,
        description,
        slug,
        parent: type === 'permission' ? parent : null,
      };

      if (updateData?.id) {
        await updatePermissionApi(updateData.id, payload);
      } else {
        await createPermissionApi(payload);
      }
      if (type === 'group') {
        onRefreshGroup();
      }
      handleReloadData();
      handleClose();
      enqueueSnackbar(
        `${updateData?.id ? 'Cập nhật' : 'Thêm'} ${
          type === 'permission' ? 'quyền' : 'nhóm quyền'
        } thành công!`,
        {
          variant: 'success',
        }
      );
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
    reset();
    setUpdateData(null);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <Stack spacing={2} p={3}>
        <Typography variant="h6">
          {updateData?.id
            ? `Chỉnh sửa ${watchType === 'permission' ? '' : 'nhóm'} quyền`
            : `Thêm ${watchType === 'permission' ? '' : 'nhóm'} quyền`}
        </Typography>
        <Divider />
      </Stack>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2} p={3} pt={0}>
          <>
            <RHFTextField
              name="name"
              label={`Tên ${watchType === 'permission' ? '' : 'nhóm'} quyền`}
              placeholder={`Vui lòng nhập tên ${watchType === 'permission' ? '' : 'nhóm'} quyền`}
            />
            <RHFTextField name="slug" label="Slug" placeholder="Vui lòng nhập slug" />
            <RHFTextField
              name="description"
              label="Mô tả "
              placeholder="Vui lòng nhập mô tả"
              rows={4}
              multiline
            />
            {((updateData?.id && updateData?.parent?.id) || !updateData?.id) && (
              <RHFRadioGroup
                row
                spacing={4}
                name="type"
                label="Loại"
                options={[
                  { value: 'permission', label: 'Quyền' },
                  { value: 'group', label: 'Nhóm quyền' },
                ]}
              />
            )}
            {watchType === 'permission' && (
              <RHFSelect
                fullWidth
                name="parent"
                label="Nhóm"
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {groupOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}
          </>

          <Stack direction="row" spacing={2} justifyContent="end">
            <Button onClick={handleClose} variant="outlined">
              Đóng
            </Button>
            <LoadingButton loading={isSubmitting} type="submit" color="primary" variant="contained">
              {updateData?.id ? 'Cập nhật' : 'Thêm'}
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Dialog>
  );
};

export default CreateEditPermissionDialog;

CreateEditPermissionDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  handleReloadData: PropTypes.func,
  onRefreshGroup: PropTypes.func,
  groupOptions: PropTypes.array,
  updateData: PropTypes.object,
  setUpdateData: PropTypes.func,
};
