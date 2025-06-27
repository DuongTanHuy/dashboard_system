import { Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useSettingsContext } from 'src/components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { fDate } from 'src/utils/format-time';
import Scrollbar from 'src/components/scrollbar';
import { getNumSkeleton } from 'src/utils/format-number';
import { useGetCategoryList } from 'src/api/workflow.api';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import { public_workflow_data } from 'src/utils/mock';
import ListScriptTableToolbar from '../list-table-toolbar';
import ListScriptTableFiltersResult from '../list-table-filters-result';
import ListScriptTableSkeleton from '../list-table-skeleton';
import ListScriptTableRow from '../list-table-row';
import ShareWorkflowDialog from '../share-workflow-dialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'no', label: 'STT', align: 'center', width: 60 },
  { id: 'id', label: 'ID', align: 'center', width: 60 },
  { id: 'script_name', label: 'Tên script', minWidth: 200 },
  { id: 'detail', label: 'Mô tả', minWidth: 300 },
  { id: 'creator', label: 'Người tạo', minWidth: 140 },
  { id: 'workflow_category', label: 'Danh mục' },
  { id: 'crated_at', label: 'Ngày tạo', width: 160 },
  { id: 'updated_at', label: 'Ngày ngày cập nhật', width: 160 },
  { id: 'type', label: 'Loại', align: 'center', width: 101.25 },
  { id: 'fee', label: 'Giá', align: 'center', minWidth: 77.71 },
  { id: 'status', label: 'Trạng thái', align: 'center', width: 121.73 },
  { id: 'actions', label: 'Hành động', width: 87.98 },
];

// ----------------------------------------------------------------------

