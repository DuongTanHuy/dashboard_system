import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
// utils
import { fToNow } from 'src/utils/format-time';
import Editor from 'src/components/editor/editor';
import Image from 'src/components/image';

// ----------------------------------------------------------------------

export default function NotificationItem({ notification, onDelete, onUpdate }) {
  const renderAvatar = (
    <ListItemAvatar>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'background.neutral',
          p: 1,
        }}
      >
        <Box
          component="img"
          src={`/assets/icons/notification/${
            !notification.date_expired || new Date(notification.date_expired) > new Date()
              ? 'ic_valid'
              : 'ic_expired'
          }.svg`}
          sx={{ width: 1, height: 1 }}
        />
      </Stack>
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={notification.title}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          divider={
            <Box
              sx={{
                width: 2,
                height: 2,
                bgcolor: 'currentColor',
                mx: 0.5,
                borderRadius: '50%',
              }}
            />
          }
        >
          {fToNow(notification.date_expired)}
          {!notification.date_expired || new Date(notification.date_expired) > new Date()
            ? 'Còn hạn'
            : 'Đã hết hạn'}
        </Stack>
      }
    />
  );

  const renderContent = (
    <Stack alignItems="flex-start">
      <Box
        sx={{
          p: 1.5,
          my: 1.5,
          borderRadius: 1.5,
          color: 'text.secondary',
          bgcolor: 'background.neutral',
        }}
      >
        {notification.type !== 'text' ? (
          <Image
            alt={notification?.title}
            src={notification?.image_url}
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
          <Editor
            sx={{
              backgroundColor: 'transparent',
              '& .ql-editor': {
                p: 0,
                backgroundColor: 'transparent',
                minHeight: 'fit-content',
              },
              border: 'none',
              maxHeight: 100,
              overflow: 'auto',
            }}
            id="simple-editor"
            value={notification?.content}
            placeholder="Nội dung thông báo..."
            readOnly
          />
        )}
      </Box>

      <Stack spacing={1} direction="row">
        <Button size="small" variant="contained" onClick={() => onUpdate(notification.id)}>
          Cập nhật
        </Button>
        <Button size="small" variant="outlined" onClick={() => onDelete(notification.id)}>
          Xóa
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <ListItemButton
      disableRipple
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
      }}
    >
      {renderAvatar}

      <Stack sx={{ flexGrow: 1 }}>
        {renderText}
        {renderContent}
      </Stack>
    </ListItemButton>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.object,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
};

// ----------------------------------------------------------------------

// function reader(data) {
//   return (
//     <Box
//       dangerouslySetInnerHTML={{ __html: data }}
//       sx={{
//         mb: 0.5,
//         '& p': { typography: 'body2', m: 0 },
//         '& a': { color: 'inherit', textDecoration: 'none' },
//         '& strong': { typography: 'subtitle2' },
//       }}
//     />
//   );
// }
