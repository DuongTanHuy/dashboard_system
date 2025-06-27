import { useState, useCallback, useMemo } from 'react';
// @mui
import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';
import { Card, Table, TableBody, TableContainer } from '@mui/material';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import Scrollbar from 'src/components/scrollbar';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { getNumSkeleton } from 'src/utils/format-number';
import { useAuthContext } from 'src/auth/hooks';
import { buy_package_data } from 'src/utils/mock';
import BuyPackageTableToolbar from './buy-package-table-toolbar';
import BuyPackageTableFiltersResult from './buy-package-table-filters-result';
import BuyPackageTableSkeleton from './buy-package-table-skeleton';
import BuyPackageTableRow from './buy-package-table-row';

// ----------------------------------------------------------------------

const defaultFilters = {
  search: '',
  start_date: null,
  end_date: null,
};

// ----------------------------------------------------------------------

export default function BuyPackageView() {
  const { user } = useAuthContext();
  const isPermission = user?.role !== 'employee';

  const TABLE_HEAD = [
    { id: 'no', label: 'STT', align: 'center', width: 120 },
    { id: 'id', label: 'ID', align: 'center', width: 120 },
    { id: 'account', label: 'Tài khoản mua' },
    { id: 'package', label: 'Gói mua', align: 'center' },
    { id: 'amount', label: 'Số tiền', align: 'center' },
    { id: 'discount', label: 'Giảm giá', align: 'center' },
    { id: 'create_at', label: 'Ngày giờ mua' },
    ...(isPermission ? [{ id: 'action', label: 'Hành động', align: 'center', width: 100 }] : []),
  ];

  const searchParams = useSearchParams();
  const defaultSearch = searchParams.get('search');
  const defaultStartDate = searchParams.get('start_date');
  const defaultEndDate = searchParams.get('end_date');
  const defaultPage = searchParams.get('page');
  const defaultRowsPerPage = searchParams.get('row');
  const defaultDense = searchParams.get('dense');

  const router = useRouter();
  const settings = useSettingsContext();
  const table = useTable({
    defaultRowsPerPage: Number(defaultRowsPerPage),
    defaultCurrentPage: Number(defaultPage),
    defaultDense: defaultDense === 'true',
  });

  const [filters, setFilters] = useState({
    ...defaultFilters,
    ...(defaultSearch && { search: defaultSearch }),
    ...(defaultStartDate && { start_date: new Date(defaultStartDate) }),
    ...(defaultEndDate && { end_date: new Date(defaultEndDate) }),
  });

  const [loading] = useState();

  // const { data, isLoading: loading } = useGetTransactionList(
  //   {
  //     transaction_type_in: 'purchase_profile_package',
  //     username: deferredFilters.search,
  //     start_date: fDate(deferredFilters.start_date, 'yyyy-MM-dd'),
  //     end_date: fDate(deferredFilters.end_date, 'yyyy-MM-dd'),
  //     page_size: table.rowsPerPage,
  //     page_num: table.page + 1,
  //   },
  //   {
  //     refetchInterval: 10000,
  //     refetchOnReconnect: true,
  //     refetchOnWindowFocus: true,
  //   }
  // );

  const tableData = useMemo(() => buy_package_data?.data || [], []);
  const totalRecord = useMemo(() => buy_package_data?.total_record || 0, []);

  const canReset = !!filters.search || !!filters.start_date || !!filters.end_date;

  const notFound = !tableData.length && !loading;
  const denseHeight = table.dense ? 52 : 72;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    searchParams.delete('search');
    searchParams.delete('start_date');
    searchParams.delete('end_date');
    router.push(`${paths.dashboard.transaction_history.buy_package}?${searchParams}`);
  }, [router, searchParams]);

  return (
    <Container maxWidth={settings.themeStretch ? 'lg' : 'md'}>
      <Card
        sx={{
          mt: 6,
          overflow: 'unset',
        }}
      >
        <BuyPackageTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <BuyPackageTableFiltersResult
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
                      (i, index) => (
                        <BuyPackageTableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )
                  : tableData.map((row, index) => (
                      <BuyPackageTableRow key={row.id} no={index + 1} row={row} />
                    ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={totalRecord}
          page={totalRecord / table.rowsPerPage <= table.page ? 0 : table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={(event, page) => {
            table.onChangePage(event, page);
            searchParams.set('page', page);
            router.push(`${paths.dashboard.transaction_history.buy_package}?${searchParams}`);
          }}
          onRowsPerPageChange={(event) => {
            table.onChangeRowsPerPage(event);
            searchParams.set('row', event.target.value);
            table.setPage(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.transaction_history.buy_package}?${searchParams}`);
          }}
          //
          dense={table.dense}
          onChangeDense={(event) => {
            searchParams.set('dense', event.target.checked);
            router.push(`${paths.dashboard.transaction_history.buy_package}?${searchParams}`);
            table.onChangeDense(event);
          }}
        />
      </Card>
    </Container>
  );
}
