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
import { useTable, TableNoData, TableHeadCustom, TableSelectedAction } from 'src/components/table';
// api
// hooks
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { getNumSkeleton } from 'src/utils/format-number';
import TablePaginationNoTotal from 'src/components/table/table-pagination-no-total';
import { fDate } from 'src/utils/format-time';
import { getListDeviceApi } from 'src/api/device.api';
import { IconButton, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import DeviceTableRow from './device-table-row';
import DeviceTableToolbar from './device-table-toolbar';
import DeviceTableFiltersResult from './device-table-filters-result';
import DeviceTableSkeleton from './device-table-skeleton';
import LogoutMultiDeviceDialog from './logout-multi-device-dialog';
import DataExtraDialog from './data-extra-dialog';

// ----------------------------------------------------------------------

export default function DeviceManagementView() {
  const confirm = useBoolean();
  const openExtraData = useBoolean();
  const [extraData, setExtraData] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const ipParam = searchParams.get('ip');
  const nameParam = searchParams.get('username');
  const hostnameParam = searchParams.get('hostname');
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
    { id: 'id', label: 'ID', align: 'center', minWidth: 60, width: 60 },
    { id: 'username', label: 'Tài khoản đăng nhập' },
    { id: 'hostname', label: 'Tên thiết bị', align: 'center' },
    { id: 'ip', label: 'IP', align: 'center', minWidth: 150 },
    { id: 'device_hash', label: 'Mã thiết bị', align: 'center' },
    { id: 'useragent', label: 'User agent', minWidth: 300 },
    { id: 'os', label: 'Hệ điều hành', align: 'center' },
    { id: 'location', label: 'Nơi đăng nhập', align: 'center' },
    { id: 'login_last_at', label: 'Lần đăng nhập trước', align: 'center' },
    { id: 'logout_at', label: 'Lần đăng xuất trước', align: 'center' },
    { id: 'created_at', label: 'Thời gian đăng nhập' },
    { id: 'extra_info', label: 'Extra info' },
  ];

  const defaultFilters = useMemo(
    () => ({
      ip: ipParam || '',
      username: nameParam || '',
      hostname: hostnameParam || '',
      ...{ start_date: startDateParam ? new Date(startDateParam) : null },
      ...{ end_date: endDateParam ? new Date(endDateParam) : null },
    }),
    [endDateParam, hostnameParam, ipParam, nameParam, startDateParam]
  );

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(defaultFilters);

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.ip ||
    !!filters.username ||
    !!filters.hostname ||
    !!filters.os ||
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
      router.push(`${paths.dashboard.device_management.root}?${searchParams}`);
    },
    [router, searchParams]
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      username: '',
      hostname: '',
      ip: '',
      start_date: null,
      end_date: null,
    });
    router.push(paths.dashboard.device_management.root);
  }, [router]);

  const handleFetchData = useCallback(
    async (signal) => {
      setLoading(true);
      table.setSelected([]);
      const { username, hostname, ip, start_date, end_date } = filters;
      const params = {
        username,
        hostname,
        ip,
        start_date: fDate(start_date, 'yyyy-MM-dd'),
        end_date: fDate(end_date, 'yyyy-MM-dd'),
        page_size: pageSize,
        page_num: pageNum + 1,
      };

      try {
        const response = await getListDeviceApi(params, signal);
        const { data, is_prev, is_next } = response.data;
        setIsPrev(is_prev);
        setIsNext(is_next);
        setTableData(data);

        table.setSelected(table.selected.filter((id) => data.map((row) => row.id).includes(id)));
      } catch (error) {
        console.log(error);
        setTableData([]);
        setIsPrev(false);
        setIsNext(false);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <DeviceTableToolbar filters={filters} onFilters={handleFilters} />

        {canReset && (
          <DeviceTableFiltersResult
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
            unit="thiết bị"
            numSelected={table.selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData.map((row) => row.id)
              )
            }
            action={
              <Tooltip title="Đăng xuất" placement="top">
                <IconButton
                  color="primary"
                  onClick={confirm.onTrue}
                  sx={{
                    color: 'error.main',
                  }}
                >
                  <Iconify icon="material-symbols:logout-rounded" />
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
                  ? [...Array(getNumSkeleton(pageSize, tableData.length))].map((i, index) => (
                      <DeviceTableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  : tableData.map((row, index) => (
                      <DeviceTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row?.id)}
                        onExtraData={() => {
                          setExtraData(row.extra_info);
                          openExtraData.onTrue();
                        }}
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
            router.push(`${paths.dashboard.device_management.root}?${searchParams}`);
          }}
          //
          pageSize={pageSize}
          handleChangeRowPerPage={(page_size) => {
            setPageSize(page_size);
            searchParams.set('row', page_size);
            setPageNum(0);
            searchParams.set('page', 0);
            router.push(`${paths.dashboard.device_management.root}?${searchParams}`);
          }}
          pageNum={pageNum}
          handleChangePageNum={(page_number) => {
            setPageNum(page_number);
            searchParams.set('page', page_number);
            router.push(`${paths.dashboard.device_management.root}?${searchParams}`);
          }}
          isPrev={isPrev}
          isNext={isNext}
          isLoading={loading}
          tableDataLength={tableData.length}
        />
      </Card>
      <LogoutMultiDeviceDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        deviceIds={table.selected}
        handleReloadData={() => {
          table.setSelected([]);
        }}
      />
      <DataExtraDialog
        open={openExtraData.value}
        onClose={openExtraData.onFalse}
        extraData={extraData}
      />
    </Container>
  );
}
