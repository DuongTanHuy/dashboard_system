import { some } from 'lodash';
import {
  Card,
  Container,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { TableHeadCustom, TableNoData, TableSelectedAction, useTable } from 'src/components/table';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { fDate } from 'src/utils/format-time';
import Scrollbar from 'src/components/scrollbar';
import { getNumSkeleton } from 'src/utils/format-number';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import TablePaginationNoTotal from 'src/components/table/table-pagination-no-total';
import { useAuthContext } from 'src/auth/hooks';
import { profile_data } from 'src/utils/mock';
import ListProfileTableToolbar from '../list-table-toolbar';
import ListProfileTableFiltersResult from '../list-table-filters-result';
import ListScriptTableSkeleton from '../list-table-skeleton';
import ListProfileTableRow from '../list-table-row';
import DeleteMultiDialog from '../delete-multi-dialog';
import RestoreMultiDialog from '../restore-multi-dialog';
import TransferSingleProfile from '../transfer-single-profile';
import TransferMultiProfile from '../transfer-multi-profile';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID hồ sơ', align: 'center', width: 60 },
  { id: 'profile_hash', label: 'Profile hash', align: 'center', width: 60 },
  { id: 'id_workspace', label: 'ID workspace', align: 'center' },
  { id: 'name', label: 'Tên hồ sơ', align: 'center' },
  { id: 'group', label: 'Nhóm', align: 'center', minWidth: 200 },
  { id: 'note', label: 'Ghi chú', minWidth: 300 },
  { id: 'proxy_type', label: 'Loại proxy', align: 'center' },
  { id: 'proxy', label: 'Proxy', align: 'center' },
  { id: 'creator', label: 'Người tạo', minWidth: 160 },
  { id: 'user_owner', label: 'Người sở hữu', minWidth: 160 },
  { id: 'created_at', label: 'Ngày tạo', minWidth: 160 },
  { id: 'expired_at', label: 'Ngày hết hạn', minWidth: 160 },
  { id: 'deleted_at', label: 'Ngày xóa', minWidth: 160 },
  { id: 'time', label: 'Thời hạn', align: 'center' },
  { id: 'actions', label: 'Hành động', align: 'center' },
];

// ----------------------------------------------------------------------

