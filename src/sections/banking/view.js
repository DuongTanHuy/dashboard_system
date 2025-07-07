import { useState, useCallback, useMemo } from 'react';
import { utils, writeFile } from 'xlsx-js-style';
// @mui
import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';
import { Card, IconButton, Table, TableBody, TableContainer, Tooltip } from '@mui/material';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from 'src/components/table';
import Scrollbar from 'src/components/scrollbar';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { fDate } from 'src/utils/format-time';
import { getNumSkeleton } from 'src/utils/format-number';
import Iconify from 'src/components/iconify';
import { enqueueSnackbar } from 'notistack';
import { getStorage, setStorage } from 'src/hooks/use-local-storage';
import { backing_data } from 'src/utils/mock';
import BankingTableToolbar from './banking-table-toolbar';
import BankingTableFiltersResult from './banking-table-filters-result';
import BankingTableSkeleton from './banking-table-skeleton';
import BankingTableRow from './banking-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'STT', align: 'center', width: 60 },
  { id: 'transaction_number', label: 'ID', align: 'center', width: 60 },
  { id: 'amount', label: 'Số tiền nạp', align: 'center' },
  { id: 'created_at', label: 'Ngày giao dịch' },
  { id: 'description', label: 'Mô tả' },
  { id: 'type', label: 'Loại giao dịch', align: 'center' },
  { id: 'bank_type', label: 'Tên ngân hàng', align: 'center' },
];

// ----------------------------------------------------------------------

