import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'src/routes/hooks';
import {
  getAudioContextLabel,
  getBrowserKernelLabel,
  getCanvasLabel,
  getClientRectsLabel,
  getDeviceNameLabel,
  getDoNotTrackLabel,
  getFlashLabel,
  getGpuModeLabel,
  getImagesLabel,
  getLocationDescription,
  getMacAddressLabel,
  getMediaDevicesLabel,
  getPortScanProtectionLabel,
  getScreenResolutionLabel,
  getSpeechVoiceLabel,
  getTimezoneLabel,
  getWebGPUData,
  getWebGpuLabel,
  getWebgMetadatalLabel,
  getWebglImageLabel,
  getWebrtcLabel,
  isValidBase64,
  randomHardwareConcurrency,
} from 'src/utils/profile';
import {
  ANDROID_VERSION,
  ERROR_CODE,
  HARDWARE_CONCURRENCY,
  IOS_VERSION,
  LINUX_VERSION,
  MACOS_VERSION,
  OS_DEFAULT,
  OS_VERSION_DEFAULT,
  WEBGL_UNMASKED_VENDORS,
  WINDOW_VERSION,
} from 'src/utils/constance';
import { fonts } from 'src/assets/data';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { BrowserButton } from 'src/components/custom-button';
import Iconify from 'src/components/iconify';
import { groupBy } from 'lodash';
import { getListKernelVersionApi } from 'src/api/kernel.api';
import { updateProfileApi } from 'src/api/profile.api';
import AdvancedSetting from '../advanced-setting';

