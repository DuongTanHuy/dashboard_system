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
import { getNumSkeleton } from 'src/utils/format-number';
import { getListAffiliateApi } from 'src/api/affiliate.api';
import AffiliateTableRow from './affiliate-table-row';
import AffiliateTableToolbar from './affiliate-table-toolbar';
import AffiliateTableFiltersResult from './affiliate-table-filters-result';
import AffliateTableSkeleton from './affiliate-table-skeleton';

// ----------------------------------------------------------------------

export default function AffiliateManagementView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('search');
  const pageNum = searchParams.get('page');
  const rowNum = searchParams.get('row');
  const table = useTable({
    defaultCurrentPage: Number(pageNum) || 0,
    defaultRowsPerPage: Number(rowNum) || 10,
  });

  const TABLE_HEAD = [
    { id: 'no', label: 'STT', align: 'center', width: 60 },
    { id: 'name', label: 'Tên' },
    { id: 'affiliate_level', label: 'Cấp bật liên kết', align: 'center' },
    { id: 'n_user_invited', label: 'Số người đã giới thiệu' },
    { id: 'n_user_buy_package ', label: 'Số người đã mua gói', align: 'center' },
    { id: 'total_earned ', label: 'Tổng hoa hồng', align: 'center' },
    { id: 'commission_balance', label: 'Hoa hồng chưa thanh toán', align: 'center' },
  ];

  const defaultFilters = useMemo(
    () => ({
      search: nameParam || '',
    }),
    [nameParam]
  );

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [totalAffiliate, setTotalAffiliate] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(defaultFilters);

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.search;

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
      router.push(`${paths.dashboard.affiliate.affiliate_user}?${searchParams}`);
    },
    [router, searchParams, table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: '',
    });
    router.push(paths.dashboard.affiliate.affiliate_user);
  }, [router]);

  const handleFetchData = useCallback(async () => {
    setLoading(true);
    const { search } = filters;
    const params = {
      username: search,
      page_size: table.rowsPerPage,
      page_num: table.page + 1,
    };

    try {
      const response = await getListAffiliateApi(params);
      setTableData(response.data.data);
      setTotalAffiliate(response.data.total_record);
    } catch (error) {
      console.log(error);
      setTableData([]);
      setTotalAffiliate(0);
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
        <AffiliateTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <AffiliateTableFiltersResult
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
                        <AffliateTableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )
                  : tableData.map((row, index) => (
                      <AffiliateTableRow key={row.id} no={index + 1} row={row} />
                    ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={totalAffiliate}
          page={totalAffiliate / table.rowsPerPage <= table.page ? 0 : table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={(event, page) => {
            table.onChangePage(event, page);
            searchParams.set('page', page);
            router.push(`${paths.dashboard.affiliate.affiliate_user}?${searchParams.toString()}`);
          }}
          onRowsPerPageChange={(event) => {
            table.onChangeRowsPerPage(event);
            searchParams.set('row', event.target.value);
            table.setPage(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.affiliate.affiliate_user}?${searchParams.toString()}`);
          }}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}
