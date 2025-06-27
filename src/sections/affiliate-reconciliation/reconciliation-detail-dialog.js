import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
// mui
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  tableCellClasses,
} from '@mui/material';
// components
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData, TableSkeleton, useTable } from 'src/components/table';
import Iconify from 'src/components/iconify';
import { format } from 'date-fns';
import { fCurrencyVND } from 'src/utils/format-number';
import Label from 'src/components/label';
import { getReconciliationDetailApi } from 'src/api/affiliate.api';

export default function ReconciliationDetailDialog({ open, onClose, reconciliationId }) {
  const table = useTable();
  const [code, setCode] = useState('');
  const [totalCommission, setTotalCommission] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const notFound = !tableData.length;

  const TABLE_HEAD = useMemo(
    () => [
      { id: 'id', label: 'STT', align: 'center' },
      { id: 'name', label: 'Người giao dịch' },
      { id: 'amount', label: 'Số tiền giao dịch', align: 'center' },
      { id: 'created_at', label: 'Ngày giao dịch', align: 'center' },
      { id: 'status', label: 'Trạng thái', align: 'center' },
      { id: 'commission_percent', label: 'Phần trăm hoa hồng', align: 'center' },
      { id: 'commission', label: 'Hoa hồng', align: 'center' },
    ],
    []
  );

  const handleClose = () => {
    onClose();
    table.setSelected([]);
  };

  const handleFetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getReconciliationDetailApi(reconciliationId);

      if (response?.data) {
        setTableData(response.data.commissions);
        setCode(response.data.code);
        setTotalCommission(
          response.data.commissions.reduce(
            (total, commission) =>
              total + (commission.transaction_history.amount * commission.commission_percent) / 100,
            0
          )
        );
      }
    } catch (error) {
      console.log(error);
      setTableData([]);
      setCode('');
    } finally {
      setLoading(false);
    }
  }, [reconciliationId]);

  useEffect(() => {
    if (reconciliationId) {
      handleFetchData();
    }
  }, [handleFetchData, reconciliationId]);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root.MuiPaper-elevation': {
          boxShadow: (theme) => theme.customShadows.z4,
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" marginRight="auto">
            {`Đối soát #${code}`}
          </Typography>
          <IconButton onClick={handleClose}>
            <Iconify icon="ic:round-close" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ typography: 'body2' }}>
        <TableContainer
          sx={{
            overflow: 'unset',
            position: 'relative',
            height: 1,
          }}
        >
          <Scrollbar
            autoHide={false}
            sxRoot={{
              overflow: 'unset',
            }}
            sx={{
              maxHeight: 500,
              '& .simplebar-track.simplebar-vertical': {
                position: 'absolute',
                right: '-16px',
                pointerEvents: 'auto',
              },
            }}
          >
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 400, width: 1 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                sx={{
                  [`& .${tableCellClasses.head}`]: {
                    '&:first-of-type': {
                      borderTopLeftRadius: 12,
                      borderBottomLeftRadius: 12,
                    },
                    '&:last-of-type': {
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                    },
                  },
                }}
              />

              <TableBody>
                {loading
                  ? [...Array(table.rowsPerPage)].map((i, index) => (
                      <TableSkeleton
                        key={index}
                        cols={TABLE_HEAD.length}
                        sx={{ height: 70 }}
                        hasAction={false}
                      />
                    ))
                  : tableData.map((row, index) => (
                      <TableRow hover key={row?.id}>
                        <TableCell align="center">{row?.id}</TableCell>

                        <TableCell>
                          <ListItemText
                            primary={row?.user?.username}
                            secondary={row?.user?.email}
                            primaryTypographyProps={{ typography: 'subtitle2', noWrap: true }}
                            secondaryTypographyProps={{
                              mt: 0.5,
                              component: 'span',
                              typography: 'caption',
                            }}
                          />
                        </TableCell>

                        <TableCell align="center">
                          {fCurrencyVND(row?.transaction_history?.amount)}
                        </TableCell>

                        <TableCell align="center">
                          {format(new Date(row?.created_at), 'dd/MM/yyyy')}
                        </TableCell>

                        <TableCell align="center">
                          <Label
                            variant="soft"
                            color={
                              (row?.payment_status === 'pending' && 'warning') ||
                              (row?.payment_status === 'paid' && 'success') ||
                              'info'
                            }
                          >
                            {(row?.payment_status === 'pending' && 'Chờ thanh toán') ||
                              (row?.payment_status === 'paid' && 'Đã thanh toán') ||
                              'Chưa thanh toán'}
                          </Label>
                        </TableCell>

                        <TableCell align="center">{`${row?.commission_percent}%`}</TableCell>

                        <TableCell align="center">
                          {fCurrencyVND(
                            (row.transaction_history.amount * row.commission_percent) / 100
                          )}
                        </TableCell>
                      </TableRow>
                    ))}

                <TableNoData
                  sx={{
                    py: 2,
                  }}
                  notFound={notFound}
                />
              </TableBody>
            </Table>
          </Scrollbar>
          <Typography
            textAlign="right"
            color="text.secondary"
            sx={{
              py: 3,
              pr: 2,
            }}
          >
            {`Tổng hoa hồng: `}
            <Typography component="span" color="primary.main" variant="h6">
              {fCurrencyVND(totalCommission)}
            </Typography>
          </Typography>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}

ReconciliationDetailDialog.propTypes = {
  open: PropTypes.bool,
  reconciliationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func,
};
