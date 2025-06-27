import PropTypes from 'prop-types';
import { Box, Dialog, alpha } from '@mui/material';
import React from 'react';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
import { getDataExtraUserActivityApi } from 'src/api/user-activity.api';
import { Editor } from '@monaco-editor/react';

export default function DataExtraDialog({ open, onClose, dataExtraId }) {
  const settings = useSettingsContext();
  const [extraData, setExtraData] = React.useState({});

  React.useEffect(() => {
    const handleFetchData = async () => {
      try {
        const response = await getDataExtraUserActivityApi(dataExtraId);
        setExtraData(response.data.extra_data);
      } catch (error) {
        console.log(error);
        setExtraData({});
      }
    };

    if (open) {
      handleFetchData();
    }
  }, [dataExtraId, open]);

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
  dataExtraId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
