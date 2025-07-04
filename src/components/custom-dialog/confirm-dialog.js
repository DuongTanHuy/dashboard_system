import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

export default function ConfirmDialog({
  title,
  content,
  action,
  open,
  onClose,
  type = 'delete',
  ...other
}) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

      <DialogActions>
        {type === 'delete' && action}

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Đóng
        </Button>

        {type !== 'delete' && action}
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  action: PropTypes.node,
  content: PropTypes.node,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  type: PropTypes.string,
};
