import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { Button, IconButton, MenuItem } from '@mui/material';
import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function DetailsToolbar({
  status,
  idScript,
  name,
  workflowType,
  handleApprove,
  handleReject,
}) {
  const router = useRouter();
  const popover = usePopover();

  return (
    <>
      <Stack
        spacing={3}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          width: 1,
          mb: 2,
        }}
      >
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton onClick={() => router.back()}>
            <Iconify icon="eva:arrow-ios-back-fill" color="text.primary" />
          </IconButton>
          <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant="h4"> {`${name} #${idScript}`} </Typography>
            {status !== undefined && (
              <Label
                variant="soft"
                color={
                  (status === 'approved' && 'success') ||
                  (status === 'rejected' && 'error') ||
                  'warning'
                }
              >
                {(status === 'approved' && 'Đã chấp nhận') ||
                  (status === 'rejected' && 'Đã từ chối') ||
                  'Đang chờ duyệt'}
              </Label>
            )}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2}>
          {workflowType === 'flowchart' && (
            <Button
              variant="outlined"
              onClick={() => {
                popover.onClose();
                router.push(
                  `${
                    status === undefined
                      ? paths.dashboard.script.variable_interface
                      : paths.dashboard.script.publish_variable_interface
                  }/${idScript}`
                );
              }}
              endIcon={<Iconify icon="hugeicons:variable" />}
            >
              Hiển thị giao diện
            </Button>
          )}

          {status === 'pending' && (
            <Button
              variant="contained"
              onClick={popover.onOpen}
              endIcon={<Iconify icon="icon-park-outline:down" />}
              sx={{
                pl: 2,
              }}
            >
              Thao tác
            </Button>
          )}
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ minWidth: 148, width: 'fit-content', maxHeight: 200, overflowY: 'auto' }}
      >
        <MenuItem
          onClick={() => {
            handleApprove();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:approve" color="success.main" />
          Phê duyệt
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleReject();
            popover.onClose();
          }}
        >
          <Iconify icon="carbon:error-filled" color="error.main" />
          Từ chối duyệt
        </MenuItem>
      </CustomPopover>
    </>
  );
}

DetailsToolbar.propTypes = {
  idScript: PropTypes.number,
  name: PropTypes.string,
  status: PropTypes.string,
  workflowType: PropTypes.string,
  handleApprove: PropTypes.func,
  handleReject: PropTypes.func,
};
