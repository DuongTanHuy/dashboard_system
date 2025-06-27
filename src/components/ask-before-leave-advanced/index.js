import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';
import { useBlocker, useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({ isBlocking, isSaving, onSave }) {
  function useCallbackPrompt(when) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPrompt, setShowPrompt] = useState(false);
    const [lastLocation, setLastLocation] = useState(null);
    const [confirmedNavigation, setConfirmedNavigation] = useState(false);

    const cancelNavigation = useCallback(() => {
      setShowPrompt(false);
    }, []);

    const handleBlockedNavigation = useCallback(
      (nextLocation) => {
        if (!confirmedNavigation && nextLocation.location.pathname !== location.pathname && when) {
          console.log('set true ======> ', when);
          setShowPrompt(true);
          setLastLocation(nextLocation);
          return false;
        }
        return true;
      },
      [confirmedNavigation, location.pathname, when]
    );

    const confirmNavigation = useCallback(() => {
      setShowPrompt(false);
      setConfirmedNavigation(true);
    }, []);

    useEffect(() => {
      if (confirmedNavigation && lastLocation) {
        navigate(lastLocation.location.pathname);
      }
    }, [confirmedNavigation, lastLocation, navigate]);

    useBlocker(handleBlockedNavigation, when);

    return [showPrompt, confirmNavigation, cancelNavigation];
  }

  const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(isBlocking);
  return (
    <Dialog
      open={showPrompt}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="alert-dialog-title">Bạn có chắc chắn?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Các thay đổi chưa được lưu
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={confirmNavigation} color="primary">
          Rời khỏi
        </Button>
        <Button onClick={cancelNavigation} color="primary" autoFocus>
          Ở lại
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AlertDialog.propTypes = {
  // isBlocking, isSaving, onSave

  isBlocking: PropTypes.bool,
  isSaving: PropTypes.bool,
  onSave: PropTypes.func,
};
