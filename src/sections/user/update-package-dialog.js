import { useState } from 'react';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';
// mui
import { LoadingButton } from '@mui/lab';
import { MenuItem, Stack, TextField } from '@mui/material';
// components
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ERROR_CODE } from 'src/utils/constance';
import { useProfilePackageAPi } from 'src/api/profile-package.api';
import Iconify from 'src/components/iconify';
import { useUpdatePackage } from 'src/tanstack/use-user';
// apis

const UpdatePackageDialog = ({ open, onClose, userInfo, handleReload }) => {
  const [packageId, setPackageId] = useState('');

  const [errorMess, setErrorMess] = useState('');
  const { profilePackage, profilePackageLoading } = useProfilePackageAPi();

  const handleClose = () => {
    onClose();
    setPackageId('');
    setErrorMess('');
  };

  const { mutate, isPending } = useUpdatePackage();

  const handleUpdatePackage = async () => {
    if (packageId === '') {
      setErrorMess('Vui lòng chọn một gói hồ sơ');
      return;
    }

    const payload = {
      profile_package_id: packageId,
    };

    mutate(
      {
        userId: userInfo.id,
        payload,
      },
      {
        onSuccess: () => {
          enqueueSnackbar('Cập nhật gói hồ sơ thành công!', { variant: 'success' });
          handleClose();
        },
        onError: (error) => {
          if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
            handleClose();
            enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
          } else {
            handleClose();
            enqueueSnackbar('Có lỗi đã xẩy ra, vui lòng thử lại sau!', { variant: 'error' });
          }
          handleClose();
        },
      }
    );
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={handleClose}
      title="Cập nhật gói hồ sơ"
      type="update"
      content={
        <Stack pt={1}>
          <TextField
            error={!!errorMess}
            helperText={errorMess}
            select
            fullWidth
            label="Chọn gói hồ sơ"
            value={packageId}
            onChange={(event) => {
              if (errorMess) setErrorMess('');
              setPackageId(event.target.value);
            }}
          >
            {profilePackageLoading ? (
              <MenuItem>
                <Iconify
                  icon="line-md:loading-loop"
                  sx={{
                    mx: 'auto',
                  }}
                />
              </MenuItem>
            ) : (
              profilePackage.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))
            )}
          </TextField>
        </Stack>
      }
      action={
        <LoadingButton
          loading={isPending}
          variant="contained"
          color="primary"
          onClick={handleUpdatePackage}
        >
          Cập nhật
        </LoadingButton>
      }
    />
  );
};

export default UpdatePackageDialog;

UpdatePackageDialog.propTypes = {
  open: PropTypes.bool,
  userInfo: PropTypes.object,
  onClose: PropTypes.func,
  handleReload: PropTypes.func,
};
