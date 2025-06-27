// @mui
import { ListItemText } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// ----------------------------------------------------------------------

export default function AffliateTableSkeleton({ ...other }) {
  return (
    <TableRow {...other}>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12, mx: 'auto' }} />
      </TableCell>
      <TableCell
        sx={{
          minWidth: 240,
        }}
      >
        <ListItemText
          primary={<Skeleton sx={{ width: 0.4, height: 12 }} />}
          secondary={<Skeleton sx={{ width: 1, height: 12 }} />}
          primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12, mx: 'auto' }} />
      </TableCell>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12, mx: 'auto' }} />
      </TableCell>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12, mx: 'auto' }} />
      </TableCell>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12, mx: 'auto' }} />
      </TableCell>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12, mx: 'auto' }} />
      </TableCell>
    </TableRow>
  );
}
