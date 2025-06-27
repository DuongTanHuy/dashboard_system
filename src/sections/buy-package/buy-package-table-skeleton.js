// @mui
import { ListItemText } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function BuyPackageTableSkeleton({ ...other }) {
  const { user } = useAuthContext();
  const isPermission = user?.role !== 'employee';

  return (
    <TableRow {...other}>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12, mx: 'auto' }} />
      </TableCell>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12, mx: 'auto' }} />
      </TableCell>
      <TableCell>
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
        <Skeleton sx={{ width: 1, height: 12 }} />
      </TableCell>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12 }} />
      </TableCell>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12 }} />
      </TableCell>
      <TableCell>
        <ListItemText
          primary={<Skeleton sx={{ width: 1, height: 12 }} />}
          secondary={<Skeleton sx={{ width: 0.4, height: 12 }} />}
          primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>
      {isPermission && (
        <TableCell align="center">
          <Skeleton sx={{ width: 26, height: 26, borderRadius: 1, mx: 'auto' }} />
        </TableCell>
      )}
    </TableRow>
  );
}
