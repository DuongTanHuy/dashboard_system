import { useState, useCallback, useEffect, useMemo } from 'react';
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
// api
// hooks
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { fDate } from 'src/utils/format-time';
import { getNumSkeleton } from 'src/utils/format-number';
import { getCommissionFeeApi } from 'src/api/affiliate.api';
import CommissionFeeTableRow from './commission-fee-table-row';
import CommissionFeeTableToolbar from './commission-fee-table-toolbar';
import CommissionFeeTableFiltersResult from './commission-fee-table-filters-result';
import CommissionFeeTableSkeleton from './commission-fee-table-skeleton';

// ----------------------------------------------------------------------

export default function CommissionFeeView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refererParam = searchParams.get('referer_username');
  const codeParam = searchParams.get('code');
  const startDateParam = searchParams.get('start_date');
  const endDateParam = searchParams.get('end_date');
  const pageNum = searchParams.get('page');
  const rowNum = searchParams.get('row');
  const table = useTable({
    defaultCurrentPage: Number(pageNum) || 0,
    defaultRowsPerPage: Number(rowNum) || 10,
  });

  const TABLE_HEAD = [
    { id: 'code', label: 'Mã đối soát', align: 'center' },
    { id: 'referer', label: 'Người nhận hoa hồng' },
    { id: 'user', label: 'Người được giới thiệu' },
    { id: 'createdAt', label: 'Ngày tạo', minWidth: 160 },
    { id: 'amount', label: 'Số tiền hoa hồng', align: 'center' },
    { id: 'commission_percent', label: 'Phần trăm hoa hồng', align: 'center' },
    { id: 'commission', label: 'Hoa hồng', align: 'center' },
    { id: 'payment_status', label: 'Trạng thái', align: 'center' },
  ];

  const defaultFilters = useMemo(
    () => ({
      referer_username: refererParam || '',
      code: codeParam || '',
      ...{ start_date: startDateParam ? new Date(startDateParam) : null },
      ...{ end_date: endDateParam ? new Date(endDateParam) : null },
    }),
    [codeParam, endDateParam, refererParam, startDateParam]
  );

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(defaultFilters);

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.referer_username || !!filters.code || !!filters.start_date || !!filters.end_date;

  const notFound = !tableData.length && !loading;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (name === 'referer_username' || name === 'code') {
        searchParams.set(name, value);
      } else {
        searchParams.set(name, fDate(value, 'yyyy-MM-dd'));
      }
      searchParams.delete('page');
      router.push(`${paths.dashboard.affiliate.commission_fee}?${searchParams}`);
    },
    [router, searchParams, table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      referer_username: '',
      code: '',
      start_date: null,
      end_date: null,
    });
    router.push(paths.dashboard.affiliate.commission_fee);
  }, [router]);

  const handleFetchData = useCallback(async () => {
    setLoading(true);
    const { referer_username, code, start_date, end_date } = filters;
    const params = {
      referer_username,
      code,
      start_date: fDate(start_date, 'yyyy-MM-dd'),
      end_date: fDate(end_date, 'yyyy-MM-dd'),
      page_size: table.rowsPerPage,
      page_num: table.page + 1,
    };

    try {
      const response = await getCommissionFeeApi(params);
      setTableData(response.data.data);
      setTotalRecord(response.data.total_record);
    } catch (error) {
      console.log(error);
      setTableData([]);
      setTotalRecord(0);
    } finally {
      setLoading(false);
    }
  }, [filters, table.rowsPerPage, table.page]);

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
        <CommissionFeeTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <CommissionFeeTableFiltersResult
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
                        <CommissionFeeTableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )
                  : tableData.map((row, index) => <CommissionFeeTableRow key={row.id} row={row} />)}

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
            router.push(`${paths.dashboard.affiliate.commission_fee}?${searchParams.toString()}`);
          }}
          onRowsPerPageChange={(event) => {
            table.onChangeRowsPerPage(event);
            searchParams.set('row', event.target.value);
            table.setPage(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.affiliate.commission_fee}?${searchParams.toString()}`);
          }}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}
