import { Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { TableHeadCustom, TableNoData, useTable } from 'src/components/table';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { fDate } from 'src/utils/format-time';
import Scrollbar from 'src/components/scrollbar';
import { getNumSkeleton } from 'src/utils/format-number';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import TablePaginationNoTotal from 'src/components/table/table-pagination-no-total';
import { worklfow_data } from 'src/utils/mock';
import ListScriptTableToolbar from '../list-table-toolbar';
import ListScriptTableFiltersResult, { SCRIPT_TYPE } from '../list-table-filters-result';
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
  { id: 'owner', label: 'Người sở hữu', minWidth: 140 },
  { id: 'crated_at', label: 'Ngày tạo', width: 160 },
  { id: 'updated_at', label: 'Ngày ngày cập nhật', width: 160 },
  { id: 'type', label: 'Loại', align: 'center', width: 101.25 },
  { id: 'actions', label: 'Hành động', width: 87.98 },
];

// ----------------------------------------------------------------------

export default function ListScriptView() {
  const { user } = useAuthContext();
  const isSuperAdmin = user?.role === 'super_admin';

  const searchParams = useSearchParams();
  const creatorParam = searchParams.get('user_created');
  const ownerParam = searchParams.get('user_owner');
  const nameParam = searchParams.get('name');
  const typeParam = searchParams.get('type');
  const startDateParam = searchParams.get('start_date');
  const endDateParam = searchParams.get('end_date');
  const defaultPage = searchParams.get('page');
  const defaultRowsPerPage = searchParams.get('row');

  const [isPrev, setIsPrev] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [pageSize, setPageSize] = useState(Number(defaultRowsPerPage) || 10);
  const [pageNum, setPageNum] = useState(Number(defaultPage) || 0);
  const defaultDense = searchParams.get('dense');

  const router = useRouter();
  const settings = useSettingsContext();
  const table = useTable({
    defaultDense: defaultDense === 'true',
  });
  const [tableData, setTableData] = useState([]);

  const shareWorkflow = useBoolean();
  const [shareId, setShareId] = useState(null);

  const defaultFilters = useMemo(
    () => ({
      user_created: creatorParam || '',
      user_owner: ownerParam || '',
      name: nameParam || '',
      type: typeParam || '',
      ...{ start_date: startDateParam ? new Date(startDateParam) : null },
      ...{ end_date: endDateParam ? new Date(endDateParam) : null },
    }),
    [creatorParam, endDateParam, nameParam, ownerParam, startDateParam, typeParam]
  );
  const [filters, setFilters] = useState(defaultFilters);
  const canReset =
    filters.user_created !== '' ||
    filters.user_owner !== '' ||
    filters.name !== '' ||
    filters.type !== '' ||
    !!filters.start_date ||
    !!filters.end_date;

  const [isLoading] = useState(false);

  // const { data, isLoading } = useGetListWorkflow({
  //   fields: 'id,name,description,type,created_at,updated_at,user_created,user_owner',
  //   user_created: deferredFilters.user_created,
  //   user_owner: deferredFilters.user_owner,
  //   name: deferredFilters.name,
  //   ...(deferredFilters.type !== '' && { type: deferredFilters.type }),
  //   start_date: fDate(deferredFilters.start_date, 'yyyy-MM-dd'),
  //   end_date: fDate(deferredFilters.end_date, 'yyyy-MM-dd'),
  //   page_size: pageSize,
  //   page_num: pageNum + 1,
  // });

  useEffect(() => {
    if (worklfow_data?.data) {
      const { data: tanstackData, is_prev, is_next } = worklfow_data;

      setIsPrev(is_prev);
      setIsNext(is_next);
      setTableData(tanstackData);

      table.setSelected(
        table.selected.filter((id) => tanstackData.map((row) => row.id).includes(id))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worklfow_data]);

  const notFound = !tableData.length && !isLoading;
  const denseHeight = table.dense ? 52 : 72;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      if (!['start_date', 'end_date'].includes(name)) {
        searchParams.set(name, value);
      } else {
        searchParams.set(name, fDate(value, 'yyyy-MM-dd'));
      }
      searchParams.delete('page');
      router.push(`${paths.dashboard.script.list}?${searchParams}`);
    },
    [router, searchParams, table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      user_created: '',
      user_owner: '',
      name: '',
      type: '',
      start_date: null,
      end_date: null,
    });
    router.push(paths.dashboard.script.list);
  }, [router]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Card
        sx={{
          mt: 6,
          overflow: 'unset',
        }}
      >
        <ListScriptTableToolbar
          filters={filters}
          onFilters={handleFilters}
          category={SCRIPT_TYPE}
        />

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
                },
              }}
            >
              <TableHeadCustom order={table.order} orderBy={table.orderBy} headLabel={TABLE_HEAD} />

              <TableBody>
                {isLoading
                  ? [...Array(getNumSkeleton(pageSize, tableData.length))].map((i, index) => (
                      <ListScriptTableSkeleton
                        key={index}
                        sx={{ height: denseHeight }}
                        displayCell={false}
                      />
                    ))
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

        <TablePaginationNoTotal
          dense={table.dense}
          onChangeDense={(event) => {
            table.onChangeDense(event);
            searchParams.set('dense', event.target.checked);
            router.push(`${paths.dashboard.script.list}?${searchParams}`);
          }}
          //
          pageSize={pageSize}
          handleChangeRowPerPage={(page_size) => {
            setPageSize(page_size);
            searchParams.set('row', page_size);
            setPageNum(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.script.list}?${searchParams}`);
          }}
          pageNum={pageNum}
          handleChangePageNum={(page_number) => {
            setPageNum(page_number);
            searchParams.set('page', page_number);
            router.push(`${paths.dashboard.script.list}?${searchParams}`);
          }}
          isPrev={isPrev}
          isNext={isNext}
          isLoading={isLoading}
          tableDataLength={tableData.length}
        />

        <ShareWorkflowDialog
          open={shareWorkflow.value}
          onClose={() => {
            shareWorkflow.onFalse();
            setShareId(null);
          }}
          shareId={shareId}
          type="workflow"
        />
      </Card>
    </Container>
  );
}
