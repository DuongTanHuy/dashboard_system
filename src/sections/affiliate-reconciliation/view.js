import { useCallback, useEffect, useMemo, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import { Card, Table, TableBody, TableContainer } from '@mui/material';
// components
import { useSettingsContext } from 'src/components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import Scrollbar from 'src/components/scrollbar';
import { fDate } from 'src/utils/format-time';
import { useBoolean } from 'src/hooks/use-boolean';
import { getListReconciliationApi } from 'src/api/affiliate.api';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import ReconciliationTableToolbar from './reconciliation-table-toolbar';
import ReconciliationTableFiltersResult from './reconciliation-table-filters-result';
import ReconciliationTableRow from './reconciliation-table-row';
import ReconciliationTableSkeleton from './reconciliation-table-skeleton';
import ReconciliationDetailDialog from './reconciliation-detail-dialog';
import UpdateCommissionPaymentDialog from './commission-payment-dialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Mã đối soát', width: 140 },
  { id: 'user', label: 'Người nhận hoa hồng' },
  { id: 'amount', label: 'Số tiền (VND)', align: 'center' },
  { id: 'start_date', label: 'Thời gian', align: 'center' },
  { id: 'payment_status', label: 'Trạng thái', align: 'center' },
  { id: 'payment_info', label: 'Thông tin thanh toán' },
  { id: 'note', label: 'Ghi chú' },
  { id: 'action', label: 'Thao tác', width: 100, align: 'center' },
];

// ----------------------------------------------------------------------

export default function ReconciliationView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('username');
  const codeParam = searchParams.get('code');
  const statusParam = searchParams.get('payment_status');
  const dateParam = searchParams.get('month_year');
  const pageNum = searchParams.get('page');
  const rowNum = searchParams.get('row');

  const confirm = useBoolean();
  const [paymentId, setPaymentId] = useState(null);

  const table = useTable({
    defaultCurrentPage: Number(pageNum) || 0,
    defaultRowsPerPage: Number(rowNum) || 10,
  });

  const defaultFilters = useMemo(
    () => ({
      username: nameParam || '',
      code: codeParam || '',
      payment_status: statusParam || '',
      month_year: dateParam || null,
    }),
    [codeParam, dateParam, nameParam, statusParam]
  );

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [loading, setLoading] = useState(false);
  const showDetailDialog = useBoolean();
  const [reconciliationId, setReconciliationId] = useState('');

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = filters.month_year
    ? filters.month_year.getTime() > new Date().getTime()
    : false;

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.username || !!filters.code || !!filters.month_year || !!filters.payment_status;

  const notFound = !tableData.length && !loading;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      searchParams.set(name, value);

      searchParams.delete('page');
      router.push(`${paths.dashboard.affiliate.reconciliation}?${searchParams}`);
    },
    [router, searchParams, table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      username: '',
      code: '',
      month_year: null,
      payment_status: '',
    });
    router.push(paths.dashboard.affiliate.reconciliation);
  }, [router]);

  const handleCloseDetailDialog = useCallback(() => {
    showDetailDialog.onFalse();
    setReconciliationId('');
  }, [showDetailDialog]);

  const handleFetchData = useCallback(async () => {
    setLoading(true);
    const { username, code, payment_status, month_year } = filters;
    const params = {
      username,
      ...(!dateError && {
        month_year: fDate(month_year, 'MM-yyyy'),
      }),
      payment_status,
      code,
      page_size: table.rowsPerPage,
      page_num: table.page + 1,
    };
    try {
      const response = await getListReconciliationApi(params);
      if (response?.data) {
        const { data, total_record } = response.data;
        setTableData(data);
        setTotalRecord(total_record);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [dateError, filters, table.page, table.rowsPerPage]);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  return (
    <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
      <Card
        sx={{
          mt: 6,
          overflow: 'unset',
        }}
      >
        <ReconciliationTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <ReconciliationTableFiltersResult
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
                  ? [...Array(table.rowsPerPage)].map((i, index) => (
                      <ReconciliationTableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  : tableData.map((row) => (
                      <ReconciliationTableRow
                        key={row.id}
                        row={row}
                        onShowReconciliationDetail={() => {
                          showDetailDialog.onTrue();
                          setReconciliationId(row.id);
                        }}
                        onPayment={() => {
                          confirm.onTrue();
                          setPaymentId(row.id);
                        }}
                      />
                    ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <UpdateCommissionPaymentDialog
          open={confirm.value}
          onClose={() => {
            confirm.onFalse();
            setPaymentId(null);
          }}
          paymentId={paymentId}
          handleReload={handleFetchData}
        />

        <ReconciliationDetailDialog
          open={showDetailDialog.value}
          onClose={handleCloseDetailDialog}
          reconciliationId={reconciliationId}
        />

        <TablePaginationCustom
          count={totalRecord}
          page={totalRecord / table.rowsPerPage <= table.page ? 0 : table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={(event, page) => {
            table.onChangePage(event, page);
            searchParams.set('page', page);
            router.push(`${paths.dashboard.affiliate.reconciliation}?${searchParams.toString()}`);
          }}
          onRowsPerPageChange={(event) => {
            table.onChangeRowsPerPage(event);
            searchParams.set('row', event.target.value);
            table.setPage(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.affiliate.reconciliation}?${searchParams.toString()}`);
          }}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}
