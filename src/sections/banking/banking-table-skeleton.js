// @mui
import { ListItemText, Stack } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// ----------------------------------------------------------------------

export default function BankingTableSkeleton({ ...other }) {
  return (
    <TableRow {...other}>
      <TableCell>
        <Skeleton sx={{ borderRadius: 0.5, width: 20, height: 20, flexShrink: 0 }} />
      </TableCell>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12, mx: 'auto' }} />
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
      <TableCell>
        <Stack spacing={1}>
          <Skeleton sx={{ width: { xs: 300, lg: 600 }, height: 12 }} />
          <Skeleton sx={{ width: 1, height: 12 }} />
        </Stack>
      </TableCell>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12 }} />
      </TableCell>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12 }} />
      </TableCell>
    </TableRow>
  );
}
