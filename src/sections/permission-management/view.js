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
import { deletePermissionApi, getListPermissionApi } from 'src/api/permission.api';
import { useBoolean } from 'src/hooks/use-boolean';
import { enqueueSnackbar } from 'notistack';
import { ERROR_CODE } from 'src/utils/constance';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import PermissionTableRow from './permission-table-row';
import PermissionTableToolbar from './permission-table-toolbar';
import PermissionTableFiltersResult from './permission-table-filters-result';
import PermissionTableSkeleton from './permission-table-skeleton';
import CreateEditPermissionDialog from './create-edit-permission-dialog';

// ----------------------------------------------------------------------

export default function PermissionManagementView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('name');
  const parentParam = searchParams.get('parent');
  const pageNum = searchParams.get('page');
  const rowNum = searchParams.get('row');
  const table = useTable({
    defaultCurrentPage: Number(pageNum) || 0,
    defaultRowsPerPage: Number(rowNum) || 100,
  });
  const [groupPermission, setGroupPermission] = useState([]);

  const TABLE_HEAD = [
    { id: 'id', label: 'ID', align: 'center', width: 60 },
    { id: 'name', label: 'Tên quyền' },
    { id: 'description', label: 'Mô tả', minWidth: 360 },
    { id: 'slug', label: 'Slug', align: 'center', minWidth: 160 },
    { id: 'parent_id', label: 'Nhóm quyền', align: 'center', minWidth: 200 },
    { id: 'created_at', label: 'Ngày tạo' },
    { id: 'updated_at', label: 'Ngày cập nhật' },
    { id: 'action', label: 'Hành động' },
  ];

  const defaultFilters = useMemo(
    () => ({
      name: nameParam || '',
      parent: parentParam || '',
    }),
    [nameParam, parentParam]
  );

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [loading, setLoading] = useState({
    fetch: false,
    delete: false,
  });
  const create = useBoolean();
  const [refreshGroup, setRefreshGroup] = useState(1);

  const confirm = useBoolean();
  const [deleteId, setDeleteId] = useState('');
  const [deleteType, setDeleteType] = useState('');
  const [updateData, setUpdateData] = useState(null);

  const [filters, setFilters] = useState(defaultFilters);

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name || !!filters.parent;

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
      router.push(`${paths.dashboard.permission.root}?${searchParams}`);
    },
    [router, searchParams, table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      name: '',
      parent: '',
    });
    router.push(paths.dashboard.permission.root);
  }, [router]);

  const handleFetchData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    const { name, parent } = filters;
    const params = {
      name,
      parent,
      page_size: table.rowsPerPage,
      page_num: table.page + 1,
    };

    try {
      const response = await getListPermissionApi(params);
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

  const handleDeletePermission = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, delete: true }));
      await deletePermissionApi(deleteId);
      handleFetchData();
      if (deleteType === 'group') {
        setRefreshGroup((prev) => prev + 1);
      }
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
  }, [confirm, deleteId, deleteType, handleFetchData]);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  useEffect(() => {
    const handleFetchGroupPermission = async () => {
      const params = {
        parent: 'null',
      };

      try {
        const response = await getListPermissionApi(params);
        setGroupPermission(response.data.data);
      } catch (error) {
        console.log(error);
        setGroupPermission([]);
      }
    };

    handleFetchGroupPermission();
  }, [refreshGroup]);

  return (
    <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
      <Card
        sx={{
          mt: 6,
          overflow: 'unset',
        }}
      >
        <PermissionTableToolbar
          filters={filters}
          onFilters={handleFilters}
          onCreate={create.onTrue}
          groupPermission={groupPermission}
        />

        {canReset && (
          <PermissionTableFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={tableData.length}
            sx={{ p: 2.5, pt: 0 }}
            groupPermission={groupPermission}
          />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom order={table.order} orderBy={table.orderBy} headLabel={TABLE_HEAD} />

              <TableBody>
                {loading.fetch
                  ? [...Array(getNumSkeleton(table.rowsPerPage, tableData.length))].map(
                      (i, index) => (
                        <PermissionTableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )
                  : tableData.map((row) => (
                      <PermissionTableRow
                        key={row.id}
                        row={row}
                        onDelete={(type) => {
                          setDeleteId(row.id);
                          setDeleteType(type);
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
            router.push(`${paths.dashboard.permission.root}?${searchParams.toString()}`);
          }}
          onRowsPerPageChange={(event) => {
            table.onChangeRowsPerPage(event);
            searchParams.set('row', event.target.value);
            table.setPage(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.permission.root}?${searchParams.toString()}`);
          }}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
      <CreateEditPermissionDialog
        open={create.value}
        onClose={create.onFalse}
        handleReloadData={handleFetchData}
        groupOptions={groupPermission}
        onRefreshGroup={() => setRefreshGroup((prev) => prev + 1)}
        updateData={updateData}
        setUpdateData={setUpdateData}
      />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={`Bạn chắc chắn muốn xóa ${deleteType === 'group' ? 'nhóm' : ''} quyền này?`}
        content={
          deleteType === 'group' ? (
            <Typography color="text.secondary">
              Các quyền con của nhóm này cũng sẽ bị xóa!
            </Typography>
          ) : undefined
        }
        sx={{
          ...(deleteType === 'permission' && {
            '& .MuiDialogActions-root': {
              pt: 0,
            },
          }),
        }}
        action={
          <LoadingButton
            loading={loading.delete}
            variant="contained"
            color="error"
            onClick={handleDeletePermission}
          >
            Xác nhận
          </LoadingButton>
        }
      />
    </Container>
  );
}
