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
// api
// hooks
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { getNumSkeleton } from 'src/utils/format-number';
import { useBoolean } from 'src/hooks/use-boolean';
import { enqueueSnackbar } from 'notistack';
import { ERROR_CODE } from 'src/utils/constance';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingButton } from '@mui/lab';
import { useDeleteVoucher } from 'src/tanstack/use-voucher';
import { voucher_data } from 'src/utils/mock';
import VoucherTableRow from './voucher-table-row';
import VoucherTableToolbar from './voucher-table-toolbar';
import VoucherTableFiltersResult from './voucher-table-filters-result';
import VoucherTableSkeleton from './voucher-table-skeleton';
import CreateEditVoucherDialog from './create-edit-voucher-dialog';

// ----------------------------------------------------------------------

export default function VoucherManagementView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('name');
  const codeParam = searchParams.get('code');
  const typeParam = searchParams.get('voucher_type');
  const isExpiredParam = searchParams.get('is_expired');
  const pageNum = searchParams.get('page');
  const rowNum = searchParams.get('row');
  const table = useTable({
    defaultCurrentPage: Number(pageNum) || 0,
    defaultRowsPerPage: Number(rowNum) || 10,
  });

  const TABLE_HEAD = [
    { id: 'id', label: 'ID', align: 'center', width: 60 },
    { id: 'name', label: 'Tên mã giảm giá', minWidth: 200 },
    { id: 'code', label: 'Mã code', align: 'center' },
    { id: 'user_usage_limit', label: 'Số lượt / người', align: 'center' },
    { id: 'voucher_usage_limit', label: 'Số lượng voucher', align: 'center' },
    { id: 'discount', label: 'Giá trị giảm', align: 'center' },
    { id: 'created_at', label: 'Ngày tạo', align: 'center' },
    { id: 'date_expired', label: 'Ngày hết hạn', align: 'center' },
    { id: 'is_active', label: 'Trạng thái', align: 'center' },
    { id: 'action', label: 'Hành động', align: 'center' },
  ];

  const defaultFilters = useMemo(
    () => ({
      name: nameParam || '',
      code: codeParam || '',
      voucher_type: typeParam || 'all',
      is_expired: isExpiredParam || 'all',
    }),
    [nameParam, codeParam, typeParam, isExpiredParam]
  );

  const settings = useSettingsContext();

  const create = useBoolean();

  const confirm = useBoolean();
  const [deleteId, setDeleteId] = useState('');
  const [updateData, setUpdateData] = useState(null);

  const [filters, setFilters] = useState(defaultFilters);

  const [isLoading] = useState(false);

  // const { data, isLoading } = useGetVoucher(
  //   {
  //     name: deferredFilters.name,
  //     code: deferredFilters.code,
  //     ...(deferredFilters.voucher_type !== 'all' && { voucher_type: deferredFilters.voucher_type }),
  //     ...(deferredFilters.is_expired !== 'all' && {
  //       is_expired: deferredFilters.is_expired === 'true',
  //     }),
  //     page_size: table.rowsPerPage,
  //     page_num: table.page + 1,
  //   },
  //   {
  //     refetchInterval: 10000,
  //     refetchOnReconnect: true,
  //     refetchOnWindowFocus: true,
  //   }
  // );

  const tableData = useMemo(() => voucher_data?.data || [], []);

  const totalRecord = useMemo(() => voucher_data?.total_record || 0, []);

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.name ||
    !!filters.code ||
    filters.voucher_type !== 'all' ||
    filters.is_expired !== 'all';

  const notFound = !tableData.length && !isLoading;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      searchParams.set(name, value);

      searchParams.delete('page');
      router.push(`${paths.dashboard.voucher.root}?${searchParams}`);
    },
    [router, searchParams, table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      name: '',
      code: '',
      voucher_type: 'all',
      is_expired: 'all',
    });
    router.push(paths.dashboard.voucher.root);
  }, [router]);

  const { mutate, isPending } = useDeleteVoucher();

  const handleDeleteVoucher = useCallback(() => {
    mutate(deleteId, {
      onSuccess: () => {
        enqueueSnackbar('Xóa thành công!', { variant: 'success' });
        confirm.onFalse();
      },
      onError: (error) => {
        if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
          enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
        } else {
          enqueueSnackbar('Xóa thất bại!', { variant: 'error' });
        }
        confirm.onFalse();
      },
    });
  }, [confirm, deleteId, mutate]);

  return (
    <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
      <Card
        sx={{
          mt: 6,
          overflow: 'unset',
        }}
      >
        <VoucherTableToolbar filters={filters} onFilters={handleFilters} onCreate={create.onTrue} />

        {canReset && (
          <VoucherTableFiltersResult
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
                {isLoading
                  ? [...Array(getNumSkeleton(table.rowsPerPage, tableData.length))].map(
                      (i, index) => (
                        <VoucherTableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )
                  : tableData.map((row) => (
                      <VoucherTableRow
                        key={row.id}
                        row={row}
                        onDelete={() => {
                          setDeleteId(row.id);
                          confirm.onTrue();
                        }}
                        onUpdate={() => {
                          setUpdateData(row);
                          create.onTrue();
                        }}
                      />
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
            router.push(`${paths.dashboard.voucher.root}?${searchParams.toString()}`);
          }}
          onRowsPerPageChange={(event) => {
            table.onChangeRowsPerPage(event);
            searchParams.set('row', event.target.value);
            table.setPage(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.voucher.root}?${searchParams.toString()}`);
          }}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
      <CreateEditVoucherDialog
        open={create.value}
        onClose={create.onFalse}
        // handleReloadData={handleFetchData}
        updateData={updateData}
        setUpdateData={setUpdateData}
      />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Bạn chắc chắn muốn xóa voucher này?"
        action={
          <LoadingButton
            loading={isPending}
            variant="contained"
            color="error"
            onClick={handleDeleteVoucher}
          >
            Xác nhận
          </LoadingButton>
        }
      />
    </Container>
  );
}