export default function EditProfileView({ currentProfile }) {
  const settings = useSettingsContext();
  const router = useRouter();
  const FormSchema = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập tên hồ sơ'),
    agentDes: Yup.string().required('Vui lòng nhập mô tả agent'),
    kernelVersionId: Yup.string().required('Vui lòng chọn phiên bản Browser'),
    proxy_type: Yup.string().required('Vui lòng nhập loại proxy'),
    proxy: Yup.object().when('proxy_type', {
      is: (val) => val !== 'none' && val !== 'token',
      then: (schema) =>
        schema.shape({
          host: Yup.string().required('Vui lòng nhập host'),
          port: Yup.string().required('Vui lòng nhập port'),
        }),
    }),
    proxy_token: Yup.string()
      .nullable()
      .when('proxy_type', {
        is: 'token',
        then: (schema) =>
          schema
            .required('Vui lòng nhập token')
            .test('is-base64', 'Token không đúng định dạng', (value) =>
              value ? isValidBase64(value) : true
            ),
        otherwise: (schema) => schema.nullable(true),
      }),
  });

  const [chromeOptions, setChromeOption] = useState([]);
  const [firefoxOptions, setFirefoxOptions] = useState([]);
  const [userAgentOptions] = useState([]);
  const [browserActive, setBrowserActive] = useState();
  const [platformActive, setPlatformActive] = useState();
  const randomUserAgent = useRef();
  const randomFingerPrint = useRef();
  const [userInitiatedChange, setUserInitiatedChange] = useState(false);

  const defaultValues = useMemo(
    () => ({
      name: currentProfile?.name || '',

      kernelVersionId: currentProfile?.kernel_version_id || 0,
      osVersion: {
        os: currentProfile?.os?.os || OS_DEFAULT,
        version: currentProfile?.os?.os_version[0]?.toString() || OS_VERSION_DEFAULT,
      },
      groupName: '',
      agent: currentProfile?.os?.browser_version[0]?.toString() || 'all',
      agentDes: currentProfile?.user_agent || '',
      open_tabs: currentProfile?.open_tabs || '[]',
      cookies: currentProfile?.cookies || '',
      note: currentProfile?.note || '',
      proxy_token: currentProfile?.proxy_token || '',
      proxy_type:
        currentProfile?.proxy_type !== 'token' ? currentProfile?.proxy_type || 'none' : 'token',
      proxy: {
        host: currentProfile?.proxy_host || '',
        port: currentProfile?.proxy_port || '',
        username: currentProfile?.proxy_user || '',
        password: currentProfile?.proxy_password || '',
      },
      productType: currentProfile?.profile_preference?.product_type || '',
      platform: currentProfile?.profile_preference?.platform || '',
      _platform: currentProfile?.profile_preference?._platform || '',
      automaticTimezone:
        !currentProfile?.profile_preference?.automatic_timezone ||
        currentProfile?.profile_preference?.automatic_timezone === '1',
      timezone: currentProfile?.profile_preference?.time_zone || '',
      webrtc: currentProfile?.profile_preference?.webrtc || 'replace',
      location: currentProfile?.profile_preference?.location || 'ask',
      locationSwitch:
        !currentProfile?.profile_preference?.location_switch ||
        currentProfile?.profile_preference?.location_switch === '1',
      longitude: currentProfile?.profile_preference?.longitude || 0,
      latitude: currentProfile?.profile_preference?.latitude || 0,
      accuracy: currentProfile?.profile_preference?.accuracy || 1000,
      languageSwitch:
        !currentProfile?.profile_preference?.language_switch ||
        currentProfile?.profile_preference?.language_switch === '1',
      languages: currentProfile?.profile_preference?.languages || 'en-US,en',
      resolutionMode: currentProfile?.profile_preference?.screen_resolution_mode || 'custom',
      screenResolution: currentProfile?.profile_preference?.screen_resolution || 'none',
      fontMode: currentProfile?.profile_preference?.font_mode || 'custom',
      disabledFonts: currentProfile?.profile_preference?.disabled_fonts || [],
      fonts: fonts.filter(
        (font) => !(currentProfile?.profile_preference?.disabled_fonts || []).includes(font)
      ),
      canvas: currentProfile?.profile_preference?.canvas || '1',
      webglImg: currentProfile?.profile_preference?.webgl_image || '1',
      webgl: currentProfile?.profile_preference?.webgl || '1',
      audio: currentProfile?.profile_preference?.audio || '1',
      mediaDevices: currentProfile?.profile_preference?.media_devices || '1',
      clientRects: currentProfile?.profile_preference?.client_rects || '1',
      speechSwitch: currentProfile?.profile_preference?.speech_switch || '1',
      unmaskedVendor: currentProfile?.profile_preference?.webgl_config?.unmasked_vendor || '',
      unmaskedRenderer: currentProfile?.profile_preference?.webgl_config?.unmasked_renderer || '',
      hardwareConcurrency:
        currentProfile?.profile_preference?.hardware_concurrency ||
        randomHardwareConcurrency(HARDWARE_CONCURRENCY.slice(1)),
      deviceMemory: currentProfile?.profile_preference?.device_memory || '8',
      deviceNameSwitch: currentProfile?.profile_preference?.device_name_switch || '1',
      deviceName: currentProfile?.profile_preference?.device_name || '',
      macSwitch: currentProfile?.profile_preference?.mac_address_config?.model || '1',
      macAddress: currentProfile?.profile_preference?.mac_address_config?.address || '',
      doNotTrack: currentProfile?.profile_preference?.do_not_track || 'default',
      web_gpu_mode: currentProfile?.profile_preference?.web_gpu_mode || '1',
      flash: currentProfile?.profile_preference?.flash || 'block',
      scanPortType: currentProfile?.profile_preference?.scan_port_type || '1',
      allowScanPorts: currentProfile?.profile_preference?.allow_scan_ports || '',
      gpu: currentProfile?.profile_preference?.gpu || '0',
      images: currentProfile?.profile_preference?.images || '1',
      emulation: currentProfile?.profile_preference?.emulation || '',
    }),
    [currentProfile]
  );

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const watchOsVersion = watch('osVersion');
  const watchAutomaticTimezone = watch('automaticTimezone');
  const watchLocation = watch('location');
  const watchLocationSwitch = watch('locationSwitch');
  const watchLanguageSwitch = watch('languageSwitch');
  const watchLanguages = watch('languages');
  const watchKernelVersionId = watch('kernelVersionId');
  const watchAgent = watch('agent');
  const watchAgentDes = watch('agentDes');
  const watchTimezoneDes = watch('timezone');
  const watchWebrtc = watch('webrtc');
  const watchLongitude = watch('longitude');
  const watchLatitude = watch('latitude');
  const watchAccuracy = watch('accuracy');
  const watchFont = watch('fonts');
  const watchCanvas = watch('canvas');
  const watchWebglImg = watch('webglImg');
  const watchWebgl = watch('webgl');
  const watchAudio = watch('audio');
  const watchMediaDevices = watch('mediaDevices');
  const watchClientRects = watch('clientRects');
  const watchDoNotTrack = watch('doNotTrack');
  const watchFlash = watch('flash');
  const watchSpeechSwitch = watch('speechSwitch');
  const watchUnmaskedRenderer = watch('unmaskedRenderer');
  const watchResolutionMode = watch('resolutionMode');
  const watchScreenResolution = watch('screenResolution');
  const watchHardwareConcurrency = watch('hardwareConcurrency');
  const watchDeviceMemory = watch('deviceMemory');
  const watchScanPortType = watch('scanPortType');
  const watchMacAddress = watch('macAddress');
  const watchAllowScanPorts = watch('allowScanPorts');
  const watchGpu = watch('gpu');
  const watchDeviceName = watch('deviceName');
  const watchMacSwitch = watch('macSwitch');
  const watchDeviceNameSwitch = watch('deviceNameSwitch');
  const watchImages = watch('images');
  const watchWebGpu = watch('web_gpu_mode');

  const OVERVIEW_INFO = [
    {
      id: 'in_01',
      title: 'Browser Kernel',
      des: `${browserActive}Browser [${browserActive} ${getBrowserKernelLabel(
        watchKernelVersionId,
        [...chromeOptions, ...firefoxOptions]
      )}]`,
    },
    { id: 'in_02', title: 'User-Agent', des: watchAgentDes },
    {
      id: 'in_03',
      title: 'Múi giờ',
      des: getTimezoneLabel(watchAutomaticTimezone, watchTimezoneDes),
    },
    { id: 'in_04', title: 'WebRTC', des: getWebrtcLabel(watchWebrtc) },
    {
      id: 'in_05',
      title: 'Vị trí',
      des: getLocationDescription(
        watchLocation,
        watchLocationSwitch,
        watchLongitude,
        watchLatitude,
        watchAccuracy
      ),
    },
    {
      id: 'in_06',
      title: 'Ngôn ngữ',
      des: watchLanguageSwitch ? 'Dựa theo địa chỉ IP' : watchLanguages,
    },
    {
      id: 'in_07',
      title: 'Độ phân giải màn hình',
      des: getScreenResolutionLabel(watchResolutionMode, watchScreenResolution),
    },
    { id: 'in_08', title: 'Phông chữ', des: watchFont?.length },
    {
      id: 'in_09',
      title: 'Canvas',
      des: getCanvasLabel(watchCanvas),
    },
    {
      id: 'in_10',
      title: 'WebGL Image',
      des: getWebglImageLabel(watchWebglImg),
    },
    {
      id: 'in_11',
      title: 'WebGL metadata',
      des: getWebgMetadatalLabel(watchWebgl, watchUnmaskedRenderer),
    },
    {
      id: 'in_12',
      title: 'WebGPU',
      des: getWebGpuLabel(watchWebGpu),
    },
    {
      id: 'in_13',
      title: 'Bối cảnh âm thanh',
      des: getAudioContextLabel(watchAudio),
    },
    {
      id: 'in_14',
      title: 'Thiết bị truyền thông',
      des: getMediaDevicesLabel(watchMediaDevices),
    },
    {
      id: 'in_15',
      title: 'ClientRects',
      des: getClientRectsLabel(watchClientRects),
    },
    {
      id: 'in_16',
      title: 'SpeechVoice',
      des: getSpeechVoiceLabel(watchSpeechSwitch),
    },
    { id: 'in_17', title: 'Hardware concurrency', des: watchHardwareConcurrency },
    { id: 'in_18', title: 'Bộ nhớ thiết bị', des: watchDeviceMemory },
    {
      id: 'in_19',
      title: 'Tên thiết bị',
      des: getDeviceNameLabel(watchDeviceNameSwitch, watchDeviceName),
    },
    {
      id: 'in_20',
      title: 'Địa chỉ MAC',
      des: getMacAddressLabel(watchMacSwitch, watchMacAddress),
    },
    {
      id: 'in_21',
      title: 'Không theo dõi',
      des: getDoNotTrackLabel(watchDoNotTrack),
    },
    {
      id: 'in_22',
      title: 'Flash',
      des: getFlashLabel(watchFlash),
    },
    {
      id: 'in_23',
      title: 'Port scan protection',
      des: getPortScanProtectionLabel(watchScanPortType, watchAllowScanPorts),
    },
    {
      id: 'in_24',
      title: 'Tăng tốc phần cứng',
      des: getGpuModeLabel(watchGpu),
    },
    {
      id: 'in_25',
      title: 'Hiển thị hình ảnh',
      des: getImagesLabel(watchImages),
    },
  ];

  const handleBrowserKernelChange = (preValue, value) => {
    setUserInitiatedChange(true);
    if (preValue !== value) {
      setPlatformActive(OS_DEFAULT);

      if (value === 'Chrome') {
        setValue('osVersion', { os: OS_DEFAULT, version: OS_VERSION_DEFAULT });
      }
    }
  };

  const handleOSVersionChange = () => {
    setUserInitiatedChange(true);
  };

  const getProxyFields = useCallback((data) => {
    if (data.proxy_type === 'token') {
      return {
        proxy_token: data.proxy_token,
        proxy_host: '',
        proxy_port: '',
        proxy_user: '',
        proxy_password: '',
      };
    }

    if (data.proxy_type === 'none') {
      return {
        proxy_type: '',
        proxy_host: '',
        proxy_port: '',
        proxy_user: '',
        proxy_password: '',
        proxy_token: '',
      };
    }

    return {
      proxy_host: data.proxy.host,
      proxy_port: data.proxy.port,
      proxy_user: data.proxy.username,
      proxy_password: data.proxy.password,
      proxy_token: '',
    };
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        name: data.name,
        note: data.note,
        cookies: data.cookies,
        open_tabs: data.open_tabs,
        proxy_type: data.proxy_type,
        ...getProxyFields(data),
        kernel_version_id: data.kernelVersionId,
        user_agent: data.agentDes,
        fingerprint_config: {
          dpr: 2,
          automatic_timezone: data.automaticTimezone ? '1' : '0',
          time_zone: data.timezone,
          languages: data.languages,
          language_switch: data.languageSwitch ? '1' : '0',
          flash: data.flash,
          scan_port_type: data.scanPortType,
          allow_scan_ports: data.allowScanPorts,
          location: data.location,
          location_switch: data.locationSwitch ? '1' : '0',
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy,
          device_name_switch: data.deviceNameSwitch,
          device_name: data.deviceName,
          product_type: data.productType,
          speech_switch: data.speechSwitch,
          screen_resolution: data.screenResolution,
          screen_resolution_mode: data.resolutionMode,
          mac_address_config: {
            model: data.macSwitch,
            address: data.macAddress,
          },
          font_mode: data.fontMode,
          disabled_fonts: data.disabledFonts,
          media_devices: data.mediaDevices,
          canvas: data.canvas,
          client_rects: data.clientRects,
          webgl: data.webgl,
          webgl_config: {
            unmasked_vendor: data.unmaskedVendor,
            unmasked_renderer: data.unmaskedRenderer,
          },
          webgl_image: data.webglImg,
          web_gpu_mode: data.web_gpu_mode,
          audio: data.audio,
          webrtc: data.webrtc,
          do_not_track: data.doNotTrack,
          hardware_concurrency: data.hardwareConcurrency,
          device_memory: data.deviceMemory,
          gpu: data.gpu,
          platform: data.platform,
          _platform: data._platform,
          system_version: data.osVersion.version,
          images: data.images,
          automation_controlled: '',
          emulation: data.emulation,
        },
      };

      // cập nhật trạng thái disable || real sang match_webgl
      if (data.web_gpu_mode === '1' && currentProfile.profile_preference?.web_gpu_mode !== '1') {
        const webgpu = getWebGPUData(data.unmaskedVendor);
        payload.fingerprint_config.webgpu = webgpu;
      }
      await updateProfileApi(currentProfile.id, payload);
      enqueueSnackbar('Cập nhật hồ sơ thành công!', { variant: 'success' });

      router.back();
    } catch (error) {
      console.error(error);
      if (error?.http_code === ERROR_CODE.NOT_PERMISSION) {
        enqueueSnackbar('Bạn không có quyền thực hiện hành động này!', { variant: 'error' });
      } else if (error?.error_fields) {
        const error_fields = error?.error_fields;
        const keys = Object.keys(error_fields);
        enqueueSnackbar(error_fields[keys[0]][0], { variant: 'error' });
      } else enqueueSnackbar(error?.message || 'Cập nhật hồ sơ thất bại!', { variant: 'error' });
    }
  });

  randomUserAgent.current = async () => {
    try {
      const osVersion = getValues('osVersion');
      let system = osVersion?.os;
      let system_version = osVersion?.version;

      if (browserActive === 'Firefox') {
        system = platformActive;
        system_version = '';
      }

      if (system && browserActive) {
        const payload = {
          system,
          system_version,
          browser: browserActive.toLowerCase(),
          browser_version: watchAgent === 'all' ? '' : watchAgent,
        };
        console.log(payload);
        // const response = await randomUserAgentApi(payload);
        // if (response.data) {
        //   setValue('agentDes', response.data.user_agent);
        // }
      }
    } catch (error) {
      console.log(error);
    }
  };

  randomFingerPrint.current = async (
    fingerprint_list = 'webgl,device_name,product_type,fonts,mac_address,platform,_platform,emulator'
  ) => {
    try {
      const userAgentStr = getValues('agentDes');
      const unmasked_vendor = getValues('unmaskedVendor');
      const system =
        WEBGL_UNMASKED_VENDORS.find((item) => item.value === unmasked_vendor)?.system ??
        getValues('osVersion.os');
      const payload = {
        useragent: userAgentStr,
        fingerprint_list,
        webgl_config: { system, unmasked_vendor },
      };

      console.log(payload);

      // const response = await randomFingerPrintApi(payload);
      // const data = response.data?.data;

      // const {
      //   disabled_fonts,
      //   webgl,
      //   device_name,
      //   mac_address,
      //   product_type,
      //   platform,
      //   _platform,
      //   emulator,
      // } = data;

      // if (disabled_fonts) {
      //   const fontFiltered = fonts.filter((font) => !disabled_fonts.includes(font));
      //   setValue('fonts', fontFiltered);
      //   setValue('disabledFonts', disabled_fonts);
      // }

      // if (webgl) {
      //   setValue('unmaskedVendor', webgl.unmasked_vendor);
      //   setValue('unmaskedRenderer', webgl.unmasked_renderer);
      // }

      // if (device_name) setValue('deviceName', device_name);
      // if (mac_address) setValue('macAddress', mac_address);
      // if (platform) setValue('platform', platform);
      // if (_platform) setValue('_platform', _platform);
      // if (product_type) setValue('productType', product_type);
      // if (emulator) setValue('emulation', emulator);
    } catch (error) {
      console.log(error);
    }
  };

  const renderForm = (
    <Stack spacing={3}>
      <RHFTextField name="name" label="Tên hồ sơ" />
      <Block label="Browser Kernel">
        <Stack direction="row" spacing={2}>
          <BrowserButton
            name="kernelVersionId"
            type="browser"
            title={{ label: 'ChromeBrowser', value: 'Chrome' }}
            icon="teenyicons:chrome-solid"
            active={browserActive}
            setActive={setBrowserActive}
            setPlatformActive={setPlatformActive}
            options={chromeOptions}
            onChange={handleBrowserKernelChange}
          />
          <BrowserButton
            name="kernelVersionId"
            type="browser"
            title={{ label: 'FirefoxBrowser', value: 'Firefox' }}
            icon="devicon-plain:firefox"
            active={browserActive}
            setActive={setBrowserActive}
            setPlatformActive={setPlatformActive}
            options={firefoxOptions}
            onChange={handleBrowserKernelChange}
          />
        </Stack>
      </Block>
      <Block label="Hệ điều hành">
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <BrowserButton
              name="osVersion"
              type="platform"
              title={{ label: 'Windows', value: 'windows' }}
              icon="ph:windows-logo-fill"
              active={platformActive}
              setActive={setPlatformActive}
              options={browserActive === 'Chrome' ? WINDOW_VERSION : []}
              onChange={handleOSVersionChange}
            />
          </Grid>
          <Grid item xs={4}>
            <BrowserButton
              name="osVersion"
              type="platform"
              title={{ label: 'macOS', value: 'mac_os' }}
              icon="ph:apple-logo-fill"
              active={platformActive}
              setActive={setPlatformActive}
              options={browserActive === 'Chrome' ? MACOS_VERSION : []}
              onChange={handleOSVersionChange}
            />
          </Grid>
          {browserActive === 'Chrome' && (
            <>
              <Grid item xs={4}>
                <BrowserButton
                  name="osVersion"
                  type="platform"
                  title={{ label: 'Linux', value: 'linux' }}
                  icon="uiw:linux"
                  active={platformActive}
                  setActive={setPlatformActive}
                  options={LINUX_VERSION}
                  onChange={handleOSVersionChange}
                />
              </Grid>
              <Grid item xs={4}>
                <BrowserButton
                  name="osVersion"
                  type="platform"
                  title={{ label: 'Android', value: 'android' }}
                  icon="uil:android"
                  active={platformActive}
                  setActive={setPlatformActive}
                  options={ANDROID_VERSION}
                  onChange={handleOSVersionChange}
                />
              </Grid>
              <Grid item xs={4}>
                <BrowserButton
                  name="osVersion"
                  type="platform"
                  title={{ label: 'IOS', value: 'ios' }}
                  icon="mdi:apple-ios"
                  active={platformActive}
                  setActive={setPlatformActive}
                  options={IOS_VERSION}
                  onChange={handleOSVersionChange}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Block>
      <Grid container spacing={2}>
        <Grid
          item
          xs={4}
          sx={{
            '& .MuiFormControl-root': {
              width: 1,
            },
          }}
        >
          <RHFSelect
            fullWidth
            name="agent"
            label="User Agent"
            InputLabelProps={{ shrink: true }}
            PaperPropsSx={{ textTransform: 'capitalize' }}
            SelectProps={{
              MenuProps: {
                autoFocus: false,
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    '&::-webkit-scrollbar': {
                      width: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: (theme) => theme.palette.grey[500],
                      borderRadius: '4px',
                    },
                  },
                },
              },
            }}
          >
            <MenuItem key="all" value="all" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
              Tất cả
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {userAgentOptions.map((item) => (
              <MenuItem key={item} value={item}>
                {`UA ${item}`}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item xs={8}>
          <RHFTextField
            name="agentDes"
            readOnly
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={randomUserAgent.current}>
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
        </Grid>
      </Grid>
      <RHFTextField
        name="cookies"
        label="Cookies"
        placeholder="Cookie hỗ trợ định dạng JSON/Netscape/Name=Value"
        multiline
        rows={4}
      />
      <RHFTextField
        name="note"
        label="Ghi chú"
        placeholder="Vui lòng nhập ghi chú"
        multiline
        rows={4}
      />
      <AdvancedSetting randomFingerprint={randomFingerPrint.current} />
    </Stack>
  );

  const renderOverview = (
    <Card
      sx={{
        position: 'sticky',
        top: 0,
        width: 1,
        height: `calc(100vh - ${settings.themeLayout === 'horizontal' ? 184 : 144}px)`,
        display: 'none',
      }}
    >
      <CardHeader
        title="Tổng quan"
        sx={{
          position: 'sticky',
          top: 0,
          '&.MuiCardHeader-root': {
            bgcolor: '#212B36',
            ...(settings.themeMode === 'light' && {
              bgcolor: '#fff',
            }),
          },
          pb: 2,
        }}
        action={
          <Button
            variant="outlined"
            onClick={() => {
              randomUserAgent.current();
            }}
            startIcon={<Iconify icon="tabler:switch-3" />}
          >
            Dấu vân tay mới
          </Button>
        }
      />
      <Scrollbar
        autoHide={false}
        sx={{
          height: 'calc(100% - 68px)',
        }}
      >
        <CardContent
          sx={{
            '&.MuiCardContent-root': {
              pb: 2,
            },
            pt: 1,
          }}
        >
          <Stack spacing={1}>
            {OVERVIEW_INFO?.map((item) => (
              <OverviewItem key={item.id} title={item.title} des={item.des} />
            ))}
          </Stack>
        </CardContent>
      </Scrollbar>
    </Card>
  );

  useEffect(() => {
    const browserType = currentProfile?.kernel_version?.type;
    const browserMap = {
      cbrowser: 'Chrome',
      fbrowser: 'Firefox',
    };
    const os = currentProfile?.os?.os;
    if (browserType && os) {
      setBrowserActive(browserMap[browserType]);
      setPlatformActive(os);
    }
  }, [currentProfile]);

  useEffect(() => {
    async function fetchUserAgentData() {
      try {
        const osVersion = getValues('osVersion');
        const param = {
          system: osVersion?.os,
          system_version: osVersion?.version,
        };

        console.log(param);
        // const response = await getBrowserVersionsApi(param);
        // if (response.data && response.data.data) {
        //   const useragentOptions = response.data.data
        //     .map((item) => item.major_version)
        //     .filter((version, index, self) => self.indexOf(version) === index)
        //     .sort((a, b) => b - a);

        //   setUserAgentOptions(useragentOptions);
        // }
      } catch (error) {
        console.error('Error fetching user agent data:', error);
      }
    }

    fetchUserAgentData();
  }, [platformActive, setValue, getValues]);

  useEffect(() => {
    async function fetchBrowserData() {
      try {
        const response = await getListKernelVersionApi();
        if (response.data) {
          const { data } = response;
          const grouped = groupBy(data, 'type');
          const chromeKernels = grouped.cbrowser || [];
          const firefoxKernels = grouped.fbrowser || [];
          setChromeOption([...chromeKernels].sort((a, b) => b.id - a.id));
          setFirefoxOptions([...firefoxKernels].sort((a, b) => b.id - a.id));
          const latestChromeKernel = chromeKernels.find((item) => item.is_last);
          if (latestChromeKernel === false) {
            const { id } = latestChromeKernel;
            setValue('kernelVersionId', id);
          }
        }
      } catch (error) {
        console.error('Error fetching kernel versions:', error);
      }
    }

    fetchBrowserData();
  }, [setValue, currentProfile]);

  useEffect(() => {
    const firstError = Object.values(errors)?.[0];
    if (firstError?.message) {
      enqueueSnackbar(firstError.message, { variant: 'error' });
    } else if (typeof firstError === 'object') {
      const childrenError = Object.values(firstError)?.[0];
      if (childrenError?.message) {
        enqueueSnackbar(childrenError.message, { variant: 'error' });
      }
    }
  }, [errors]);

  useEffect(() => {
    /*
      - in update mode, only rerun random useragent when the user changes the user agent parameters.
      - in the case where the user agent parameters are changed due to the setting of profile data into the form,
      the random useragent will not be rerun.
    */
    if (userInitiatedChange) {
      randomUserAgent.current();
    }
  }, [
    browserActive,
    platformActive,
    watchAgent,
    watchOsVersion?.os,
    watchOsVersion?.version,
    userInitiatedChange,
  ]);

  useEffect(() => {
    if (userInitiatedChange) {
      randomFingerPrint.current();
    }
  }, [userInitiatedChange, watchAgentDes]);

  useEffect(() => {
    if (currentProfile?.id) {
      reset(defaultValues);
    }
  }, [currentProfile?.id, defaultValues, reset]);

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        height: `calc(100vh - ${settings.themeLayout === 'horizontal' ? 168 : 128}px)`,
        pb: 1,
        position: 'relative',
        '&.MuiContainer-root': {
          px: 2,
        },
      }}
    >
      <Scrollbar
        sx={{
          height: 1,
          px: 2,
          pb: 1,
          '& .simplebar-track.simplebar-vertical': {
            position: 'absolute',
            right: 0,
            pointerEvents: 'auto',
          },
        }}
      >
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Grid container>
            <Grid item xs={0} sm={1} md={2} />
            <Grid
              item
              xs={12}
              sm={10}
              md={8}
              sx={{
                pt: 0.5,
              }}
            >
              {renderForm}
              <Stack
                direction="row"
                spacing={3}
                sx={{
                  position: 'fixed',
                  bottom: 8,
                  zIndex: 10,
                }}
              >
                <LoadingButton
                  color="primary"
                  size="medium"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Cập nhật
                </LoadingButton>
                <Button variant="outlined" onClick={() => router.back()}>
                  Trở về
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={0} sm={1} md={2} />
            <Grid item xs={0}>
              {renderOverview}
            </Grid>
          </Grid>
        </FormProvider>
      </Scrollbar>
    </Container>
  );
}

EditProfileView.propTypes = {
  currentProfile: PropTypes.object,
};

//----------------------------------------------------------------
function Block({ label, sx, children }) {
  return (
    <Stack spacing={1} sx={{ width: 1, ...sx }}>
      <Typography variant="body2">{label}</Typography>
      {children}
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};

//----------------------------------------------------------------
function OverviewItem({ title, des }) {
  return (
    <Stack direction="row" spacing={6}>
      <Typography
        variant="subtitle2"
        sx={{
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        ml="auto"
        sx={{
          textAlign: 'right',
        }}
      >
        {des}
      </Typography>
    </Stack>
  );
}

OverviewItem.propTypes = {
  title: PropTypes.string,
  des: PropTypes.any,
};
