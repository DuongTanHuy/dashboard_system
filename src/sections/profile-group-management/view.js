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
import { useTable, TableNoData, TableHeadCustom } from 'src/components/table';
// api
// hooks
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { getNumSkeleton } from 'src/utils/format-number';
import TablePaginationNoTotal from 'src/components/table/table-pagination-no-total';
import { fDate } from 'src/utils/format-time';
import { getListProfileGroupApi } from 'src/api/profile-group.api';
import ProfileGroupTableRow from './profile-group-table-row';
import ProfileGroupTableToolbar from './profile-group-table-toolbar';
import ProfileGroupTableFiltersResult from './profile-group-table-filters-result';
import ProfileGroupTableSkeleton from './profile-group-table-skeleton';

// ----------------------------------------------------------------------

export default function ProfileGroupManagementView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('name');
  const creatorParam = searchParams.get('user_created');
  const ownerParam = searchParams.get('user_owner');
  const workspaceParam = searchParams.get('workspace_id');
  const startDateParam = searchParams.get('start_date');
  const endDateParam = searchParams.get('end_date');
  const pageNumber = searchParams.get('page');
  const rowNumber = searchParams.get('row');
  const [isPrev, setIsPrev] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [pageSize, setPageSize] = useState(Number(rowNumber) || 10);
  const [pageNum, setPageNum] = useState(Number(pageNumber) || 0);
  const defaultDense = searchParams.get('dense');

  const table = useTable({
    defaultDense: defaultDense === 'true',
  });

  const TABLE_HEAD = [
    { id: 'group_id', label: 'ID nhóm', align: 'center' },
    { id: 'group_name', label: 'Tên nhóm', align: 'center' },
    { id: 'workspace_id', label: 'ID workspace', align: 'center' },
    { id: 'workspace_name', label: 'Tên workspace', align: 'center' },
    { id: 'user_created', label: 'Người tạo' },
    { id: 'user_owner', label: 'Người sở hữu' },
    { id: 'created_at', label: 'Ngày tạo', align: 'center' },
  ];

  const defaultFilters = useMemo(
    () => ({
      name: nameParam || '',
      user_created: creatorParam || '',
      user_owner: ownerParam || '',
      workspace_id: workspaceParam || '',
      ...{ start_date: startDateParam ? new Date(startDateParam) : null },
      ...{ end_date: endDateParam ? new Date(endDateParam) : null },
    }),
    [creatorParam, endDateParam, nameParam, ownerParam, startDateParam, workspaceParam]
  );

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(defaultFilters);

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.name ||
    !!filters.user_created ||
    !!filters.user_owner ||
    !!filters.workspace_id ||
    !!filters.start_date ||
    !!filters.end_date;

  const notFound = !tableData.length && !loading;

  const handleFilters = useCallback(
    (name, value) => {
      setPageNum(0);
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (name !== 'start_date' && name !== 'end_date') {
        searchParams.set(name, value);
      } else {
        searchParams.set(name, fDate(value, 'yyyy-MM-dd'));
      }

      searchParams.delete('page');
      router.push(`${paths.dashboard.profile_group.root}?${searchParams}`);
    },
    [router, searchParams]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      name: '',
      user_created: '',
      user_owner: '',
      workspace_id: '',
      start_date: null,
      end_date: null,
    });
    router.push(paths.dashboard.profile_group.root);
  }, [router]);

  const handleFetchData = useCallback(
    async (signal) => {
      setLoading(true);
      const { name, user_created, user_owner, workspace_id, start_date, end_date } = filters;
      const params = {
        name,
        user_created,
        user_owner,
        workspace_id,
        start_date: fDate(start_date, 'yyyy-MM-dd'),
        end_date: fDate(end_date, 'yyyy-MM-dd'),
        page_size: pageSize,
        page_num: pageNum + 1,
      };

      try {
        const response = await getListProfileGroupApi(params, signal);

        const { data, is_prev, is_next } = response.data;

        setIsPrev(is_prev);
        setIsNext(is_next);
        setTableData(data);
      } catch (error) {
        console.log(error);
        setTableData([]);
        setIsPrev(false);
        setIsNext(false);
      } finally {
        setLoading(false);
      }
    },
    [filters, pageSize, pageNum]
  );

  useEffect(() => {
    const abortController = new AbortController();

    handleFetchData(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [handleFetchData]);

  return (
    <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
      <Card
        sx={{
          mt: 6,
          overflow: 'unset',
        }}
      >
        <ProfileGroupTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <ProfileGroupTableFiltersResult
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
                  ? [...Array(getNumSkeleton(pageSize, tableData.length))].map((i, index) => (
                      <ProfileGroupTableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  : tableData.map((row, index) => <ProfileGroupTableRow key={row.id} row={row} />)}

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
            router.push(`${paths.dashboard.profile_group.root}?${searchParams}`);
          }}
          //
          pageSize={pageSize}
          handleChangeRowPerPage={(page_size) => {
            setPageSize(page_size);
            searchParams.set('row', page_size);
            setPageNum(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.profile_group.root}?${searchParams}`);
          }}
          pageNum={pageNum}
          handleChangePageNum={(page_number) => {
            setPageNum(page_number);
            searchParams.set('page', page_number);
            router.push(`${paths.dashboard.profile_group.root}?${searchParams}`);
          }}
          isPrev={isPrev}
          isNext={isNext}
          isLoading={loading}
          tableDataLength={tableData.length}
        />
      </Card>
    </Container>
  );
}
