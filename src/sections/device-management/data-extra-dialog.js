import PropTypes from 'prop-types';
import { Box, Dialog, alpha } from '@mui/material';
import React from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';

import { Editor } from '@monaco-editor/react';

export default function DataExtraDialog({ open, onClose, extraData }) {
  const settings = useSettingsContext();

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 1,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          boxShadow: (theme) => theme.customShadows.z8,
          height: '80vh',
          overflow: 'hidden',
        }}
      >
        <Editor
          language="json"
          theme={`vs-${settings.themeMode}`}
          value={JSON.stringify(extraData, null, 2)}
          options={{
            readOnly: true,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
          }}
          loading={<LoadingScreen />}
        />
      </Box>
    </Dialog>
  );
}

DataExtraDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  extraData: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
