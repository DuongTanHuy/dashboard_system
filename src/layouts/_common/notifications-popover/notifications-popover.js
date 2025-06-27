import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';
//
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingButton } from '@mui/lab';
import { deleteSystemNotifyApi } from 'src/api/system-notify.api';
import { ERROR_CODE } from 'src/utils/constance';
import { enqueueSnackbar } from 'notistack';
import CreateUpdateNotifyDialog from './create-update-notify-dialog';
import NotificationItem from './notification-item';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'all',
    label: 'Tất cả',
  },
  {
    value: 'valid',
    label: 'Còn hạn',
  },
  {
    value: 'expired',
    label: 'Hết hạn',
  },
];
// ----------------------------------------------------------------------

export default function NotificationsPopover({ systemNotify, reloadData }) {
  const drawer = useBoolean();
  const open = useBoolean();
  const confirm = useBoolean();
  const [loading, setLoading] = useState(false);
  const [notifyId, setNotifyId] = useState(null);

  const smUp = useResponsive('up', 'sm');

  const [currentTab, setCurrentTab] = useState('all');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const [notifications, setNotifications] = useState([]);

  const [total, setTotal] = useState({
    all: 0,
    valid: 0,
    expired: 0,
  });

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteSystemNotifyApi(notifyId);
      reloadData();
      enqueueSnackbar('Xóa thông báo thành công!', { variant: 'success' });
      setNotifyId(null);
    } catch (error) {
      console.log(error);
      if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
        enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
      } else {
        enqueueSnackbar('Xóa thông báo thất bại!', { variant: 'error' });
      }
    } finally {
      setLoading(false);
      confirm.onFalse();
    }
  };

  useEffect(() => {
    const handleFetchNotifications = async () => {
      try {
        if (currentTab === 'all') {
          setNotifications(systemNotify);
        } else if (currentTab === 'valid') {
          setNotifications(
            systemNotify.filter(
              (notification) =>
                !notification?.date_expired || new Date(notification.date_expired) > new Date()
            )
          );
        } else {
          setNotifications(
            systemNotify.filter((notification) => new Date(notification.date_expired) < new Date())
          );
        }

        setTotal({
          all: systemNotify.length,
          valid: systemNotify.filter(
            (notification) =>
              !notification?.date_expired || new Date(notification.date_expired) > new Date()
          ).length,
          expired: systemNotify.filter(
            (notification) =>
              notification?.date_expired && new Date(notification.date_expired) <= new Date()
          ).length,
        });
      } catch (error) {
        console.error(error);
      }
    };

    handleFetchNotifications();
  }, [currentTab, systemNotify]);

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Stack width={1} direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Thông báo
        </Typography>
        <Button onClick={open.onTrue} color="primary" startIcon={<Iconify icon="ic:round-add" />}>
          Thêm
        </Button>
      </Stack>

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        width: 1,
      }}
    >
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
              color={
                (tab.value === 'valid' && 'success') ||
                (tab.value === 'expired' && 'error') ||
                'default'
              }
            >
              {total[tab.value]}
            </Label>
          }
          sx={{
            '&:not(:last-of-type)': {
              mr: 3,
            },
          }}
        />
      ))}
    </Tabs>
  );

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDelete={(id) => {
              confirm.onTrue();
              setNotifyId(id);
            }}
            onUpdate={(id) => {
              open.onTrue();
              setNotifyId(id);
            }}
          />
        ))}
      </List>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}

        <Divider />

        <Stack direction="row" alignItems="center" justifyContent="center" pt={1} px={1}>
          {renderTabs}
        </Stack>

        {(((currentTab === 'all' && notifications.length === 0) ||
          (currentTab === 'valid' && notifications.length === 0) ||
          (currentTab === 'expired' && notifications.length === 0)) && (
          <Stack height={1} justifyContent="center" alignItems="center">
            Không có thông báo nào
          </Stack>
        )) ||
          renderList}
      </Drawer>

      <CreateUpdateNotifyDialog
        open={open.value}
        notifyId={notifyId}
        onClose={() => {
          open.onFalse();
          setNotifyId(null);
        }}
        reloadData={reloadData}
      />

      <ConfirmDialog
        title="Xóa thông báo?"
        content="Bạn có chắc chắn muốn xóa thông báo này?"
        open={confirm.value}
        onClose={() => {
          confirm.onFalse();
          setNotifyId(null);
        }}
        action={
          <LoadingButton variant="contained" loading={loading} onClick={handleDelete} color="error">
            Xóa ngay
          </LoadingButton>
        }
      />
    </>
  );
}

NotificationsPopover.propTypes = {
  systemNotify: PropTypes.array,
  reloadData: PropTypes.func,
};
