import PropTypes from 'prop-types';
// @mui
import { fCurrencyVND } from 'src/utils/format-number';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { format } from 'date-fns';
import { Divider, IconButton, MenuItem, Switch } from '@mui/material';
import Iconify from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import { updateVoucherApi } from 'src/api/voucher.api';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function VoucherTableRow({ row, onDelete, onUpdate }) {
  const {
    id,
    name,
    code,
    discount,
    voucher_type,
    user_usage_limit,
    voucher_usage_limit,
    is_active,
    date_expired,
    created_at,
  } = row;
  const popover = usePopover();

  const [isActive, setIsActive] = useState(is_active);

  const [isLoading, setIsLoading] = useState(false);

  const handleChangeStatus = async () => {
    try {
      setIsLoading(true);
      await updateVoucherApi(id, {
        is_active: !isActive,
      });
      setIsActive(!isActive);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TableRow hover>
      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {id}
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        {name}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {code}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {user_usage_limit}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {voucher_usage_limit}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {voucher_type === 'percentage' ? `${discount}%` : fCurrencyVND(discount)}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
          whiteSpace: 'nowrap',
        }}
      >
        {format(new Date(created_at), "d 'tháng' M yyyy")}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
          whiteSpace: 'nowrap',
        }}
      >
        {format(new Date(date_expired), "d 'tháng' M yyyy")}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        <Switch checked={isActive} onChange={handleChangeStatus} disabled={isLoading} />
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        <IconButton onClick={popover.onOpen}>
          <Iconify icon="ri:more-2-fill" />
        </IconButton>
      </TableCell>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 'fit-content' }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onUpdate();
          }}
        >
          <Iconify icon="icon-park-solid:transaction-order" />
          Cập nhật
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="ph:package-fill" />
          Xóa
        </MenuItem>
      </CustomPopover>
    </TableRow>
  );
}

VoucherTableRow.propTypes = {
  row: PropTypes.object,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
};