export default function ApproveScriptView() {
  const { user } = useAuthContext();
  const isSuperAdmin = user?.role === 'super_admin';

  const searchParams = useSearchParams();
  const searchParam = searchParams.get('search');
  const nameParam = searchParams.get('name');
  const categoryParam = searchParams.get('workflow_category_id');
  const startDateParam = searchParams.get('start_date');
  const endDateParam = searchParams.get('end_date');
  const defaultPage = searchParams.get('page');
  const defaultRowsPerPage = searchParams.get('row');
  const defaultDense = searchParams.get('dense');

  const { category } = useGetCategoryList();
  const router = useRouter();
  const settings = useSettingsContext();
  const table = useTable({
    defaultRowsPerPage: Number(defaultRowsPerPage),
    defaultCurrentPage: Number(defaultPage),
    defaultDense: defaultDense === 'true',
  });
  const [tableData, setTableData] = useState(public_workflow_data.data);
  const [totalRecord] = useState(public_workflow_data.total_record);
  const [loading] = useState(false);
  const shareWorkflow = useBoolean();
  const [shareId, setShareId] = useState(null);

  const defaultFilters = useMemo(
    () => ({
      search: searchParam || '',
      name: nameParam || '',
      workflow_category_id: categoryParam || '',
      ...{ start_date: startDateParam ? new Date(startDateParam) : null },
      ...{ end_date: endDateParam ? new Date(endDateParam) : null },
    }),
    [categoryParam, endDateParam, nameParam, searchParam, startDateParam]
  );
  const [filters, setFilters] = useState(defaultFilters);
  const canReset =
    filters.search !== '' ||
    filters.name !== '' ||
    filters.workflow_category_id !== '' ||
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

      if (name === 'name' || name === 'search' || name === 'workflow_category_id') {
        searchParams.set(name, value);
      } else {
        searchParams.set(name, fDate(value, 'yyyy-MM-dd'));
      }
      searchParams.delete('page');
      router.push(`${paths.dashboard.script.approve}?${searchParams}`);
    },
    [router, searchParams, table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: '',
      name: '',
      workflow_category_id: '',
      start_date: null,
      end_date: null,
    });
    router.push(paths.dashboard.script.approve);
  }, [router]);

  // api not available
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const { start_date, end_date, name, search, workflow_category_id } = filters;
  //       setLoading(true);
  //       const params = {
  //         user_created: search,
  //         name,
  //         workflow_category_id: workflow_category_id.split('-')?.[0],
  //         start_date: fDate(start_date, 'yyyy-MM-dd'),
  //         end_date: fDate(end_date, 'yyyy-MM-dd'),
  //         page_size: table.rowsPerPage,
  //         page_num: table.page + 1,
  //       };

  //       const response = await getListPublicWorkflowApi(params);
  //       const { data, total_record } = response.data;

  //       setTableData(data);
  //       setTotalRecord(total_record);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [filters, table.page, table.rowsPerPage]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Card
        sx={{
          mt: 6,
          overflow: 'unset',
        }}
      >
        <ListScriptTableToolbar filters={filters} onFilters={handleFilters} category={category} />

        {canReset && (
          <ListScriptTableFiltersResult
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
            <Table
              size={table.dense ? 'small' : 'medium'}
              sx={{
                minWidth: 960,
                height: 1,
                '& th:last-child, td:last-child': {
                  minWidth: 87.98,
                  maxWidth: 87.98,
                  position: 'sticky',
                  right: 0,
                  bgcolor: '#fff',
                  ...(settings.themeMode === 'dark' && {
                    bgcolor: '#212b36',
                  }),
                  p: '8px',
                },
                '& th:nth-last-of-type(2), td:nth-last-of-type(2)': {
                  minWidth: 121.73,
                  maxWidth: 121.73,
                  position: 'sticky',
                  right: 87.98,
                  bgcolor: '#fff',
                  ...(settings.themeMode === 'dark' && {
                    bgcolor: '#212b36',
                  }),
                  p: '8px',
                },
                '& th:nth-last-of-type(3), td:nth-last-of-type(3)': {
                  minWidth: 77.71,
                  maxWidth: 77.71,
                  position: 'sticky',
                  right: 209.71,
                  bgcolor: '#fff',
                  ...(settings.themeMode === 'dark' && {
                    bgcolor: '#212b36',
                  }),
                  p: '8px',
                },
                '& th:nth-last-of-type(4), td:nth-last-of-type(4)': {
                  minWidth: 101.25,
                  maxWidth: 101.25,
                  position: 'sticky',
                  right: 287.42,
                  bgcolor: '#fff',
                  ...(settings.themeMode === 'dark' && {
                    bgcolor: '#212b36',
                  }),
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '10px',
                    boxShadow: `-5px 0px 5px rgba(0, 0, 0, ${
                      settings.themeMode === 'dark' ? 0.6 : 0.1
                    })`,
                  },
                  p: '8px',
                },
              }}
            >
              <TableHeadCustom order={table.order} orderBy={table.orderBy} headLabel={TABLE_HEAD} />

              <TableBody>
                {loading
                  ? [...Array(getNumSkeleton(table.rowsPerPage, tableData.length))].map(
                      (i, index) => (
                        <ListScriptTableSkeleton
                          key={index}
                          sx={{ height: denseHeight }}
                          displayCell
                        />
                      )
                    )
                  : tableData.map((row, index) => (
                      <ListScriptTableRow
                        key={row.id}
                        no={index + 1}
                        row={row}
                        handleReloadData={() =>
                          setTableData((prev) => prev.filter((item) => item.id !== row.id))
                        }
                        onShare={() => {
                          shareWorkflow.onTrue();
                          setShareId(row.id);
                        }}
                        isSuperAdmin={isSuperAdmin}
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
            router.push(`${paths.dashboard.script.approve}?${searchParams}`);
          }}
          onRowsPerPageChange={(event) => {
            table.onChangeRowsPerPage(event);
            searchParams.set('row', event.target.value);
            table.setPage(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.script.approve}?${searchParams}`);
          }}
          //
          dense={table.dense}
          onChangeDense={(event) => {
            searchParams.set('dense', event.target.checked);
            router.push(`${paths.dashboard.script.approve}?${searchParams}`);
            table.onChangeDense(event);
          }}
        />

        <ShareWorkflowDialog
          open={shareWorkflow.value}
          onClose={() => {
            shareWorkflow.onFalse();
            setShareId(null);
          }}
          shareId={shareId}
        />
      </Card>
    </Container>
  );
}
