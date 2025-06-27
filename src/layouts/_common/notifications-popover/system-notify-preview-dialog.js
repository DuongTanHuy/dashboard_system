import React from 'react';
import PropTypes from 'prop-types';

import {
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import Editor from 'src/components/editor/editor';
import Image from 'src/components/image';

export default function SystemNotifyPreviewDialog({
  open,
  onClose,
  title,
  content,
  notifyType,
  notifyImage,
}) {
  const theme = useTheme();
  const matches = useMediaQuery('(min-width:740px)');

  const handleClose = async () => {
    onClose(false);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root.MuiPaper-elevation': {
          boxShadow: theme.customShadows.z4,
        },
      }}
    >
      {notifyType === 'image' ? (
        <Image
          alt={title}
          src={notifyImage?.preview}
          sx={{
            // minHeight: '200px',
            height: 1,
            width: 1,
            borderRadius: 1,
            '& img': {
              objectFit: 'contain',
            },
          }}
        />
      ) : (
        <DialogContent
          sx={{
            height: '540px',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundImage: `url("/assets/background/notification/${theme.palette.primary.main
              .replace('#', '')
              .toLowerCase()}.png")`,
            position: 'relative',
            p: 0,
          }}
        >
          <Stack
            zIndex={1}
            color="black"
            alignItems="center"
            sx={{
              position: 'absolute',
              top: 180,
              left: matches ? 140 : 20,
              right: matches ? 140 : 20,
              bottom: 136,
              textAlign: 'justify',
            }}
          >
            <Typography variant="h3" color="primary" textAlign="center">
              {title}
            </Typography>
            <Editor
              sx={{
                backgroundColor: 'transparent',
                '& .ql-editor': {
                  p: 0,
                  backgroundColor: 'transparent',
                  maxHeight: 'fit-content',
                },
                width: 1,
                border: 'none',
                height: 'calc(100% - 44px)',
                overflow: 'auto',
              }}
              id="simple-editor"
              value={content}
              placeholder="Nội dung thông báo..."
              readOnly
            />
          </Stack>
        </DialogContent>
      )}
      <IconButton
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          boxShadow: theme.customShadows.z8,
          p: 0,
        }}
        onClick={handleClose}
      >
        <Iconify
          icon="carbon:close-filled"
          color={notifyType === 'image' ? 'gray' : 'white'}
          width={30}
        />
      </IconButton>
    </Dialog>
  );
}

SystemNotifyPreviewDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  content: PropTypes.string,
  notifyType: PropTypes.string,
  notifyImage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
