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
import { getListUserActivityApi } from 'src/api/user-activity.api';
import TablePaginationNoTotal from 'src/components/table/table-pagination-no-total';
import { fDate } from 'src/utils/format-time';
import UserActivityTableRow from './user-activity-table-row';
import AffiliateTableToolbar from './user-activity-table-toolbar';
import UserActivityTableFiltersResult from './user-activity-table-filters-result';
import UserActivityTableSkeleton from './user-activity-table-skeleton';
import DataExtraDialog from './data-extra-dialog';

// ----------------------------------------------------------------------

export default function UserActivityManagementView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('username');
  const profileIdParam = searchParams.get('profile_id');
  const profileParam = searchParams.get('profile_name');
  const activityParam = searchParams.get('activity_type');
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
  const [dataExtraId, setDataExtraId] = useState(null);

  const table = useTable({
    defaultDense: defaultDense === 'true',
  });

  const TABLE_HEAD = [
    { id: 'no', label: 'STT', align: 'center', width: 60 },
    { id: 'name', label: 'Tên người dùng' },
    { id: 'workspace_id', label: 'ID workspace', align: 'center' },
    { id: 'workspace_name', label: 'Tên workspace', align: 'center' },
    { id: 'profile_id', label: 'ID hồ sơ', align: 'center' },
    { id: 'profile', label: 'Tên hồ sơ' },
    { id: 'user_act', label: 'Hành động', align: 'center' },
    { id: 'amount', label: 'Số tiền giao dịch', align: 'center' },
    { id: 'balance_after_transaction', label: 'Số dư cuối', align: 'center' },
    { id: 'created_at', label: 'Ngày thực hiện' },
    { id: 'data', label: 'Dữ liệu', align: 'center', width: 60 },
  ];

  const defaultFilters = useMemo(
    () => ({
      username: nameParam || '',
      profile_id: profileIdParam || '',
      profile_name: profileParam || '',
      activity_type: activityParam || '',
      workspace_id: workspaceParam || '',
      ...{ start_date: startDateParam ? new Date(startDateParam) : null },
      ...{ end_date: endDateParam ? new Date(endDateParam) : null },
    }),
    [
      activityParam,
      endDateParam,
      nameParam,
      profileIdParam,
      profileParam,
      startDateParam,
      workspaceParam,
    ]
  );

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(defaultFilters);

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.username ||
    !!filters.profile_id ||
    !!filters.profile_name ||
    !!filters.activity_type ||
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
      router.push(`${paths.dashboard.user_activity}?${searchParams}`);
    },
    [router, searchParams]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      username: '',
      profile_id: '',
      profile_name: '',
      activity_type: '',
      workspace_id: '',
      start_date: null,
      end_date: null,
    });
    router.push(paths.dashboard.user_activity);
  }, [router]);

  const handleFetchData = useCallback(
    async (signal) => {
      setLoading(true);
      const {
        username,
        profile_id,
        profile_name,
        activity_type,
        workspace_id,
        start_date,
        end_date,
      } = filters;
      const params = {
        username,
        profile_id,
        profile_name,
        activity_type,
        workspace_id,
        start_date: fDate(start_date, 'yyyy-MM-dd'),
        end_date: fDate(end_date, 'yyyy-MM-dd'),
        page_size: pageSize,
        page_num: pageNum + 1,
      };

      try {
        const response = await getListUserActivityApi(params, signal);

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
    <>
      <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
        <Card
          sx={{
            mt: 6,
            overflow: 'unset',
          }}
        >
          <AffiliateTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <UserActivityTableFiltersResult
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
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                />

                <TableBody>
                  {loading
                    ? [...Array(getNumSkeleton(pageSize, tableData.length))].map((i, index) => (
                        <UserActivityTableSkeleton key={index} sx={{ height: denseHeight }} />
                      ))
                    : tableData.map((row, index) => (
                        <UserActivityTableRow
                          key={row.id}
                          no={index + 1}
                          row={row}
                          setDataExtraId={setDataExtraId}
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
              router.push(`${paths.dashboard.user_activity}?${searchParams}`);
            }}
            //
            pageSize={pageSize}
            handleChangeRowPerPage={(page_size) => {
              setPageSize(page_size);
              searchParams.set('row', page_size);
              setPageNum(0);
              searchParams.set('page', 0);
              router.push(`${paths.dashboard.user_activity}?${searchParams}`);
            }}
            pageNum={pageNum}
            handleChangePageNum={(page_number) => {
              setPageNum(page_number);
              searchParams.set('page', page_number);
              router.push(`${paths.dashboard.user_activity}?${searchParams}`);
            }}
            isPrev={isPrev}
            isNext={isNext}
            isLoading={loading}
            tableDataLength={tableData.length}
          />
        </Card>
      </Container>
      <DataExtraDialog
        open={!!dataExtraId}
        onClose={() => setDataExtraId(null)}
        dataExtraId={dataExtraId}
      />
    </>
  );
}
