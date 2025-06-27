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
import { useBoolean } from 'src/hooks/use-boolean';
import { enqueueSnackbar } from 'notistack';
import { ERROR_CODE } from 'src/utils/constance';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingButton } from '@mui/lab';
import { deleteBannerApi, getBannerApi } from 'src/api/banner.api';
import BannerTableRow from './banner-table-row';
import BannerTableToolbar from './banner-table-toolbar';
import BannerTableFiltersResult from './banner-table-filters-result';
import BannerTableSkeleton from './banner-table-skeleton';
import CreateEditBannerDialog from './create-edit-banner-dialog';

// ----------------------------------------------------------------------

export default function BannerManagementView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isActiveParam = searchParams.get('is_active');
  const titleParam = searchParams.get('title');
  const linkTypeParam = searchParams.get('link_type');
  const pageNum = searchParams.get('page');
  const rowNum = searchParams.get('row');
  const table = useTable({
    defaultCurrentPage: Number(pageNum) || 0,
    defaultRowsPerPage: Number(rowNum) || 10,
  });

  const TABLE_HEAD = [
    { id: 'image', label: 'Hình ảnh', align: 'center' },
    { id: 'title', label: 'Tiêu đề' },
    { id: 'link', label: 'Đường dẫn' },
    { id: 'link_type', label: 'Loại đường dẫn', align: 'center' },
    { id: 'created_at', label: 'Ngày tạo' },
    { id: 'is_active', label: 'Trạng thái', align: 'center' },
    { id: 'action', label: 'Hành động', align: 'center' },
  ];

  const defaultFilters = useMemo(
    () => ({
      title: titleParam || '',
      link_type: linkTypeParam || 'all',
      is_active: isActiveParam || 'all',
    }),
    [titleParam, linkTypeParam, isActiveParam]
  );

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [loading, setLoading] = useState({
    fetch: false,
    delete: false,
  });
  const create = useBoolean();

  const confirm = useBoolean();
  const [deleteId, setDeleteId] = useState('');
  const [updateData, setUpdateData] = useState(null);

  const [filters, setFilters] = useState(defaultFilters);

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    filters.link_type !== 'all' || filters.is_active !== 'all' || filters.title !== '';

  const notFound = !tableData.length && !loading.fetch;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      searchParams.set(name, value);

      searchParams.delete('page');
      router.push(`${paths.dashboard.banner.root}?${searchParams}`);
    },
    [router, searchParams, table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      title: '',
      is_active: 'all',
      link_type: 'all',
    });
    router.push(paths.dashboard.banner.root);
  }, [router]);

  const handleFetchData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    const { title, is_active, link_type } = filters;
    const params = {
      title,
      ...(link_type !== 'all' && { link_type }),
      ...(is_active !== 'all' && { is_active: is_active === 'true' }),
      page_size: table.rowsPerPage,
      page_num: table.page + 1,
    };

    try {
      const response = await getBannerApi(params);
      setTableData(response.data.data);
      setTotalRecord(response.data.total_record);
    } catch (error) {
      console.log(error);
      setTableData([]);
      setTotalRecord(0);
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  }, [filters, table.rowsPerPage, table.page]);

  const handleDeleteBanner = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, delete: true }));
      await deleteBannerApi(deleteId);
      handleFetchData();
      enqueueSnackbar('Xóa thành công!', { variant: 'success' });
    } catch (error) {
      console.log(error);
      if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
        enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
      } else {
        enqueueSnackbar('Xóa thất bại!', { variant: 'error' });
      }
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
      confirm.onFalse();
    }
  }, [confirm, deleteId, handleFetchData]);

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
        <BannerTableToolbar filters={filters} onFilters={handleFilters} onCreate={create.onTrue} />

        {canReset && (
          <BannerTableFiltersResult
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
                {loading.fetch
                  ? [...Array(getNumSkeleton(table.rowsPerPage, tableData.length))].map(
                      (i, index) => <BannerTableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  : tableData.map((row) => (
                      <BannerTableRow
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
            router.push(`${paths.dashboard.banner.root}?${searchParams.toString()}`);
          }}
          onRowsPerPageChange={(event) => {
            table.onChangeRowsPerPage(event);
            searchParams.set('row', event.target.value);
            table.setPage(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.banner.root}?${searchParams.toString()}`);
          }}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
      <CreateEditBannerDialog
        open={create.value}
        onClose={create.onFalse}
        handleReloadData={handleFetchData}
        updateData={updateData}
        setUpdateData={setUpdateData}
      />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Bạn chắc chắn muốn xóa banner này?"
        action={
          <LoadingButton
            loading={loading.delete}
            variant="contained"
            color="error"
            onClick={handleDeleteBanner}
          >
            Xác nhận
          </LoadingButton>
        }
      />
    </Container>
  );
}