export default function BankingView() {
  const searchParams = useSearchParams();
  const descriptionParam = searchParams.get('description');
  const typeParam = searchParams.get('type');
  const startDateParam = searchParams.get('start_date');
  const endDateParam = searchParams.get('end_date');
  const defaultPage = searchParams.get('page');
  const defaultRowsPerPage = searchParams.get('row');
  const defaultDense = searchParams.get('dense');

  const router = useRouter();
  const settings = useSettingsContext();
  const table = useTable({
    defaultRowsPerPage:
      Number(getStorage('banking-transaction-history-page')) || Number(defaultRowsPerPage),
    defaultCurrentPage: Number(defaultPage),
    defaultDense: defaultDense === 'true',
  });

  const defaultFilters = useMemo(
    () => ({
      description: descriptionParam || '',
      type: typeParam || '',
      ...{ start_date: startDateParam ? new Date(startDateParam) : null },
      ...{ end_date: endDateParam ? new Date(endDateParam) : null },
    }),
    [descriptionParam, endDateParam, startDateParam, typeParam]
  );
  const [filters, setFilters] = useState(defaultFilters);

  const [loading] = useState(false);

  // const { data: tanstackData, isLoading: loading } = useGetBankingTransaction(
  //   {
  //     type: deferredFilters.type,
  //     description: deferredFilters.description,
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

  const tableData = useMemo(() => {
    if (backing_data?.data) {
      table.setSelected(
        table.selected.filter((id) => backing_data.data.map((row) => row.id).includes(id))
      );
    }

    return backing_data?.data || [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalTransaction = useMemo(() => backing_data?.total_record || 0, []);

  const canReset =
    !!filters.description || !!filters.type || !!filters.start_date || !!filters.end_date;
  const notFound = !tableData.length && !loading;
  const denseHeight = table.dense ? 52 : 72;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (name === 'description' || name === 'type') {
        searchParams.set(name, value);
      } else {
        searchParams.set(name, fDate(value, 'yyyy-MM-dd'));
      }
      searchParams.delete('page');
      router.push(`${paths.dashboard.transaction_history.banking}?${searchParams}`);
    },
    [router, searchParams, table]
  );

  const handleExportExcelFile = useCallback(() => {
    const selectedData = tableData.filter((row) => table.selected.includes(row.id));

    try {
      const headerStyle = {
        fill: {
          fgColor: { rgb: '0070C0' },
        },
        font: {
          color: { rgb: 'FFFFFF' },
          bold: true,
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
      };

      const filename = `Invoice_Upload_${fDate(new Date(), 'yyyy-MM-dd')}.xlsx`;

      const data = selectedData.map((row, index) => ({
        MaHD: `HD${index + 1}`,
        NgayHoaDon: fDate(row.created_at, 'dd/MM/yyyy'),
        MaKhachHang: '',
        TenNguoiMua: 'Khách lẻ',
        TenDonVi: '',
        MaSoThue: '',
        DiaChiKhachHang: '',
        SoDienThoai: '',
        SoBangKe: '',
        NgayBangKe: '',
        SOTKKHACH: '',
        TENNHKHACH: '',
        HinhThucThanhToan: 'Chuyển khoản',
        ThueSuat: '',
        ThueSuatKhac: '',
        MaHang: '',
        TenHangHoa: `Phần mềm Marketing gói ${Math.ceil(row.amount / 1000)} điểm`,
        DVT: 'Gói',
        SoLuong: 1,
        DonGia: row.amount,
        ThanhTien: row.amount,
        TienTe: 'VND',
        SoTT: 1,
        TinhChat: 1,
        Email: '',
        Ghichu: '',
        TyGia: '',
        GiamTruHoaDon: '',
        GiamTruTungDongHangHoa: '',
        TienGiamTru: '',
        'TyLe%ChietKhau': '',
        TienChietKhau: '',
        TienThue: '',
      }));

      const workbook = utils.book_new();

      const worksheet = utils.json_to_sheet(data);

      const colWidths = [
        { wch: 12 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
        { wch: 25 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 40 },
        { wch: 10 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 20 },
        { wch: 10 },
        { wch: 10 },
        { wch: 20 },
        { wch: 25 },
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
      ];

      worksheet['!cols'] = colWidths;

      const headerRange = utils.decode_range(worksheet['!ref']);
      const firstRow = headerRange.s.r;

      // eslint-disable-next-line no-plusplus
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cellAddress = utils.encode_cell({ r: firstRow, c: C });
        // eslint-disable-next-line no-continue
        if (!worksheet[cellAddress]) continue;

        if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};

        if (headerStyle.fill) {
          worksheet[cellAddress].s.fill = headerStyle.fill;
        }

        if (headerStyle.font) {
          worksheet[cellAddress].s.font = headerStyle.font;
        }

        if (headerStyle.alignment) {
          worksheet[cellAddress].s.alignment = headerStyle.alignment;
        }
      }

      utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      writeFile(workbook, filename);

      enqueueSnackbar('Xuất file thành công', { variant: 'success' });
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Đã xảy ra lỗi trong quá trình xuất file', { variant: 'error' });
    }
  }, [table.selected, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      type: '',
      description: '',
      start_date: null,
      end_date: null,
    });
    router.push(paths.dashboard.transaction_history.banking);
  }, [router]);

  return (
    <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
      <Card
        sx={{
          mt: 6,
          overflow: 'unset',
        }}
      >
        <BankingTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <BankingTableFiltersResult
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
          <TableSelectedAction
            numSelected={table.selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => row.id)
              )
            }
            action={
              <Tooltip title="Xuất file excel" placement="top">
                <IconButton color="primary" onClick={handleExportExcelFile}>
                  <Iconify icon="mdi:table-export" />
                </IconButton>
              </Tooltip>
            }
            sx={{
              height: table.dense ? 36 : 56,
              zIndex: 20,
            }}
          />
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row?.id)
                  )
                }
              />

              <TableBody>
                {loading
                  ? [...Array(getNumSkeleton(table.rowsPerPage, tableData.length))].map(
                      (i, index) => (
                        <BankingTableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )
                  : tableData.map((row, index) => (
                      <BankingTableRow
                        key={row.id}
                        no={index + 1}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row?.id)}
                      />
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
            router.push(`${paths.dashboard.transaction_history.banking}?${searchParams}`);
          }}
          onRowsPerPageChange={(event) => {
            table.onChangeRowsPerPage(event);
            searchParams.set('row', event.target.value);
            table.setPage(0);
            searchParams.set('page', 0);
            setStorage('banking-transaction-history-page', event.target.value);
            router.push(`${paths.dashboard.transaction_history.banking}?${searchParams}`);
          }}
          //
          dense={table.dense}
          onChangeDense={(event) => {
            searchParams.set('dense', event.target.checked);
            router.push(`${paths.dashboard.transaction_history.banking}?${searchParams}`);
            table.onChangeDense(event);
          }}
        />
      </Card>
    </Container>
  );
}
