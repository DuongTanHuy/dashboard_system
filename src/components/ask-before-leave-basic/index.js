import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialogBasic({ isOpen, onAction }) {
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Bạn có chắc chắn?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Các thay đổi chưa được lưu
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onAction('yes')} color="primary">
          Rời khỏi
        </Button>
        <Button onClick={() => onAction('back')} color="primary" autoFocus>
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AlertDialogBasic.propTypes = {
  isOpen: PropTypes.bool,
  onAction: PropTypes.func,
};