export default function ListScriptView() {
  const { user } = useAuthContext();
  const searchParams = useSearchParams();
  const profileIdParam = searchParams.get('profile_id');
  const profileGroupIdParam = searchParams.get('profile_group_id');
  const wsIdParam = searchParams.get('ws_id');
  const nameParam = searchParams.get('name');
  const profileParam = searchParams.get('profile');
  const userOwnerParam = searchParams.get('user_owner');
  const startDateParam = searchParams.get('start_date');
  const endDateParam = searchParams.get('end_date');
  const statusParam = searchParams.get('status');
  const deleteParam = searchParams.get('delete_status');
  const defaultPage = searchParams.get('page');
  const defaultRowsPerPage = searchParams.get('row');
  const defaultDense = searchParams.get('dense');
  const [rerender, setRerender] = useState(1);
  const [isPrev] = useState(profile_data.is_prev);
  const [isNext] = useState(profile_data.is_next);
  const isSuperAdmin = user?.role === 'super_admin';
  const isEmployee = user?.role === 'employee';

  const [pageSize, setPageSize] = useState(Number(defaultRowsPerPage) || 10);
  const [pageNum, setPageNum] = useState(Number(defaultPage) || 0);

  const router = useRouter();
  const settings = useSettingsContext();
  const table = useTable({
    defaultDense: defaultDense === 'true',
  });
  const [tableData, setTableData] = useState(profile_data.data);
  const [loading] = useState(false);
  const confirm = useBoolean();
  const restore = useBoolean();
  const transferSingle = useBoolean();
  const transferMulti = useBoolean();
  const [transferId, setTransferId] = useState(null);

  const defaultFilters = useMemo(
    () => ({
      profile_id: profileIdParam || '',
      ws_id: wsIdParam || '',
      name: nameParam || '',
      profile: profileParam || '',
      profile_group_id: profileGroupIdParam || '',
      user_owner: userOwnerParam || '',
      status: statusParam || 'all',
      delete_status: deleteParam || 'undeleted',
      ...{ start_date: startDateParam ? new Date(startDateParam) : null },
      ...{ end_date: endDateParam ? new Date(endDateParam) : null },
    }),
    [
      deleteParam,
      endDateParam,
      nameParam,
      profileGroupIdParam,
      profileIdParam,
      profileParam,
      startDateParam,
      statusParam,
      userOwnerParam,
      wsIdParam,
    ]
  );
  const [filters, setFilters] = useState(defaultFilters);
  const canReset =
    !!filters.profile_id ||
    !!filters.profile_group_id ||
    !!filters.ws_id ||
    filters.name !== '' ||
    filters.profile !== '' ||
    filters.user_owner !== '' ||
    filters.status !== 'all' ||
    filters.delete_status !== 'undeleted' ||
    !!filters.start_date ||
    !!filters.end_date;
  const notFound = !tableData.length && !loading;
  const denseHeight = table.dense ? 52 : 72;

  const handleFilters = useCallback(
    (name, value) => {
      table.setSelected([]);
      setPageNum(0);
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      if (
        name === 'profile_id' ||
        name === 'profile_group_id' ||
        name === 'ws_id' ||
        name === 'name' ||
        name === 'user_owner' ||
        name === 'status' ||
        name === 'delete_status' ||
        name === 'profile'
      ) {
        searchParams.set(name, value);
      } else {
        searchParams.set(name, fDate(value, 'yyyy-MM-dd'));
      }
      searchParams.delete('page');
      router.push(`${paths.dashboard.profile.list}?${searchParams}`);
    },
    [router, searchParams, table]
  );

  const handleResetFilters = useCallback(() => {
    table.setSelected([]);
    setFilters({
      profile_id: '',
      profile_group_id: '',
      ws_id: '',
      name: '',
      profile: '',
      user_owner: '',
      status: 'all',
      delete_status: 'undeleted',
      start_date: null,
      end_date: null,
    });
    router.push(paths.dashboard.profile.list);
  }, [router, table]);

  // api not available
  // useEffect(() => {
  //   const abortController = new AbortController();

  //   const fetchData = async (signal) => {
  //     try {
  //       setLoading(true);
  //       const {
  //         profile_id,
  //         profile_group_id,
  //         ws_id,
  //         name,
  //         profile,
  //         start_date,
  //         end_date,
  //         status,
  //         user_owner,
  //         delete_status,
  //       } = filters;
  //       const fields =
  //         'id,profile_hash,workspace,group_name,deleted_at,name,user_created,user_owner,note,proxy_type,proxy_host,proxy_port,proxy_user,proxy_password,proxy_token,created_at,duration';
  //       const params = {
  //         fields,
  //         profile_id,
  //         profile_group_id,
  //         workspace_id: ws_id,
  //         user_created: name,
  //         name: profile,
  //         user_owner,
  //         status,
  //         delete_status,
  //         start_date: fDate(start_date, 'yyyy-MM-dd'),
  //         end_date: fDate(end_date, 'yyyy-MM-dd'),
  //         page_num: pageNum + 1,
  //         page_size: pageSize,
  //       };

  //       const response = await getListProfileApi(params, signal);

  //       const { data, is_prev, is_next } = response.data;

  //       setIsPrev(is_prev);
  //       setIsNext(is_next);
  //       setTableData(data);
  //     } catch (error) {
  //       console.log(error);
  //       setTableData([]);
  //       setIsPrev(false);
  //       setIsNext(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData(abortController.signal);

  //   return () => {
  //     abortController.abort();
  //   };
  // }, [filters, pageNum, pageSize, rerender]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Card
        sx={{
          mt: 6,
          overflow: 'unset',
        }}
      >
        <ListProfileTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <ListProfileTableFiltersResult
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
            unit="hồ sơ"
            numSelected={table.selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => row.id)
              )
            }
            action={
              <>
                <Tooltip title="Xóa hồ sơ" placement="top">
                  <IconButton
                    color="primary"
                    onClick={confirm.onTrue}
                    sx={{
                      color: 'error.main',
                    }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Khôi phục hồ sơ" placement="top">
                  <IconButton color="primary" onClick={restore.onTrue}>
                    <Iconify icon="material-symbols:restore-page" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Chuyển hồ sơ" placement="top">
                  <IconButton color="primary" onClick={transferMulti.onTrue}>
                    <Iconify icon="tabler:transfer" />
                  </IconButton>
                </Tooltip>
              </>
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
                    tableData.map((row) => row)
                  )
                }
              />

              <TableBody>
                {loading
                  ? [...Array(getNumSkeleton(pageSize, tableData.length))].map((i, index) => (
                      <ListScriptTableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  : tableData.map((row, index) => (
                      <ListProfileTableRow
                        key={row.id}
                        isSuperAdmin={isSuperAdmin}
                        isEmployee={isEmployee}
                        selected={some(table.selected, { id: row.id })}
                        onSelectRow={() => table.onSelectRow(row)}
                        row={row}
                        handleReloadData={() => {
                          setTableData((prev) => prev.filter((item) => item.id !== row.id));
                          table.setSelected((prev) => prev.filter((item) => item !== row.id));
                        }}
                        onTransfer={(id) => {
                          setTransferId(id);
                          transferSingle.onTrue();
                        }}
                      />
                    ))}

                <TableNoData notFound={notFound} colSpan={TABLE_HEAD.length + 1} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationNoTotal
          dense={table.dense}
          onChangeDense={(event) => {
            table.onChangeDense(event);
            searchParams.set('dense', event.target.checked);
            router.push(`${paths.dashboard.profile.list}?${searchParams}`);
          }}
          //
          pageSize={pageSize}
          handleChangeRowPerPage={(page_size) => {
            table.setSelected([]);

            setPageSize(page_size);
            searchParams.set('row', page_size);
            setPageNum(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.profile.list}?${searchParams}`);
          }}
          pageNum={pageNum}
          handleChangePageNum={(page_number) => {
            table.setSelected([]);

            setPageNum(page_number);
            searchParams.set('page', page_number);
            router.push(`${paths.dashboard.profile.list}?${searchParams}`);
          }}
          isPrev={isPrev}
          isNext={isNext}
          isLoading={loading}
          tableDataLength={tableData.length}
        />

        <TransferSingleProfile
          open={transferSingle.value}
          onClose={() => {
            setTransferId(null);
            transferSingle.onFalse();
          }}
          id={transferId}
          handleReloadData={() => {
            setRerender(rerender + 1);
          }}
        />

        <TransferMultiProfile
          profileIds={table.selected
            .filter((item) => item?.deleted_at === null)
            .map((item) => item.id)}
          open={transferMulti.value}
          onClose={transferMulti.onFalse}
          handleReloadData={() => {
            table.setSelected([]);
            setRerender(rerender + 1);
          }}
        />

        <DeleteMultiDialog
          profileIds={table.selected
            .filter((item) => item?.deleted_at === null)
            .map((item) => item.id)}
          open={confirm.value}
          onClose={confirm.onFalse}
          handleReloadData={() => {
            table.setSelected([]);
            setRerender(rerender + 1);
          }}
        />

        <RestoreMultiDialog
          profileIds={table.selected
            .filter((item) => item?.deleted_at !== null)
            .map((item) => item.id)}
          open={restore.value}
          onClose={restore.onFalse}
          handleReloadData={() => {
            table.setSelected([]);
            setRerender(rerender + 1);
          }}
        />
      </Card>
    </Container>
  );
}
