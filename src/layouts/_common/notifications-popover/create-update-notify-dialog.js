import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ERROR_CODE } from 'src/utils/constance';
import { enqueueSnackbar } from 'notistack';
import Editor from 'src/components/editor/editor';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  createSystemNotifyApi,
  getSystemNotifyDetailApi,
  updateSystemNotifyApi,
} from 'src/api/system-notify.api';
import { fDate } from 'src/utils/format-time';
import { useBoolean } from 'src/hooks/use-boolean';
import { Upload } from 'src/components/upload';
import SystemNotifyPreviewDialog from './system-notify-preview-dialog';

export default function CreateUpdateNotifyDialog({ open, onClose, reloadData, notifyId }) {
  const preview = useBoolean();
  const [title, setTitle] = useState('');
  const [notifyType, setNotifyType] = useState('text');
  const [content, setContent] = useState('');
  const [notifyImage, setNotifyImage] = useState(null);
  const [link, setLink] = useState('');
  const [linkType, setLinkType] = useState('outside');
  const [dateExpired, setDateExpired] = useState(null);
  const [errorValidate, setErrorValidate] = useState({
    title: '',
    content: '',
    dateExpired: '',
    notifyImage: '',
    link: '',
  });
  const [errorMsg, setErrorMsh] = useState('');
  const [loading, setLoading] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let continueSubmit = true;

      if (notifyType === 'image') {
        if (!notifyImage) {
          setErrorValidate((prev) => ({ ...prev, notifyImage: 'Vui lòng chọn hình ảnh!' }));
          continueSubmit = false;
        }

        if (!link) {
          setErrorValidate((prev) => ({ ...prev, link: 'Vui lòng nhập đường dẫn!' }));
          continueSubmit = false;
        }
      } else {
        if (!title) {
          setErrorValidate((prev) => ({ ...prev, title: 'Vui lòng nhập tiêu đề!' }));
          continueSubmit = false;
        }
        if (!content) {
          setErrorValidate((prev) => ({ ...prev, content: 'Vui lòng nhập nội dung!' }));
          continueSubmit = false;
        }
        if (!!dateExpired && new Date(dateExpired) < new Date()) {
          setErrorValidate((prev) => ({ ...prev, dateExpired: 'Ngày hết hạn không hợp lệ!' }));
          continueSubmit = false;
        }
      }

      if (!continueSubmit) {
        return;
      }

      let payload;

      if (notifyType === 'image') {
        payload = new FormData();
        payload.append('type', notifyType);
        payload.append('title', title);
        payload.append('date_expired', fDate(dateExpired, 'yyyy-MM-dd'));
        if (typeof notifyImage === 'object') {
          payload.append('noti_image', notifyImage);
        }
        payload.append('link', link);
        payload.append('link_type', linkType);
      } else {
        payload = {
          title,
          content,
          type: notifyType,
          ...(dateExpired && { date_expired: fDate(dateExpired, 'yyyy-MM-dd') }),
        };
      }

      if (notifyId) {
        await updateSystemNotifyApi(notifyId, payload);
      } else {
        await createSystemNotifyApi(payload);
      }
      reloadData();
      enqueueSnackbar(notifyId ? 'Cập nhật thông báo thành công!' : 'Tạo thông báo thành công!', {
        variant: 'success',
      });
      handleClose();
    } catch (error) {
      console.log(error);
      if (error?.error_code === ERROR_CODE.NOT_PERMISSION) {
        handleClose();
        enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
      } else {
        setErrorMsh(notifyId ? 'Cập nhật thông báo thất bại!' : 'Tạo thông báo thất bại!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = useCallback((acceptedFiles) => {
    setErrorValidate((prev) => ({ ...prev, notifyImage: '' }));
    const file = acceptedFiles[0];

    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    if (file) {
      setNotifyImage(newFile);
    }
  }, []);

  const handleClose = () => {
    setErrorValidate({});
    setErrorMsh('');
    setTitle('');
    setContent('');
    setDateExpired(null);
    setNotifyImage(null);
    setLink('');
    setNotifyType('text');
    setNotifyType('text');
    onClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (notifyId) {
          const response = await getSystemNotifyDetailApi(notifyId);
          if (response?.data) {
            setTitle(response?.data?.title);
            setContent(response?.data?.content);
            setNotifyType(response?.data?.type);
            setNotifyImage(response?.data?.image_url);
            setLink(response?.data?.link);
            setLinkType(response?.data?.link_type);
            setDateExpired(
              !response?.data?.date_expired
                ? response?.data?.date_expired
                : new Date(response?.data?.date_expired)
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [notifyId, open]);

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open}>
        <DialogTitle
          variant="h6"
          sx={{
            pb: 0,
          }}
        >
          {notifyId ? 'Cập nhật thông báo' : 'Tạo thông báo'}
        </DialogTitle>
        <DialogContent
          sx={{
            pt: '16px!important',
          }}
        >
          {!!errorMsg && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
              }}
            >
              {errorMsg}
            </Alert>
          )}
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Tiêu đề"
              placeholder="Nhập tiêu đề thông báo"
              error={!!errorValidate.title}
              helperText={errorValidate.title}
              value={title}
              onChange={(event) => {
                if (errorMsg) {
                  setErrorMsh('');
                }
                if (errorValidate) {
                  setErrorValidate((prev) => ({ ...prev, title: '' }));
                }
                setTitle(event.target.value);
              }}
            />

            <DatePicker
              open={openPicker}
              onClose={() => setOpenPicker(false)}
              label="Ngày hết hạn"
              value={dateExpired}
              onChange={(newValue) => {
                if (errorMsg) {
                  setErrorMsh('');
                }
                if (errorValidate) {
                  setErrorValidate((prev) => ({ ...prev, dateExpired: '' }));
                }
                setDateExpired(newValue);
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: 'Ngày/Tháng/Năm',
                  onClick: () => setOpenPicker(true),
                  error: !!errorValidate.dateExpired,
                  helperText: errorValidate.dateExpired,
                },
              }}
              sx={{
                width: 'fit-content',
                '& svg': {
                  zIndex: 1,
                },
              }}
            />

            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Loại thông báo</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
                row
                value={notifyType}
                onChange={(event) => {
                  setNotifyType(event.target.value);
                }}
              >
                <FormControlLabel
                  value="text"
                  control={<Radio />}
                  label="Thông báo chữ"
                  sx={{
                    '&:not(:last-of-type)': {
                      mr: 4,
                    },
                  }}
                />
                <FormControlLabel value="image" control={<Radio />} label="Thông báo hình ảnh" />
              </RadioGroup>
            </FormControl>

            {notifyType === 'image' ? (
              <>
                <Upload
                  file={notifyImage}
                  error={!!errorValidate.notifyImage}
                  helperText={
                    !!errorValidate.notifyImage && (
                      <FormHelperText error={!!errorValidate.notifyImage} sx={{ px: 2 }}>
                        {errorValidate.notifyImage}
                      </FormHelperText>
                    )
                  }
                  name="banner_image"
                  maxSize={3145728}
                  accept={{ 'image/*': [] }}
                  onDrop={handleDrop}
                  onDelete={() => setNotifyImage(null)}
                  sx={{
                    '& .MuiStack-root > svg.MuiBox-root': {
                      height: 80,
                    },
                    '&.MuiBox-root > .MuiBox-root': {
                      height: 180,
                      p: 2,
                    },
                    '& .MuiStack-root': {
                      rowGap: 1,
                    },
                    '& img': {
                      objectFit: 'contain',
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Đường dẫn"
                  placeholder="Nhập đường dẫn"
                  error={!!errorValidate.link}
                  helperText={errorValidate.link}
                  value={link}
                  onChange={(event) => {
                    if (errorMsg) {
                      setErrorMsh('');
                    }
                    if (errorValidate) {
                      setErrorValidate((prev) => ({ ...prev, link: '' }));
                    }
                    setLink(event.target.value);
                  }}
                />
                <FormControl>
                  <FormLabel id="radio-buttons-group-label">Loại đường dẫn</FormLabel>
                  <RadioGroup
                    aria-labelledby="radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    row
                    value={linkType}
                    onChange={(event) => {
                      setLinkType(event.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="inside"
                      control={<Radio />}
                      label="Mở trên ứng dụng"
                      sx={{
                        '&:not(:last-of-type)': {
                          mr: 4,
                        },
                      }}
                    />
                    <FormControlLabel
                      value="outside"
                      control={<Radio />}
                      label="Mở trên trình duyệt"
                    />
                  </RadioGroup>
                </FormControl>
              </>
            ) : (
              <Stack>
                <Editor
                  id="content"
                  value={content}
                  onChange={(value) => {
                    if (errorMsg) {
                      setErrorMsh('');
                    }
                    if (errorValidate) {
                      setErrorValidate((prev) => ({ ...prev, content: '' }));
                    }
                    setContent(value);
                  }}
                  error={!!errorValidate.content}
                  // helperText={errorValidate.content}
                  helperText={
                    <FormHelperText error={!!errorValidate.content} sx={{ px: 2 }}>
                      {errorValidate.content ? errorValidate.content : ''}
                    </FormHelperText>
                  }
                  placeholder="Nhập nội dung thông báo"
                />
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <Stack direction="row" spacing={2} justifyContent="flex-end" py={3} pr={3}>
          <Button variant="outlined" onClick={handleClose}>
            Đóng
          </Button>
          <Button
            variant="contained"
            onClick={preview.onTrue}
            disabled={notifyType === 'image' && !notifyImage}
          >
            Xem trước
          </Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            {notifyId ? 'Cập nhật' : 'Tạo'}
          </LoadingButton>
        </Stack>
      </Dialog>
      <SystemNotifyPreviewDialog
        open={preview.value}
        onClose={preview.onFalse}
        title={title}
        content={content}
        notifyType={notifyType}
        notifyImage={notifyImage}
      />
    </>
  );
}

CreateUpdateNotifyDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  reloadData: PropTypes.func,
  notifyId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
