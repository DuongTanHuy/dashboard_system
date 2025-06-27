import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ButtonBase, IconButton, MenuItem, Stack, Typography } from '@mui/material';
import { usePopover } from '../custom-popover';
import Iconify from '../iconify';
import CustomPopover from '../custom-popover/custom-popover';

// ----------------------------------------------------------------------

const OPTIONS = [10, 30, 50, 100, 300, 500, 1000];

// ----------------------------------------------------------------------

export default function TablePaginationNoTotal({
  dense,
  onChangeDense,
  sx,
  pageSize,
  handleChangeRowPerPage,
  pageNum,
  handleChangePageNum,
  isNext,
  isPrev,
  isLoading,
  tableDataLength,
}) {
  const popover = usePopover();

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={3} p={2}>
        <Stack direction="row" spacing={1}>
          <Typography>Số dòng mỗi trang</Typography>
          <ButtonBase
            onClick={popover.onOpen}
            sx={{
              pl: 1,
              py: 0.5,
              pr: 0.5,
              borderRadius: 1,
              typography: 'subtitle2',
              bgcolor: 'background.neutral',
              width: 'fit-content',
            }}
          >
            {pageSize}

            <Iconify
              width={16}
              icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
              sx={{ ml: 0.5 }}
            />
          </ButtonBase>
        </Stack>

        <Typography>
          {tableDataLength
            ? `${pageSize * pageNum + 1}-${pageSize * pageNum + tableDataLength}`
            : '0-0'}
        </Typography>

        <Stack direction="row">
          <IconButton
            sx={{
              p: 0.5,
            }}
            disabled={isLoading || !isPrev}
            onClick={() => handleChangePageNum(pageNum - 1)}
          >
            <Iconify
              icon="icon-park-outline:left"
              color={isLoading || !isPrev ? 'text.disabled' : 'text.primary'}
            />
          </IconButton>
          <IconButton
            sx={{
              p: 1,
            }}
            disabled={isLoading || !isNext}
            onClick={() => handleChangePageNum(pageNum + 1)}
          >
            <Iconify
              icon="icon-park-outline:right"
              color={isLoading || !isNext ? 'text.disabled' : 'text.primary'}
            />
          </IconButton>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 'fit-content', maxHeight: 200, overflowY: 'auto' }}
      >
        {OPTIONS.map((option) => (
          <MenuItem
            key={option}
            selected={option === pageSize}
            onClick={() => {
              handleChangeRowPerPage(option);
              popover.onClose();
            }}
          >
            {option}
          </MenuItem>
        ))}
      </CustomPopover>

      {onChangeDense && (
        <FormControlLabel
          label="Thu gọn bảng"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              sm: 'absolute',
            },
          }}
        />
      )}
    </Box>
  );
}

TablePaginationNoTotal.propTypes = {
  dense: PropTypes.bool,
  isPrev: PropTypes.bool,
  isNext: PropTypes.bool,
  isLoading: PropTypes.bool,
  onChangeDense: PropTypes.func,
  sx: PropTypes.object,
  pageSize: PropTypes.number.isRequired,
  handleChangeRowPerPage: PropTypes.func.isRequired,
  pageNum: PropTypes.number.isRequired,
  handleChangePageNum: PropTypes.func.isRequired,
  tableDataLength: PropTypes.number,
};
