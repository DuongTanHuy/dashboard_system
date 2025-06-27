import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { format } from 'date-fns';
import useTooltipNecessity from 'src/hooks/use-tooltip-necessity';
import { Checkbox, IconButton, Stack, Tooltip } from '@mui/material';
import TextMaxLine from 'src/components/text-max-line';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function DeviceTableRow({ row, selected, onSelectRow, onExtraData }) {
  const {
    id,
    user,
    hostname,
    ip,
    device_hash,
    useragent,
    os,
    os_version,
    location,
    login_last_at,
    logout_at,
    created_at,
  } = row;

  const [hashRef, showHash] = useTooltipNecessity();
  const [ipRef, showIp] = useTooltipNecessity();
  const [useragentRef, showUseragent] = useTooltipNecessity();

  return (
    <TableRow hover>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
          whiteSpace: 'nowrap',
        }}
      >
        {id}
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        <ListItemText
          primary={user?.username}
          secondary={user?.email}
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
          whiteSpace: 'nowrap',
        }}
      >
        {hostname}
      </TableCell>

      <TableCell>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            width: 1,
            maxWidth: 200,
            '& .MuiTypography-root': {
              mx: 'auto',
            },
          }}
        >
          <Tooltip title={showIp ? ip : ''}>
            <TextMaxLine ref={ipRef} line={1} display="inline-block">
              {ip}
            </TextMaxLine>
          </Tooltip>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            width: 1,
            maxWidth: 200,
          }}
        >
          <Tooltip title={showHash ? device_hash : ''}>
            <TextMaxLine ref={hashRef} line={1} display="inline-block">
              {device_hash}
            </TextMaxLine>
          </Tooltip>
        </Stack>
      </TableCell>

      <TableCell
        sx={{
          minWidth: 300,
        }}
      >
        <Tooltip title={showUseragent ? useragent : ''}>
          <TextMaxLine ref={useragentRef} line={2}>
            {useragent}
          </TextMaxLine>
        </Tooltip>
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
          whiteSpace: 'nowrap',
        }}
      >
        {os === 'windows' ? `Windows ${os_version}` : `macOS`}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
          whiteSpace: 'nowrap',
        }}
      >
        {location}
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        {login_last_at && (
          <ListItemText
            primary={format(new Date(login_last_at), "d 'tháng' M yyyy")}
            secondary={format(new Date(login_last_at), 'p')}
            primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        )}
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        {logout_at && (
          <ListItemText
            primary={format(new Date(logout_at), "d 'tháng' M yyyy")}
            secondary={format(new Date(logout_at), 'p')}
            primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        )}
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        {created_at && (
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
        )}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        <IconButton onClick={onExtraData}>
          <Iconify icon="lsicon:view-filled" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

DeviceTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onExtraData: PropTypes.func,
};
