import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import {
  Button,
  ButtonBase,
  Card,
  Container,
  IconButton,
  InputAdornment,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';
import { LoadingButton } from '@mui/lab';
import { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { ZaLoIcon } from 'src/assets/icons';
import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import { updateSystemConfigApi } from 'src/api/system-config.api';
import { ERROR_CODE } from 'src/utils/constance';
import AlertDialogAdvanced from 'src/components/ask-before-leave-advanced';
import AddHotlineDialog from './add-hotline-dialog';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function SystemSettingView({ configData, reload }) {
  const settings = useSettingsContext();
  const popover = usePopover();
  const open = useBoolean();

  const { enqueueSnackbar } = useSnackbar();
  const [idPriority, setIdPriority] = useState();

  const userSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      zalo_link: configData?.zalo_link || '',
      telegram_link: configData?.telegram_link || '',
      fb_page_link: configData?.fb_page_link || '',
      fb_group_link: configData?.fb_group_link || '',
      youtube_link: configData?.youtube_link || '',
      email: configData?.email || '',
      hotline: configData?.hotline || [],
      server_profile_backup: configData?.server_profile_backup || [],
    }),
    [
      configData?.email,
      configData?.fb_group_link,
      configData?.fb_page_link,
      configData?.hotline,
      configData?.server_profile_backup,
      configData?.telegram_link,
      configData?.youtube_link,
      configData?.zalo_link,
    ]
  );

  const methods = useForm({
    resolver: yupResolver(userSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, isDirty },
  } = methods;

  const watchHotline = watch('hotline');
  const watchProfileBackup = watch('server_profile_backup');

  const GROUPS = useMemo(
    () => [
      {
        subheader: 'Nhóm hỗ trợ',
        caption: 'Cập nhật đường dãn của các nhóm hỗ trợ',
        items: [
          {
            id: 'fb_group_link',
            label: 'Đường dẫn của nhóm Facebook',
            icon: 'logos:facebook',
          },
          {
            id: 'zalo_link',
            label: 'Đường dẫn của nhóm Zalo',
          },
          {
            id: 'telegram_link',
            label: 'Đường dẫn của nhóm Telegram',
            icon: 'logos:telegram',
          },
        ],
      },
      {
        subheader: 'Liên kết cộng đồng',
        caption: 'Cập nhật đường dãn của các nhóm cộng đồng',
        items: [
          {
            id: 'youtube_link',
            label: 'Đường dẫn của kênh Youtube',
            icon: 'logos:youtube-icon',
          },
          {
            id: 'fb_page_link',
            label: 'Đường dẫn của nhóm Facebook',
            icon: 'logos:facebook',
          },
        ],
      },
      {
        subheader: 'Hòm thư',
        caption: 'Cập nhật địa chỉ hòm thư',
        items: [{ id: 'email', label: 'Địa chỉ hòm thư', icon: 'skill-icons:gmail-light' }],
      },
      {
        id: 'hotline',
        subheader: 'Đường dây nóng',
        caption: 'Cập nhật đường dây nóng',
        items: watchHotline || [],
        action: 'Thêm',
      },
      {
        id: 'server_profile_backup',
        subheader: 'Máy chủ sao lưu',
        caption: 'Cập nhật máy chủ sao lưu hồ sơ',
        items: [
          {
            host: 'https://net.cronpost.net',
            name: 'NV NET',
            priority: 1,
          },
          {
            host: 'https://apidev.mktlogin.com',
            name: 'GS',
            priority: 2,
          },
        ],
        action: 'Thêm',
      },
    ],
    [watchHotline]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateSystemConfigApi(data);
      reload();
      enqueueSnackbar('Cập nhật thành công!');
    } catch (error) {
      console.log(error);
      if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
        enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
      } else {
        enqueueSnackbar('Có lỗi đã xẩy ra, vui lòng thử lại sau!', { variant: 'error' });
      }
    }
  });

  const addNewProfileBackup = () => {
    const _clone = cloneDeep(watchProfileBackup);
    _clone.push({
      host: '',
      name: '',
      priority: _clone.length + 1,
    });

    setValue('server_profile_backup', _clone, { shouldDirty: true });
  };

  const updateProfileBackup = (name, event, index) => {
    const _clone = cloneDeep(watchProfileBackup);
    _clone[index][name] = event.target.value;
    setValue('server_profile_backup', _clone, { shouldDirty: true });
  };

  const updatePriority = (value, index) => {
    const _clone = cloneDeep(watchProfileBackup);

    const _find = watchProfileBackup.findIndex(
      (i) => i.priority === value && i.host !== _clone[index].host
    );

    if (_find !== -1) {
      _clone[index].priority = value;
      _clone[_find].priority = watchProfileBackup[index].priority;
    }
    setValue('server_profile_backup', _clone, { shouldDirty: true });
  };

  const deleteHotline = (index) => {
    const _clone = cloneDeep(watchProfileBackup);
    _clone.splice(index, 1);
    const sortData = _clone
      .sort((a, b) => a.priority - b.priority)
      .map((item, ind) => ({
        ...item,
        priority: ind + 1,
      }));
    setValue('server_profile_backup', sortData, { shouldDirty: true });
  };

  useEffect(() => {
    if (configData?.id) {
      reset(defaultValues);
    }
  }, [configData?.id, defaultValues, reset]);

  return (
    <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
      <AlertDialogAdvanced isBlocking={isDirty} />
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Stack component={Card} spacing={3} sx={{ p: 3 }}>
              {GROUPS.map((group) => (
                <Grid key={group.subheader} container spacing={3}>
                  <Grid xs={12} md={4}>
                    <ListItemText
                      primary={group.subheader}
                      secondary={group.caption}
                      primaryTypographyProps={{ typography: 'h6', mb: 0.5 }}
                      secondaryTypographyProps={{ component: 'span' }}
                    />
                  </Grid>

                  <Grid xs={12} md={8}>
                    <Stack
                      spacing={2}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: 'background.neutral',
                      }}
                    >
                      {(group?.id === 'server_profile_backup' &&
                        watchProfileBackup
                          .sort((a, b) => a.priority - b.priority)
                          .map((item, index) => (
                            <Stack
                              key={index}
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              spacing={2}
                            >
                              <TextField
                                error={false}
                                label="Tên"
                                onChange={(e) => updateProfileBackup('name', e, index)}
                                name="name"
                                value={item.name}
                                sx={{ width: 0.4 }}
                                autoComplete="off"
                              />
                              <TextField
                                error={false}
                                label="Host"
                                onChange={(e) => updateProfileBackup('host', e, index)}
                                name="host"
                                value={item.host}
                                sx={{ width: 0.6 }}
                                InputProps={{
                                  endAdornment: (
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                      <Typography>Priority</Typography>
                                      <ButtonBase
                                        onClick={(event) => {
                                          popover.onOpen(event);
                                          setIdPriority(index);
                                        }}
                                        sx={{
                                          pl: 1,
                                          py: 0.5,
                                          pr: 0.5,
                                          borderRadius: 1,
                                          typography: 'subtitle2',
                                          bgcolor: 'background.neutral',
                                        }}
                                      >
                                        {item.priority}

                                        <Iconify
                                          width={16}
                                          icon={
                                            popover.open
                                              ? 'eva:arrow-ios-upward-fill'
                                              : 'eva:arrow-ios-downward-fill'
                                          }
                                        />
                                      </ButtonBase>
                                    </Stack>
                                  ),
                                }}
                                autoComplete="off"
                              />
                              <IconButton
                                sx={{
                                  width: 40,
                                  height: 40,
                                }}
                                onClick={() => deleteHotline(index)}
                              >
                                <Iconify icon="carbon:close-outline" />
                              </IconButton>
                            </Stack>
                          ))) ||
                        (group?.id === 'hotline' &&
                          group.items.map((item, index) => (
                            <TextField
                              key={index}
                              label={item.name}
                              value={item.phone}
                              onChange={(e) => {
                                const _clone = cloneDeep(watchHotline);
                                _clone[index].phone = e.target.value;
                                setValue('hotline', _clone, { shouldDirty: true });
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Iconify icon="ic:round-phone" />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiInputBase-root': {
                                  pl: item.id === 'zalo_link' ? 2 : 2.4,
                                },
                              }}
                            />
                          ))) ||
                        group.items.map((item) => (
                          <RHFTextField
                            key={item.id}
                            name={item.id}
                            label={item.label}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {item.id === 'zalo_link' ? (
                                    <ZaLoIcon />
                                  ) : (
                                    <Iconify icon={item.icon} />
                                  )}
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              '& .MuiInputBase-root': {
                                pl: item.id === 'zalo_link' ? 2 : 2.4,
                              },
                            }}
                          />
                        ))}
                      {group?.action && (
                        <Button
                          startIcon={<Iconify icon="ic:round-add" />}
                          onClick={
                            group?.id === 'server_profile_backup'
                              ? addNewProfileBackup
                              : open.onTrue
                          }
                        >
                          {group.action}
                        </Button>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              ))}

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{ ml: 'auto' }}
                disabled={!isDirty}
              >
                Lưu thay đổi
              </LoadingButton>
            </Stack>
          </Grid>
          <CustomPopover
            open={popover.open}
            onClose={popover.onClose}
            sx={{ width: 'fit-content' }}
          >
            {watchProfileBackup.map((__, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  updatePriority(index + 1, idPriority);
                  popover.onClose();
                }}
              >
                {index + 1}
              </MenuItem>
            ))}
          </CustomPopover>
        </Grid>
      </FormProvider>

      <AddHotlineDialog
        open={open.value}
        onClose={open.onFalse}
        hotlines={watchHotline}
        handleSubmit={(data) => {
          setValue('hotline', data, { shouldDirty: true });
        }}
      />
    </Container>
  );
}

SystemSettingView.propTypes = {
  configData: PropTypes.object,
  reload: PropTypes.func,
};
