import { languages } from '../assets/data';
import {
  ANDROID_VERSION,
  IOS_VERSION,
  LINUX_VERSION,
  LOCATION_MODES,
  MACOS_VERSION,
  WEBRTC_MODES,
  WEB_GPU_DATA,
  WINDOW_VERSION,
} from './constance';
import { randomItem } from './random';

export function getWebrtcLabel(value, options = WEBRTC_MODES) {
  return options.find((item) => item.value === value)?.label;
}

export function getBrowserKernelLabel(value, browserKernels) {
  return browserKernels.find((item) => item.id === value)?.kernel || '';
}

export function getLocationModelLabel(value, options = LOCATION_MODES) {
  return options.find((item) => item.value === value)?.label;
}

export function getLocationCustomLabel(longitude, latitude, accuracy) {
  let label = ' ';

  if (longitude) {
    label += `longtitude : ${longitude}`;
  }

  if (latitude) {
    label += ` latitude : ${latitude}`;
  }

  if (accuracy) {
    label += ` accuracy : ${accuracy}`;
  }

  return label;
}

export function getLocationDescription(
  value,
  locationSwitch,
  longitude,
  latitude,
  accuracy,
  valueLocation = 'Kết hợp dựa trên IP',
  valueDisabled = '[Vô hiệu hóa]',
  options
) {
  let mode = '';
  let locationInfo = '';
  if (value === 'allow' || value === 'ask') {
    mode = `[${getLocationModelLabel(value, options)}]`;
    if (locationSwitch) {
      locationInfo = valueLocation;
    } else {
      locationInfo = getLocationCustomLabel(longitude, latitude, accuracy);
    }
  } else {
    mode = valueDisabled;
  }
  return `${mode} ${locationInfo}`;
}

export function getScreenResolutionLabel(
  value,
  screenResolution,
  valueRandom = 'Ngẫu nhiên',
  valueDefault = 'Mặc định'
) {
  switch (value) {
    case 'random':
      return valueRandom;
    case 'custom':
      return screenResolution === 'none' ? valueDefault : screenResolution;
    default:
      return '';
  }
}

export function randomHardwareConcurrency(options) {
  let result;

  do {
    result = randomItem(options);
  } while (parseInt(result, 10) < 8);

  return result;
}

export function getDoNotTrackLabel(
  value,
  defaultLabel = 'Mặc định',
  openLabel = 'Mở',
  closeLabel = 'Đóng'
) {
  switch (value) {
    case 'default':
      return defaultLabel;
    case '1':
      return openLabel;
    case '0':
      return closeLabel;
    default:
      return 'undefined';
  }
}

export function getGpuModeLabel(
  value,
  defaultLabel = 'Mặc định',
  openLabel = 'Mở',
  closeLabel = 'Đóng'
) {
  switch (value) {
    case '0':
      return defaultLabel;
    case '1':
      return openLabel;
    case '2':
      return closeLabel;
    default:
      return 'undefined';
  }
}

export function getMacAddressLabel(mode, macAddress, closeLabel = 'Đóng') {
  if (mode === '0') return closeLabel;
  return macAddress;
}

export function getDeviceNameLabel(mode, deviceName, closeLabel = 'Đóng') {
  if (mode === '0') return closeLabel;
  return deviceName;
}

export function getPortScanProtectionLabel(
  mode,
  allowPortScan,
  allowLabel = 'Cho phép',
  closeLabel = 'Đóng'
) {
  if (mode === '0') return closeLabel;
  return `[${allowLabel}] ${allowPortScan}`;
}

export function getFlashLabel(value, allowLabel = 'Cho phép', blockLabel = 'Đóng') {
  switch (value) {
    case 'allow':
      return allowLabel;
    case 'block':
      return blockLabel;
    default:
      return 'undefined';
  }
}

export function getSpeechVoiceLabel(value, noiseLabel = 'Noise', closeLabel = 'Đóng') {
  switch (value) {
    case '1':
      return noiseLabel;
    case '0':
      return closeLabel;
    default:
      return 'undefined';
  }
}

export function getClientRectsLabel(value, noiseLabel = 'Noise', closeLabel = 'Đóng') {
  switch (value) {
    case '1':
      return noiseLabel;
    case '0':
      return closeLabel;
    default:
      return 'undefined';
  }
}

