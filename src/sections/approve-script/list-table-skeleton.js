// @mui
import { ListItemText } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// ----------------------------------------------------------------------

export default function ListScriptTableSkeleton({ ...other }) {
  return (
    <TableRow sx={other.sx}>
      <TableCell>
        <Skeleton sx={{ width: 30, height: 12, mx: 'auto' }} />
      </TableCell>
      <TableCell>
        <Skeleton sx={{ width: 30, height: 12, mx: 'auto' }} />
      </TableCell>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12 }} />
      </TableCell>
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12 }} />
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
      {!other.displayCell && (
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
      )}
      {other.displayCell && (
        <TableCell>
          <Skeleton sx={{ width: 30, height: 12, mx: 'auto' }} />
        </TableCell>
      )}
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
        <Skeleton sx={{ width: 1, height: 12 }} />
      </TableCell>
      {other.displayCell && (
        <>
          <TableCell>
            <Skeleton sx={{ width: 1, height: 12 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 100, height: 12 }} />
          </TableCell>
        </>
      )}
      <TableCell>
        <Skeleton sx={{ width: 1, height: 12 }} />
      </TableCell>
    </TableRow>
  );
}
