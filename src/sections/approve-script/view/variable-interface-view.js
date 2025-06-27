import PropTypes from 'prop-types';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import Label from 'src/components/label';
import SortableGroup, { contentMap } from '../variable-interface/sortable-group';
import { findItemById } from '../variable-interface/utils';
import Sidebar from '../variable-interface/Sidebar';
import Preview from '../variable-interface/components/PreviewDialog';
import '../variable-interface/custom-style.css';

export default function VariableInterfaceView({ workflowInfo }) {
  const getId = () => Math.floor(100000 + Math.random() * 900000);
  const settings = useSettingsContext();
  const route = useRouter();
  const preview = useBoolean();

  const [ruleset] = useState(
    workflowInfo?.design_data ?? {
      id: getId(),
      type: 'GROUP',
      children: [],
    }
  );

  const [selectingItem, setSelectingItem] = useState(null);

  const clickOnItem = (id) => {
    const _find = findItemById(ruleset, Number(id));
    setSelectingItem(_find);
  };

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      style={{ height: '100%', maxHeight: 'calc(100vh - 96px)', overflow: 'hidden' }}
    >
      <Stack spacing={2} height={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            width: 1,
          }}
        >
          <Stack spacing={1} direction="row" alignItems="flex-start">
            <IconButton onClick={() => route.back()}>
              <Iconify icon="eva:arrow-ios-back-fill" color="text.primary" />
            </IconButton>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4"> {`${workflowInfo?.name} #${workflowInfo?.id}`} </Typography>
              <Label
                variant="soft"
                color={
                  (workflowInfo?.status === 'approved' && 'success') ||
                  (workflowInfo?.status === 'rejected' && 'error') ||
                  'warning'
                }
              >
                {(workflowInfo?.status === 'approved' && 'Đã chấp nhận') ||
                  (workflowInfo?.status === 'rejected' && 'Đã từ chối') ||
                  'Đang chờ duyệt'}
              </Label>
            </Stack>
          </Stack>

          <Button variant="contained" sx={{ flex: 'row', gap: 1 }} onClick={preview.onTrue}>
            Xem trước
          </Button>
        </Stack>

        <Stack direction="row" sx={{ height: 1, overflow: 'hidden' }}>
          <Stack
            direction="row"
            justifyContent="center"
            gap={2}
            sx={{
              width: '100%',
            }}
          >
            <Stack
              id="variable-template"
              sx={{
                width: '100%',
                maxWidth: {
                  md: `calc(100vw - ${selectingItem?.name ? 324 : 0}px)`,
                  lg: `calc(100vw - ${selectingItem?.name ? 324 : 0}px - ${
                    settings.themeLayout === 'mini' ? 120 : 272
                  }px)`,
                },
                overflowX: 'hidden',
                overflowY: 'auto',
                p: 0,
                margin: '0 auto',
              }}
            >
              <SortableGroup
                group={ruleset}
                selectingItem={selectingItem}
                clickOnItem={clickOnItem}
                gutter={false}
              />
            </Stack>
            {selectingItem && (
              <Stack sx={{ flexBasis: '400px', height: 1, borderRadius: 1, overflow: 'hidden' }}>
                <Sidebar
                  setSelectingItem={setSelectingItem}
                  selectingItem={selectingItem}
                  ruleset={ruleset}
                />
              </Stack>
            )}
          </Stack>
        </Stack>

        <Dialog open={preview.value} onClose={preview.onFalse} fullWidth maxWidth="md">
          <DialogTitle
            sx={{
              pb: 2,
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h5">Xem trước</Typography>
                <IconButton onClick={preview.onFalse}>
                  <Iconify icon="ic:round-close" />
                </IconButton>
              </Stack>
              <Divider />
            </Stack>
          </DialogTitle>
          <DialogContent sx={{ pb: 3, minHeight: '400px', maxHeight: '60vh' }}>
            <Stack
              sx={{
                height: 1,
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <Preview group={ruleset} contentMap={contentMap} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={preview.onFalse} variant="contained">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
}

VariableInterfaceView.propTypes = {
  workflowInfo: PropTypes.object,
};
