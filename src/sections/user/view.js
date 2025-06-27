import { useState, useCallback, useMemo } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// components
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
// hooks
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import { fDate } from 'src/utils/format-time';
import { getNumSkeleton } from 'src/utils/format-number';
import { user_data } from 'src/utils/mock';
import UserTableRow from './user-table-row';
import UserTableToolbar from './user-table-toolbar';
import UserTableFiltersResult from './user-table-filters-result';
import UserTableSkeleton from './user-table-skeleton';
import UpdateBalanceDialog from './update-balance-dialog';
import UpdatePackageDialog from './update-package-dialog';

// ----------------------------------------------------------------------

export default function UserView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const nameParam = searchParams.get('search');
  const refererUserParam = searchParams.get('referer_user');
  const startDateParam = searchParams.get('start_date');
  const endDateParam = searchParams.get('end_date');
  const pageNum = searchParams.get('page');
  const rowNum = searchParams.get('row');
  const table = useTable({
    defaultCurrentPage: Number(pageNum) || 0,
    defaultRowsPerPage: Number(rowNum) || 10,
  });

  const { user } = useAuthContext();
  const isPermission = user?.role !== 'employee';

  const TABLE_HEAD = [
    { id: 'no', label: 'STT', align: 'center', width: 60 },
    { id: 'id', label: 'ID', align: 'center', width: 60 },
    { id: 'username', label: 'Tài khoản' },
    { id: 'created_at', label: 'Ngày tạo' },
    { id: 'referer', label: 'Người giới thiệu' },
    { id: 'affiliate_level', label: 'Cấp bậc hoa hồng', align: 'center' },
    { id: 'balance', label: 'Số dư', align: 'center' },
    { id: 'profile_balance', label: 'Số dư hồ sơ', align: 'center' },
    { id: 'profile_package', label: 'Gói hồ sơ', align: 'center' },
    ...(isPermission ? [{ id: 'action', label: 'Hành động', align: 'center', width: 60 }] : []),
  ];

  const confirm = useBoolean();
  const showUpdatePackage = useBoolean();
  const [transaction, setTransaction] = useState({});
  const [loading] = useState(false);

  const defaultFilters = useMemo(
    () => ({
      search: nameParam || '',
      referer_user: refererUserParam || '',
      id: idParam || '',
      ...{ start_date: startDateParam ? new Date(startDateParam) : null },
      ...{ end_date: endDateParam ? new Date(endDateParam) : null },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endDateParam, idParam, nameParam, startDateParam]
  );

  const settings = useSettingsContext();

  const [filters, setFilters] = useState(defaultFilters);

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.id ||
    !!filters.search ||
    !!filters.referer_user ||
    !!filters.start_date ||
    !!filters.end_date;

  // const {
  //   data,
  //   isLoading: loading,
  //   refetch: handleFetchData,
  // } = useUser({
  //   user_id: deferredFilters.id,
  //   username: deferredFilters.search,
  //   referer_user: deferredFilters.referer_user,
  //   start_date: fDate(deferredFilters.start_date, 'yyyy-MM-dd'),
  //   end_date: fDate(deferredFilters.end_date, 'yyyy-MM-dd'),
  //   page_size: table.rowsPerPage,
  //   page_num: table.page + 1,
  // });

  const tableData = useMemo(() => user_data.data || [], []);
  const totalUser = useMemo(() => user_data.total_record || 0, []);

  const notFound = !tableData.length && !loading;

  const handleOpenDialog = useCallback(
    (uInfo) => {
      confirm.onTrue();
      setTransaction(uInfo);
    },
    [confirm]
  );

  const handleCloseDialog = useCallback(() => {
    confirm.onFalse();
    setTransaction({});
  }, [confirm]);

  const handleOpenUpdatePackage = useCallback(
    (uInfo) => {
      showUpdatePackage.onTrue();
      setTransaction(uInfo);
    },
    [showUpdatePackage]
  );

  const handleCloseUpdatePackage = useCallback(() => {
    showUpdatePackage.onFalse();
    setTransaction({});
  }, [showUpdatePackage]);

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (name === 'referer_user' || name === 'search' || name === 'id') {
        searchParams.set(name, value);
      } else {
        searchParams.set(name, fDate(value, 'yyyy-MM-dd'));
      }
      searchParams.delete('page');
      router.push(`${paths.dashboard.root}?${searchParams}`);
    },
    [router, searchParams, table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      id: '',
      search: '',
      referer_user: '',
      start_date: null,
      end_date: null,
    });
    router.push(paths.dashboard.root);
  }, [router]);

  return (
    <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
      <Card
        sx={{
          mt: 6,
          overflow: 'unset',
        }}
      >
        <UserTableToolbar filters={filters} onFilters={handleFilters} onReloadData={() => {}} />

        {canReset && (
          <UserTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={tableData.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom order={table.order} orderBy={table.orderBy} headLabel={TABLE_HEAD} />

              <TableBody>
                {loading
                  ? [...Array(getNumSkeleton(table.rowsPerPage, tableData.length))].map(
                      (i, index) => <UserTableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  : tableData
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row, index) => (
                        <UserTableRow
                          key={row.id}
                          no={index + 1}
                          row={row}
                          handleOpenDialog={() => handleOpenDialog(row)}
                          handleOpenUpdatePackage={() => handleOpenUpdatePackage(row)}
                        />
                      ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={totalUser}
          page={totalUser / table.rowsPerPage <= table.page ? 0 : table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={(event, page) => {
            table.onChangePage(event, page);
            searchParams.set('page', page);
            router.push(`${paths.dashboard.root}?${searchParams.toString()}`);
          }}
          onRowsPerPageChange={(event) => {
            table.onChangeRowsPerPage(event);
            searchParams.set('row', event.target.value);
            table.setPage(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.root}?${searchParams.toString()}`);
          }}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
      <UpdateBalanceDialog
        open={confirm.value}
        onClose={handleCloseDialog}
        userInfo={transaction}
      />
      <UpdatePackageDialog
        open={showUpdatePackage.value}
        onClose={handleCloseUpdatePackage}
        userInfo={transaction}
      />
    </Container>
  );
}
