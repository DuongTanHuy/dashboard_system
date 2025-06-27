import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { format } from 'date-fns';
import { Divider, IconButton, Link, ListItemText, MenuItem, Switch } from '@mui/material';
import Iconify from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import { useState } from 'react';
import Image from 'src/components/image';
import { updateBannerApi } from 'src/api/banner.api';
import Label from 'src/components/label';
import { LINK_TYPE_OPTIONS } from './banner-table-toolbar';

// ----------------------------------------------------------------------

export default function BannerTableRow({ row, onDelete, onUpdate }) {
  const { id, title, image_url, link, link_type, is_active, created_at } = row;
  const popover = usePopover();

  const [isActive, setIsActive] = useState(is_active);

  const [isLoading, setIsLoading] = useState(false);

  const handleChangeStatus = async () => {
    try {
      setIsLoading(true);
      await updateBannerApi(id, {
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
        <Image
          alt={title}
          src={image_url}
          sx={{
            height: 50,
            width: 150,
            borderRadius: 1,
            '& img': {
              objectFit: 'contain',
            },
          }}
        />
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        {title}
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        <Link
          underline="always"
          rel="noopener noreferrer"
          color="primary.main"
          target="_blank"
          href={link}
        >
          {link}
        </Link>
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        <Label color={link_type === 'inside' ? 'primary' : 'warning'}>
          {LINK_TYPE_OPTIONS.find((item) => item.id === link_type)?.label}
        </Label>
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        <ListItemText
          primary={format(new Date(created_at), "d 'tháng' M yyyy")}
          secondary={format(new Date(created_at), 'p')}
          primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
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

BannerTableRow.propTypes = {
  row: PropTypes.object,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
};
