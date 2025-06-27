import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { format } from 'date-fns';
import useTooltipNecessity from 'src/hooks/use-tooltip-necessity';
import { Tooltip } from '@mui/material';
import TextMaxLine from 'src/components/text-max-line';

// ----------------------------------------------------------------------

export default function ProfileGroupTableRow({ row }) {
  const { id, name, workspace, user_created, user_owner, created_at } = row;

  const [nameRef, showName] = useTooltipNecessity();
  const [workspaceRef, showWorkspace] = useTooltipNecessity();

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
        align="center"
        sx={{
          typography: 'subtitle2',
          maxWidth: 300,
        }}
      >
        <Tooltip title={showName ? name : ''}>
          <TextMaxLine ref={nameRef} line={1}>
            {name}
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
        {workspace?.id}
      </TableCell>

      <TableCell
        align="center"
        sx={{
          typography: 'subtitle2',
          maxWidth: 300,
        }}
      >
        <Tooltip title={showWorkspace ? workspace?.name : ''}>
          <TextMaxLine ref={workspaceRef} line={1}>
            {workspace?.name}
          </TextMaxLine>
        </Tooltip>
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        <ListItemText
          primary={user_created?.username}
          secondary={user_created?.email}
          primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell
        sx={{
          typography: 'subtitle2',
        }}
      >
        <ListItemText
          primary={user_owner?.username}
          secondary={user_owner?.email}
          primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
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
            textAlign: 'center',
          }}
        />
      </TableCell>
    </TableRow>
  );
}

ProfileGroupTableRow.propTypes = {
  row: PropTypes.object,
};
