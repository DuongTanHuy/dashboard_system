import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// mui
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Popover,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { RHFSelect, RHFSwitch, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { timezones } from 'src/assets/data';
import { GroupButton } from 'src/components/custom-button';
import { useFormContext } from 'react-hook-form';
import {
  ALLOW_MODE,
  AUDIO_MODES,
  CANVAS_MODES,
  CLIENT_RECTS_MODES,
  CUSTOM_MODE,
  DEVICE_MEMORY,
  DEVICE_NAME_MODES,
  DO_NOT_TRACK_MODES,
  FLASH_MODES,
  FONT_MODES,
  GPU_MODES,
  HARDWARE_CONCURRENCY,
  IMAGE_MODES,
  LOCATION_MODES,
  MAC_ADDRESS_MODES,
  MEDIA_DEVICES_MODES,
  PROXY_CONNECTION_TYPES,
  RESOLUTION_MODES,
  SCAN_PORT_TYPE,
  SCREEN_RESOLUTIONS,
  SPEECH_SWITCH_MODES,
  WEB_GPU_MODES,
  WEBGL_IMG_MODES,
  WEBGL_META_DATA_MODES,
  WEBGL_UNMASKED_VENDORS,
  WEBRTC_MODES,
} from '../../utils/constance';
import { useMultiBoolean } from '../../hooks/use-multiple-boolean';
import FingerprintLanguagesDialog from './fingerprint-languages-dialog';
import { languages } from '../../assets/data/languages';
import { getLanguageLabel } from '../../utils/profile';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'dont_use_proxy',
    label: 'Không sử dụng',
  },
  {
    value: 'common',
    label: 'Common proxy',
  },
  {
    value: 'token',
    label: 'Proxy token',
  },
];

// ----------------------------------------------------------------------

