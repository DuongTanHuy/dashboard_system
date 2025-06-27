import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { cloneDeep } from 'lodash';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const styleOptions = {
  border: '1px solid #eeeeee24',
  padding: '8px',
  borderRadius: '4px',
  gap: 0,
};

export default function AddHotlineDialog({ onClose, hotlines, open, handleSubmit, ...other }) {
  const [listHotline, setListHotline] = useState([]);

  useEffect(() => {
    if (hotlines.length > 0) {
      setListHotline(hotlines);
    }
  }, [hotlines, open]);

  const submitForm = async () => {
    if (listHotline?.length > 0) {
      const filteredData = listHotline.filter((item) => item.name !== '' && item.phone !== '');

      handleSubmit(filteredData);
    }
    onClose();
  };

  const addNewHotline = () => {
    const _clone = cloneDeep(listHotline);
    _clone.push({
      name: '',
      phone: '',
    });

    setListHotline(_clone);
  };

  const updateHotline = (name, event, index) => {
    const _clone = cloneDeep(listHotline);
    _clone[index][name] = event.target.value;
    setListHotline(_clone);
  };

  const deleteHotline = (id) => {
    const _find = listHotline.findIndex((i) => i.id === id);
    const _clone = cloneDeep(listHotline);
    _clone.splice(_find, 1);
    setListHotline(_clone);
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} {...other}>
      <DialogTitle sx={{ paddingBottom: '10px' }}>Thêm đường dây nóng</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={2} width={1}>
          <Stack sx={styleOptions} spacing={1} width={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">Đường dây nóng</Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<Iconify icon="solar:add-circle-linear" width={20} />}
                onClick={() => addNewHotline()}
              >
                Thêm
              </Button>
            </Stack>
            <Stack spacing={1} pt={listHotline?.length > 0 ? 2 : 0} pb={1} width={1}>
              {listHotline &&
                listHotline.map((item, index) => (
                  <Stack
                    gap={2}
                    key={index}
                    direction="row"
                    alignItems="center"
                    width={1}
                    spacing={2}
                  >
                    <TextField
                      error={false}
                      label="Tên"
                      onChange={(e) => updateHotline('name', e, index)}
                      size="small"
                      name="name"
                      value={item.name}
                      sx={{ width: 0.4 }}
                    />
                    <TextField
                      error={false}
                      label="Số điện thoại"
                      onChange={(e) => updateHotline('phone', e, index)}
                      size="small"
                      name="phone"
                      value={item.phone}
                      sx={{ width: 0.6 }}
                    />

                    <Iconify
                      onClick={() => deleteHotline(item.id)}
                      icon="carbon:close-outline"
                      sx={{
                        width: '35px',
                        mr: 1,
                        color: 'text.disabled',
                        '&:hover': { cursor: 'pointer', color: 'text.primary' },
                      }}
                    />
                  </Stack>
                ))}
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={onCancel}>
          Hủy
        </Button>
        <LoadingButton type="submit" variant="contained" color="primary" onClick={submitForm}>
          Xác nhận
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

AddHotlineDialog.propTypes = {
  onClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  hotlines: PropTypes.array,
  open: PropTypes.bool,
};
