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
import { fDate } from 'src/utils/format-time';
import { getNumSkeleton } from 'src/utils/format-number';
import { recharge_data } from 'src/utils/mock';
import RechargeTableToolbar from './recharge-table-toolbar';
import RechargeTableFiltersResult from './recharge-table-filters-result';
import RechargeTableSkeleton from './recharge-table-skeleton';
import RechargeTableRow from './recharge-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'STT', align: 'center' },
  { id: 'id', label: 'ID', align: 'center' },
  { id: 'transaction_type', label: 'Loại nạp tiền', align: 'center' },
  { id: 'account', label: 'Tài khoản được nạp' },
  { id: 'action_account', label: 'Tài khoản thực hiện' },
  { id: 'amount', label: 'Số tiền nạp', align: 'center' },
  { id: 'balance_after_transaction', label: 'Số dư sau nạp', align: 'center' },
  { id: 'note', label: 'Ghi chú', minWidth: 200 },
  { id: 'create_at', label: 'Ngày giờ nạp' },
];

// ----------------------------------------------------------------------

export default function RechargeView() {
  const searchParams = useSearchParams();
  const defaultSearch = searchParams.get('search');
  const actionUserSearch = searchParams.get('action_user');
  const transactionType = searchParams.get('transaction_type_in');
  const balanceType = searchParams.get('balance_type');
  const startDateParam = searchParams.get('start_date');
  const endDateParam = searchParams.get('end_date');
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

  const defaultFilters = useMemo(
    () => ({
      search: defaultSearch || '',
      action_user: actionUserSearch || '',
      transaction_type_in: transactionType || 'top_up_auto, top_up_manual',
      balance_type: balanceType || 'all',
      ...{ start_date: startDateParam ? new Date(startDateParam) : null },
      ...{ end_date: endDateParam ? new Date(endDateParam) : null },
    }),
    [actionUserSearch, balanceType, defaultSearch, endDateParam, startDateParam, transactionType]
  );
  const [filters, setFilters] = useState(defaultFilters);

  const [loading] = useState(false);

  // api not available
  // const { data, isLoading: loading } = useGetTransactionList(
  //   {
  //     username: deferredFilters.search,
  //     action_user: deferredFilters.action_user,
  //     transaction_type_in: deferredFilters.transaction_type_in,
  //     ...(deferredFilters.balance_type !== 'all' && { balance_type: deferredFilters.balance_type }),
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

  const tableData = useMemo(() => recharge_data?.data || [], []);
  const totalTransaction = useMemo(() => recharge_data?.total_record || 0, []);

  const canReset =
    filters.search !== '' ||
    filters.action_user !== '' ||
    filters.transaction_type_in !== 'top_up_auto, top_up_manual' ||
    filters.balance_type !== 'all' ||
    !!filters.start_date ||
    !!filters.end_date;
  const notFound = !tableData.length && !loading;
  const denseHeight = table.dense ? 52 : 72;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      if (
        name === 'search' ||
        name === 'action_user' ||
        name === 'transaction_type_in' ||
        name === 'balance_type'
      ) {
        searchParams.set(name, value);
      } else {
        searchParams.set(name, fDate(value, 'yyyy-MM-dd'));
      }
      searchParams.delete('page');
      router.push(`${paths.dashboard.transaction_history.recharge}?${searchParams}`);
    },
    [router, searchParams, table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: '',
      action_user: '',
      transaction_type_in: 'top_up_auto, top_up_manual',
      balance_type: 'all',
      start_date: null,
      end_date: null,
    });
    router.push(paths.dashboard.transaction_history.recharge);
  }, [router]);

  return (
    <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
      <Card
        sx={{
          mt: 6,
          overflow: 'unset',
        }}
      >
        <RechargeTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <RechargeTableFiltersResult
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
                        <RechargeTableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )
                  : tableData.map((row, index) => (
                      <RechargeTableRow key={row.id} no={index + 1} row={row} />
                    ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={totalTransaction}
          page={totalTransaction / table.rowsPerPage <= table.page ? 0 : table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={(event, page) => {
            table.onChangePage(event, page);
            searchParams.set('page', page);
            router.push(`${paths.dashboard.transaction_history.recharge}?${searchParams}`);
          }}
          onRowsPerPageChange={(event) => {
            table.onChangeRowsPerPage(event);
            searchParams.set('row', event.target.value);
            table.setPage(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.transaction_history.recharge}?${searchParams}`);
          }}
          //
          dense={table.dense}
          onChangeDense={(event) => {
            searchParams.set('dense', event.target.checked);
            router.push(`${paths.dashboard.transaction_history.recharge}?${searchParams}`);
            table.onChangeDense(event);
          }}
        />
      </Card>
    </Container>
  );
}