export function getMediaDevicesLabel(value, noiseLabel = 'Noise', closeLabel = 'Đóng') {
  switch (value) {
    case '1':
      return noiseLabel;
    case '0':
      return closeLabel;
    default:
      return 'undefined';
  }
}

export function getAudioContextLabel(value, noiseLabel = 'Noise', closeLabel = 'Đóng') {
  switch (value) {
    case '1':
      return noiseLabel;
    case '0':
      return closeLabel;
    default:
      return 'undefined';
  }
}

export function getWebgMetadatalLabel(mode, render, closeLabel = 'Đóng') {
  if (mode === '0') return closeLabel;
  return render;
}

export function getWebGpuLabel(
  mode,
  matchLabel = 'Match WebGL',
  realLabel = 'Real',
  disableLabel = 'Disable'
) {
  if (mode === '1') return matchLabel;
  if (mode === '2') return realLabel;
  return disableLabel;
}

export function getWebglImageLabel(value, noiseLabel = 'Noise', closeLabel = 'Đóng') {
  switch (value) {
    case '1':
      return noiseLabel;
    case '0':
      return closeLabel;
    default:
      return 'undefined';
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getWebGPUData(webgl_vendor) {
  let vendor;
  switch (webgl_vendor) {
    case 'ARM':
      vendor = 'arm';
      break;
    case 'Qualcomm':
      vendor = 'qualcomm';
      break;
    case 'Apple Inc.':
      vendor = 'apple';
      break;
    case 'Google Inc. (Apple)':
      vendor = 'apple';
      break;
    case 'Google Inc. (ATI Technologies Inc.)':
      vendor = 'apple';
      break;
    case 'Google Inc. (Intel Inc.)':
      vendor = 'intel';
      break;
    case 'Google Inc. (AMD)':
      vendor = 'amd';
      break;
    case 'Google Inc. (Intel)':
      vendor = 'intel';
      break;
    case 'Google Inc. (NVIDIA)':
      vendor = 'nvidia';
      break;
    default:
      vendor = 'intel';
  }

  const web_gpu_data_list = shuffleArray(WEB_GPU_DATA);
  const web_gpu_data = web_gpu_data_list.find(
    (item) => item.webgpu.gpu_adapterinfo_vendor === vendor
  );
  return web_gpu_data.webgpu;
}

export function getCanvasLabel(value, noiseLabel = 'Noise', closeLabel = 'Đóng') {
  switch (value) {
    case '1':
      return noiseLabel;
    case '0':
      return closeLabel;
    default:
      return 'undefined';
  }
}

export function getTimezoneLabel(
  isAutomatic,
  timezone,
  valueAutomatic = 'Kết hợp dựa trên IP',
  valueLocal = 'Múi giờ địa phương'
) {
  if (isAutomatic) return valueAutomatic;

  if (timezone === 'local') return valueLocal;

  return timezone;
}

export function getImagesLabel(value, allowLabel = 'Cho phép', blockLabel = 'Đóng') {
  switch (value) {
    case '1':
      return allowLabel;
    case '0':
      return blockLabel;
    default:
      return 'undefined';
  }
}

export function getLanguageLabel(value) {
  return languages.find((item) => item.value === value)?.label;
}

export function translateTimeSinceLastOpen(timeSince, language) {
  if (language === 'VN') {
    let timeSinceTranslated = timeSince
      .replace('hours', 'tiếng')
      .replace('hour', 'tiếng')
      .replace('minutes', 'phút')
      .replace('minute', 'phút')
      .replace('seconds', 'giây')
      .replace('second', 'giây')
      .replace('days', 'ngày')
      .replace('day', 'ngày')
      .replace('months', 'tháng')
      .replace('month', 'tháng')
      .replace('years', 'năm')
      .replace('year', 'năm');
    if (timeSinceTranslated) {
      timeSinceTranslated = `${timeSinceTranslated} trước`;
    }
    return timeSinceTranslated;
  }
  return timeSince;
}

export function getOsVersionId(os, version) {
  const OS_VERSION_MAP = {
    windows: WINDOW_VERSION,
    mac_os: MACOS_VERSION,
    linux: LINUX_VERSION,
    android: ANDROID_VERSION,
    ios: IOS_VERSION,
  };
  const versionArray = OS_VERSION_MAP[os];
  return versionArray?.find((item) => item.value.version === version)?.id || '';
}

export const isValidBase64 = (str) => {
  // eslint-disable-next-line no-useless-escape
  const base64Pattern = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
  return base64Pattern.test(str);
};
