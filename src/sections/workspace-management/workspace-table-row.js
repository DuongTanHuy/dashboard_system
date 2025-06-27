import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { Tooltip } from '@mui/material';
import TextMaxLine from 'src/components/text-max-line';
import useTooltipNecessity from 'src/hooks/use-tooltip-necessity';

// ----------------------------------------------------------------------

export default function WorkspaceTableRow({ no, row }) {
  const { id, name, description, user_creator, deleted_at, created_at } = row;
  const [detailRef, showDetail] = useTooltipNecessity();
  const [nameRef, showName] = useTooltipNecessity();

  return (
    <TableRow hover>
      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
        }}
      >
        {no}
      </TableCell>
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
          minWidth: 200,
        }}
      >
        <Tooltip title={showName ? name : ''}>
          <TextMaxLine ref={nameRef} line={2}>
            {name}
          </TextMaxLine>
        </Tooltip>
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
          minWidth: 160,
        }}
      >
        <Tooltip title={showDetail ? description : ''}>
          <TextMaxLine ref={detailRef} line={2}>
            {description}
          </TextMaxLine>
        </Tooltip>
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        <ListItemText
          primary={user_creator?.username}
          secondary={user_creator?.email}
          primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
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

      <TableCell>
        {deleted_at && (
          <ListItemText
            primary={format(new Date(deleted_at), "d 'tháng' M yyyy")}
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
    </TableRow>
  );
}

WorkspaceTableRow.propTypes = {
  no: PropTypes.number,
  row: PropTypes.object,
};
