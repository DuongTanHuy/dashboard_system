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
import { deduction_data } from 'src/utils/mock';
import DeductionTableToolbar from './deduction-table-toolbar';
import DeductionTableFiltersResult from './deduction-table-filters-result';
import DeductionTableSkeleton from './deduction-table-skeleton';
import DeductionTableRow from './deduction-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'STT', align: 'center' },
  { id: 'id', label: 'ID', align: 'center' },
  { id: 'transaction_type', label: 'Loại trừ tiền', align: 'center' },
  { id: 'account', label: 'Tài khoản bị trừ' },
  { id: 'action_account', label: 'Tài khoản thực hiện' },
  { id: 'amount', label: 'Số tiền bị trừ', align: 'center' },
  { id: 'balance_after_transaction', label: 'Số dư sau trừ', align: 'center' },
  { id: 'note', label: 'Ghi chú', minWidth: 200 },
  { id: 'create_at', label: 'Ngày giờ nạp' },
];

// ----------------------------------------------------------------------

export default function DeductionView() {
  const searchParams = useSearchParams();
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

  const defaultFilters = {
    balance_type: balanceType || 'all',
    ...{ start_date: startDateParam ? new Date(startDateParam) : null },
    ...{ end_date: endDateParam ? new Date(endDateParam) : null },
  };
  const [filters, setFilters] = useState(defaultFilters);

  const [loading] = useState(false);

  // const { data, isLoading: loading } = useGetTransactionList(
  //   {
  //     transaction_type_in: 'deduct_manual',
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

  const tableData = useMemo(() => deduction_data?.data || [], []);
  const totalTransaction = useMemo(() => deduction_data?.total_record || 0, []);

  const canReset = filters.balance_type !== 'all' || !!filters.start_date || !!filters.end_date;
  const notFound = !tableData.length && !loading;
  const denseHeight = table.dense ? 52 : 72;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      if (name === 'balance_type') {
        searchParams.set(name, value);
      } else {
        searchParams.set(name, fDate(value, 'yyyy-MM-dd'));
      }
      searchParams.delete('page');
      router.push(`${paths.dashboard.transaction_history.deduction}?${searchParams}`);
    },
    [router, searchParams, table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      balance_type: 'all',
      start_date: null,
      end_date: null,
    });
    router.push(paths.dashboard.transaction_history.deduction);
  }, [router]);

  return (
    <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
      <Card
        sx={{
          mt: 6,
          overflow: 'unset',
        }}
      >
        <DeductionTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <DeductionTableFiltersResult
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
                        <DeductionTableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )
                  : tableData.map((row, index) => (
                      <DeductionTableRow key={row.id} no={index + 1} row={row} />
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
            router.push(`${paths.dashboard.transaction_history.deduction}?${searchParams}`);
          }}
          onRowsPerPageChange={(event) => {
            table.onChangeRowsPerPage(event);
            searchParams.set('row', event.target.value);
            table.setPage(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.transaction_history.deduction}?${searchParams}`);
          }}
          //
          dense={table.dense}
          onChangeDense={(event) => {
            searchParams.set('dense', event.target.checked);
            router.push(`${paths.dashboard.transaction_history.deduction}?${searchParams}`);
            table.onChangeDense(event);
          }}
        />
      </Card>
    </Container>
  );
}
