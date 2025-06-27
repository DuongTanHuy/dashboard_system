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
import { getListWorkspaceApi } from 'src/api/workspace.api';
import WorkspaceTableRow from './workspace-table-row';
import WorkspaceTableToolbar from './workspace-table-toolbar';
import WorkspaceTableFiltersResult from './workspace-table-filters-result';
import WorkspaceTableSkeleton from './workspace-table-skeleton';

// ----------------------------------------------------------------------

export default function WorkspaceManagementView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const nameParam = searchParams.get('search');
  const workspaceParam = searchParams.get('name');
  const deleteParam = searchParams.get('delete_status');
  const startDateParam = searchParams.get('start_date');
  const endDateParam = searchParams.get('end_date');
  const pageNum = searchParams.get('page');
  const rowNum = searchParams.get('row');
  const table = useTable({
    defaultCurrentPage: Number(pageNum) || 0,
    defaultRowsPerPage: Number(rowNum) || 10,
  });

  const TABLE_HEAD = [
    { id: 'no', label: 'STT', align: 'center', width: 60 },
    { id: 'id', label: 'ID', align: 'center', minWidth: 140 },
    { id: 'name', label: 'Tên' },
    { id: 'description', label: 'Mô tả' },
    { id: 'creator', label: 'Người tạo' },
    { id: 'createdAt', label: 'Ngày tạo' },
    { id: 'deletedAt', label: 'Ngày xóa' },
  ];

  const defaultFilters = useMemo(
    () => ({
      search: nameParam || '',
      id: idParam || '',
      name: workspaceParam || '',
      delete_status: deleteParam || 'undeleted',
      ...{ start_date: startDateParam ? new Date(startDateParam) : null },
      ...{ end_date: endDateParam ? new Date(endDateParam) : null },
    }),
    [deleteParam, endDateParam, idParam, nameParam, startDateParam, workspaceParam]
  );

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [totalWorkspace, setTotalWorkspace] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(defaultFilters);

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.id ||
    filters.delete_status !== 'undeleted' ||
    !!filters.search ||
    !!filters.name ||
    !!filters.start_date ||
    !!filters.end_date;

  const notFound = !tableData.length && !loading;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (name === 'name' || name === 'search' || name === 'id' || name === 'delete_status') {
        searchParams.set(name, value);
      } else {
        searchParams.set(name, fDate(value, 'yyyy-MM-dd'));
      }
      searchParams.delete('page');
      router.push(`${paths.dashboard.workspace.root}?${searchParams}`);
    },
    [router, searchParams, table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      id: '',
      search: '',
      name: '',
      delete_status: 'undeleted',
      start_date: null,
      end_date: null,
    });
    router.push(paths.dashboard.workspace.root);
  }, [router]);

  const handleFetchData = useCallback(async () => {
    setLoading(true);
    const { id, search, name, delete_status, start_date, end_date } = filters;
    const params = {
      workspace_id: id,
      user_created: search,
      name,
      delete_status,
      start_date: fDate(start_date, 'yyyy-MM-dd'),
      end_date: fDate(end_date, 'yyyy-MM-dd'),
      page_size: table.rowsPerPage,
      page_num: table.page + 1,
    };

    try {
      const response = await getListWorkspaceApi(params);
      setTableData(response.data.data);
      setTotalWorkspace(response.data.total_record);
    } catch (error) {
      console.log(error);
      setTableData([]);
      setTotalWorkspace(0);
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
        <WorkspaceTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <WorkspaceTableFiltersResult
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
                        <WorkspaceTableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )
                  : tableData.map((row, index) => (
                      <WorkspaceTableRow key={row.id} no={index + 1} row={row} />
                    ))}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={totalWorkspace}
          page={totalWorkspace / table.rowsPerPage <= table.page ? 0 : table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={(event, page) => {
            table.onChangePage(event, page);
            searchParams.set('page', page);
            router.push(`${paths.dashboard.workspace.root}?${searchParams.toString()}`);
          }}
          onRowsPerPageChange={(event) => {
            table.onChangeRowsPerPage(event);
            searchParams.set('row', event.target.value);
            table.setPage(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.workspace.root}?${searchParams.toString()}`);
          }}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}