export default function AdvancedSetting({ randomFingerprint }) {
  const { watch, setValue } = useFormContext();
  const [isProxyExpanded, setIsProxyExpanded] = useState(true);
  const [proxyChecking, setProxyChecking] = useState(false);
  const [proxyInfo] = useState({});
  const [currentTab, setCurrentTab] = useState('common');

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const confirm = useMultiBoolean({
    languages: false,
  });

  const watchProxyType = watch('proxy_type');
  const watchProxy = watch('proxy');
  const watchAutomaticTimezone = watch('automaticTimezone');
  const watchLocationSwitch = watch('locationSwitch');
  const watchLanguageSwitch = watch('languageSwitch');
  const watchLanguages = watch('languages');
  const watchResolutionMode = watch('resolutionMode');
  const watchLocation = watch('location');
  const watchFontMode = watch('fontMode');
  const watchWebgl = watch('webgl');
  const watchDeviceNameSwitch = watch('deviceNameSwitch');
  const watchMacSwitch = watch('macSwitch');
  const watchScanPortType = watch('scanPortType');
  const watchProxyToken = watch('proxy_token');

  const handleChangeTab = useCallback(
    (_, newValue) => {
      if (newValue === 'dont_use_proxy') {
        setValue('proxy_type', 'none');
      } else if (newValue === 'token') {
        setValue('proxy_type', 'token');
      } else {
        setValue('proxy_type', 'http');
      }
      setCurrentTab(newValue);
    },
    [setValue]
  );

  const handleProxyTypeChange = (event) => {
    const { value } = event.target;
    setValue('proxy_type', value, { shouldDirty: true });
  };

  const onRandomWebglRender = () => {
    randomFingerprint('webgl');
  };

  const onRandomDeviceName = () => {
    randomFingerprint('device_name');
  };

  const onRandomMacAddress = () => {
    randomFingerprint('mac_address');
  };

  const onRandomFonts = () => {
    randomFingerprint('fonts');
  };

  const handleChangeWebglVendor = (event) => {
    setValue('unmaskedVendor', event.target.value, { shouldDirty: true });
    randomFingerprint('webgl');
  };

  const handleCheckProxy = async (proxyType, proxy) => {
    console.log(proxyType, proxy);

    setProxyChecking(true);
    proxy.mode = proxyType;
    if (proxyType === 'token') {
      proxy.mode = 'token';
      proxy.proxy_token = watchProxyToken;
    }
    setProxyChecking(false);
  };

  const handlePasteProxy = (event) => {
    event.preventDefault();
    const pasteText = event.clipboardData.getData('text').trim();
    const proxy = pasteText.split(':');
    setValue('proxy.host', proxy[0] ?? '', { shouldDirty: true });
    setValue('proxy.port', proxy[1] ?? '', { shouldDirty: true });
    setValue('proxy.username', proxy[2] ?? '', { shouldDirty: true });
    setValue('proxy.password', proxy[3] ?? '', { shouldDirty: true });
  };

  const handleOpenLanguageActions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteLanguage = (language) => {
    const newLanguages = watchLanguages.split(',').filter((item) => item !== language);
    setValue('languages', newLanguages.join(','));
    setAnchorEl(null);
  };

  const renderDialog = (
    <FingerprintLanguagesDialog
      open={confirm.value.languages}
      onClose={() => confirm.onFalse('languages')}
      languages={languages}
    />
  );

  useEffect(() => {
    if (watchProxyType === 'none') {
      setCurrentTab('dont_use_proxy');
    } else if (watchProxyType === 'token') {
      setCurrentTab('token');
    } else {
      setCurrentTab('common');
    }
  }, [watchProxyType]);

  return (
    <>
      <Accordion
        expanded={isProxyExpanded}
        onChange={() => {
          setIsProxyExpanded(!isProxyExpanded);
        }}
      >
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle1">Proxy</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            pt: 0,
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              mb: 3,
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>

          {currentTab === 'dont_use_proxy' && (
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="left"
              sx={{
                width: 1,
                display: 'block',
                mb: 1,
                ml: 1,
              }}
            >
              Không sử dụng proxy cho hồ sơ này
            </Typography>
          )}
          {currentTab === 'token' && (
            <RHFTextField name="proxy_token" label="Proxy token" placeholder="Enter proxy token" />
          )}
          {currentTab === 'common' && (
            <Stack spacing={2}>
              <RHFSelect
                fullWidth
                name="proxy_type"
                label="Loại proxy"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                onChange={handleProxyTypeChange}
              >
                {PROXY_CONNECTION_TYPES.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.value}
                    sx={{
                      ...(option.value === 'none' && {
                        display: 'none',
                      }),
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
              {watchProxyType !== 'none' && (
                <>
                  <Grid container>
                    <Grid item xs={7}>
                      <RHFTextField name="proxy.host" label="Host" onPaste={handlePasteProxy} />
                    </Grid>
                    <Grid item xs={1} display="flex" alignItems="center" justifyContent="center">
                      :
                    </Grid>
                    <Grid item xs={4}>
                      <RHFTextField name="proxy.port" label="Port" />
                    </Grid>
                  </Grid>
                  <RHFTextField name="proxy.username" label="Username" />
                  <RHFTextField name="proxy.password" label="Password" />
                </>
              )}
            </Stack>
          )}
          {currentTab !== 'dont_use_proxy' && (
            <Stack pt={2}>
              <Typography variant="body2" color="#00A76F">
                {Object.entries(proxyInfo)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')}
              </Typography>
              <LoadingButton
                onClick={() => handleCheckProxy(watchProxyType, watchProxy)}
                loading={proxyChecking}
                variant="outlined"
                sx={{
                  ml: 'auto',
                }}
              >
                Kiểm tra
              </LoadingButton>
            </Stack>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle1">Cài đặt nâng cao</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            <SettingTab title="Múi giờ">
              <Stack spacing={2}>
                <RHFSwitch name="automaticTimezone" label="Dựa theo địa chỉ IP" />
                {!watchAutomaticTimezone && (
                  <RHFSelect
                    fullWidth
                    name="timezone"
                    placeholder="Timezone"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                  >
                    {timezones.map((option) => (
                      <MenuItem key={option.id} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
            </SettingTab>
            <SettingTab title="WebRTC">
              <Stack>
                <GroupButton
                  buttons={WEBRTC_MODES}
                  name="webrtc"
                  sx={{
                    mr: 'auto',
                  }}
                />
              </Stack>
            </SettingTab>
            <SettingTab title="Vị trí">
              <Stack spacing={2}>
                <GroupButton
                  buttons={LOCATION_MODES}
                  name="location"
                  sx={{
                    mr: 'auto',
                  }}
                />
                {watchLocation !== 'disabled' && (
                  <>
                    <RHFSwitch name="locationSwitch" label="Dựa theo địa chỉ IP" />
                    {!watchLocationSwitch && (
                      <>
                        <RHFTextField name="longitude" label="Kinh độ" type="number" />
                        <RHFTextField name="latitude" label="Vĩ độ" type="number" />
                        <RHFTextField name="accuracy" label="Độ chính xác (m)" type="number" />
                      </>
                    )}
                  </>
                )}
              </Stack>
            </SettingTab>
            <SettingTab title="Ngôn ngữ">
              <Stack spacing={2}>
                <RHFSwitch name="languageSwitch" label="Dựa theo địa chỉ IP" />
                {!watchLanguageSwitch && (
                  <>
                    {!!watchLanguages &&
                      watchLanguages.split(',').map((language, index) => (
                        <Stack
                          key={index}
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          borderBottom="1px dashed"
                          borderColor={(theme) => alpha(theme.palette.grey[500], 0.32)}
                        >
                          <Typography>{getLanguageLabel(language)}</Typography>
                          {watchLanguages.split(',').length > 1 && (
                            <>
                              <IconButton onClick={handleOpenLanguageActions}>
                                <Iconify icon="ri:more-2-fill" />
                              </IconButton>
                              <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={() => setAnchorEl(null)}
                                anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'left',
                                }}
                              >
                                <MenuItem onClick={() => handleDeleteLanguage(language)}>
                                  <Iconify sx={{ mr: 1 }} icon="fluent:delete-16-regular" />
                                  Xóa
                                </MenuItem>
                              </Popover>
                            </>
                          )}
                        </Stack>
                      ))}
                    <Button
                      sx={{
                        ml: 'auto',
                      }}
                      variant="outlined"
                      onClick={() => confirm.onTrue('languages')}
                    >
                      Thêm
                    </Button>
                  </>
                )}
              </Stack>
            </SettingTab>
            <SettingTab title="Độ phân giải màn hình">
              <Stack spacing={2}>
                <GroupButton
                  buttons={RESOLUTION_MODES}
                  name="resolutionMode"
                  sx={{
                    mr: 'auto',
                  }}
                />

                {watchResolutionMode === 'custom' && (
                  <RHFSelect
                    fullWidth
                    name="screenResolution"
                    placeholder="Resolution"
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                  >
                    <MenuItem key="none" value="none">
                      Mặc định
                    </MenuItem>
                    {SCREEN_RESOLUTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
            </SettingTab>
            <SettingTab title="Phông chữ">
              <Stack spacing={2}>
                <GroupButton
                  buttons={FONT_MODES}
                  name="fontMode"
                  sx={{
                    mr: 'auto',
                  }}
                />
                {watchFontMode === 'custom' && (
                  <>
                    <RHFTextField name="fonts" multiline rows={10} disabled />
                    <Button
                      onClick={onRandomFonts}
                      variant="outlined"
                      startIcon={<Iconify icon="tabler:switch-3" />}
                      sx={{
                        ml: 'auto',
                      }}
                    >
                      Thay đổi
                    </Button>
                  </>
                )}
              </Stack>
            </SettingTab>
            <SettingTab title="Canvas">
              <Stack>
                <GroupButton
                  buttons={CANVAS_MODES}
                  name="canvas"
                  sx={{
                    mr: 'auto',
                  }}
                />
              </Stack>
            </SettingTab>
            <SettingTab title="WebGL Image">
              <Stack>
                <GroupButton
                  buttons={WEBGL_IMG_MODES}
                  name="webglImg"
                  sx={{
                    mr: 'auto',
                  }}
                />
              </Stack>
            </SettingTab>
            <SettingTab title="WebGL metadata">
              <Stack spacing={2}>
                <GroupButton
                  buttons={WEBGL_META_DATA_MODES}
                  name="webgl"
                  sx={{
                    mr: 'auto',
                  }}
                />
                {watchWebgl === CUSTOM_MODE && (
                  <>
                    <RHFSelect
                      fullWidth
                      name="unmaskedVendor"
                      label="Hiển thị nhà cung cấp"
                      InputLabelProps={{ shrink: true }}
                      PaperPropsSx={{ textTransform: 'capitalize' }}
                      onChange={handleChangeWebglVendor}
                    >
                      {WEBGL_UNMASKED_VENDORS.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                    <RHFTextField
                      name="unmaskedRenderer"
                      label="Hiển thị trình kết xuất"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <IconButton onClick={onRandomWebglRender}>
                              <Iconify icon="tabler:switch-3" color="primary.main" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          padding: 0,
                        },
                      }}
                    />
                  </>
                )}
              </Stack>
            </SettingTab>
            <SettingTab title="WebGPU">
              <Stack>
                <GroupButton
                  buttons={WEB_GPU_MODES}
                  name="web_gpu_mode"
                  sx={{
                    mr: 'auto',
                  }}
                />
              </Stack>
            </SettingTab>
            <SettingTab title="Bối cảnh âm thanh">
              <Stack>
                <GroupButton
                  buttons={AUDIO_MODES}
                  name="audio"
                  sx={{
                    mr: 'auto',
                  }}
                />
              </Stack>
            </SettingTab>
            <SettingTab title="Thiết bị truyền thông">
              <Stack>
                <GroupButton
                  buttons={MEDIA_DEVICES_MODES}
                  name="mediaDevices"
                  sx={{
                    mr: 'auto',
                  }}
                />
              </Stack>
            </SettingTab>
            <SettingTab title="ClientRects">
              <Stack>
                <GroupButton
                  buttons={CLIENT_RECTS_MODES}
                  name="clientRects"
                  sx={{
                    mr: 'auto',
                  }}
                />
              </Stack>
            </SettingTab>
            <SettingTab title="SpeechVoices">
              <Stack>
                <GroupButton
                  buttons={SPEECH_SWITCH_MODES}
                  name="speechSwitch"
                  sx={{
                    mr: 'auto',
                  }}
                />
              </Stack>
            </SettingTab>
            <SettingTab title="Hardware concurrency">
              <Stack>
                <RHFSelect
                  fullWidth
                  name="hardwareConcurrency"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {HARDWARE_CONCURRENCY.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
            </SettingTab>
            <SettingTab title="Bộ nhớ thiết bị">
              <Stack spacing={2}>
                <RHFSelect
                  fullWidth
                  name="deviceMemory"
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {DEVICE_MEMORY.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Stack>
            </SettingTab>
            <SettingTab title="Tên thiết bị">
              <Stack spacing={2}>
                <GroupButton
                  buttons={DEVICE_NAME_MODES}
                  name="deviceNameSwitch"
                  sx={{
                    mr: 'auto',
                  }}
                />
                {watchDeviceNameSwitch === CUSTOM_MODE && (
                  <RHFTextField
                    name="deviceName"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <IconButton onClick={onRandomDeviceName}>
                            <Iconify icon="tabler:switch-3" color="primary.main" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        padding: 0,
                      },
                    }}
                  />
                )}
              </Stack>
            </SettingTab>
            <SettingTab title="Địa chỉ MAC">
              <Stack spacing={2}>
                <GroupButton
                  buttons={MAC_ADDRESS_MODES}
                  name="macSwitch"
                  sx={{
                    mr: 'auto',
                  }}
                />
                {watchMacSwitch === CUSTOM_MODE && (
                  <RHFTextField
                    name="macAddress"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <IconButton onClick={onRandomMacAddress}>
                            <Iconify icon="tabler:switch-3" color="primary.main" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        padding: 0,
                      },
                    }}
                  />
                )}
              </Stack>
            </SettingTab>
            <SettingTab title="Không theo dõi">
              <Stack>
                <GroupButton
                  buttons={DO_NOT_TRACK_MODES}
                  name="doNotTrack"
                  sx={{
                    mr: 'auto',
                  }}
                />
              </Stack>
            </SettingTab>
            <SettingTab title="Flash">
              <Stack>
                <GroupButton
                  buttons={FLASH_MODES}
                  name="flash"
                  sx={{
                    mr: 'auto',
                  }}
                />
              </Stack>
            </SettingTab>
            <SettingTab title="Port scan protection">
              <Stack spacing={2}>
                <GroupButton
                  buttons={SCAN_PORT_TYPE}
                  name="scanPortType"
                  sx={{
                    mr: 'auto',
                  }}
                />
                {watchScanPortType === ALLOW_MODE && (
                  <RHFTextField
                    name="allowScanPorts"
                    size="small"
                    sx={{
                      mr: 'auto',
                    }}
                    placeholder="Tùy chọn, cho phép các cổng được quét"
                  />
                )}
              </Stack>
            </SettingTab>
            <SettingTab title="Tăng tốc phần cứng">
              <Stack>
                <GroupButton
                  buttons={GPU_MODES}
                  name="gpu"
                  sx={{
                    mr: 'auto',
                  }}
                />
              </Stack>
            </SettingTab>
            <SettingTab title="Hiển thị hình ảnh">
              <Stack>
                <GroupButton
                  buttons={IMAGE_MODES}
                  name="images"
                  sx={{
                    mr: 'auto',
                  }}
                />
              </Stack>
            </SettingTab>
          </Stack>
        </AccordionDetails>
      </Accordion>
      {renderDialog}
    </>
  );
}

AdvancedSetting.propTypes = {
  randomFingerprint: PropTypes.func,
};

//----------------------------------------------------------------
function SettingTab({ title, children }) {
  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={4}
        textAlign="center"
        style={{
          paddingTop: '30px',
        }}
      >
        {title}
      </Grid>
      <Grid item xs={8}>
        {children}
      </Grid>
    </Grid>
  );
}

SettingTab.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};
