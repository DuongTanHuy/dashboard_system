import {
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData, useTable } from 'src/components/table';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import { getNumSkeleton } from 'src/utils/format-number';
import { useMemo, useState } from 'react';
import { cms_user_data } from 'src/utils/mock';
import CmsUserTableToolBar from './cms-user-table-tool-bar';
import CmsUserTableSkeleton from './cms-user-table-skeleton';
import CmsUserTableRow from './cms-user-table-row';
import CreateUserDialog from './create-user-dialog';

// ----------------------------------------------------------------------

const CmsUserView = () => {
  const { user } = useAuthContext();
  const isPermission = user?.role !== 'employee';

  const TABLE_HEAD = [
    { id: 'no', label: 'STT', align: 'center', width: 60 },
    { id: 'id', label: 'ID', align: 'center', width: 60 },
    { id: 'info', label: 'Thông tin' },
    { id: 'username', label: 'Tài khoản' },
    { id: 'create_at', label: 'Ngày tạo' },
    { id: 'address', label: 'Địa chỉ', align: 'center' },
    { id: 'role', label: 'Vai trò', align: 'center' },
    { id: 'phone', label: 'Số điện thoại', align: 'center' },
    ...(isPermission ? [{ id: 'action', label: 'Hành động', align: 'center', width: 60 }] : []),
  ];

  const settings = useSettingsContext();
  const table = useTable();
  const [userListLoading] = useState(false);

  // api not available
  // const { data, isLoading: userListLoading } = useCmsUser();

  const userList = useMemo(() => cms_user_data.data || [], []);

  const showDialog = useBoolean();

  const notFound = !userList.length && !userListLoading;

  return (
    <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
      <Card
        sx={{
          mt: 6,
          overflow: 'unset',
        }}
      >
        <CmsUserTableToolBar />

        <Stack direction="row" justifyContent="space-between" alignItems="center" p={3} pt={0}>
          <Typography variant="subtitle1" color="text.secondary">
            Quản Lý Tài Khoản CMS
          </Typography>
          {isPermission && (
            <Button
              startIcon={<Iconify icon="gg:add" />}
              variant="contained"
              onClick={showDialog.onTrue}
            >
              Tạo tài khoản
            </Button>
          )}
        </Stack>

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom order={table.order} orderBy={table.orderBy} headLabel={TABLE_HEAD} />

              <TableBody>
                {userListLoading
                  ? [...Array(getNumSkeleton(table.rowsPerPage, userList.length))].map(
                      (i, index) => <CmsUserTableSkeleton key={index} />
                    )
                  : userList.map((row, index) => (
                      <CmsUserTableRow key={row.id} no={index + 1} row={row} />
                    ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>
      <CreateUserDialog open={showDialog.value} onClose={showDialog.onFalse} />
    </Container>
  );
};

export default CmsUserView;
