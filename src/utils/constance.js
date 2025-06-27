const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';
const TICKET = 'ticket';
const SETTINGS = 'settings';
const USER = 'user';
const PASSWORD = 'password';

const OPTIONS_FETCH = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateOnMount: true,
};

const ERROR_CODE = {
  INVALID_AUTH_TICKET: 10001,
  INVALID_TWO_FACTOR_CODE: 10002,
  INVALID_OTP_CODE: 10003,
  INVALID_RESET_PASSWORD_TOKEN: 10004,
  INSUFFICIENT_BALANCE: 10005,
  INCORRECT_OLD_PASS: 10006,
  PLATFORM_ACCOUNT_EXIST: 10007,
  CANNOT_DELETE_SUPER_ADMIN: 10008,
  MEMBERS_EXISTS_CAN_NOT_DELETE: 10009,
  NOT_PURCHASED_PACKAGE: 10010,
  INVITE_REQUEST_EXIST: 10011,
  INVITE_LINK_EXPIRED: 10012,
  PASSWORD_ALREADY_EXISTS: 10013,
  PASSWORD_INCORRECT: 10014,
  SELF_INVITE: 10015,
  NOT_PAYMENT_INFO: 10009,
  NOT_PERMISSION: 40011,
  RATE_LIMIT: 40012,
  EMAIL_EXIST: 10022,
};

const PACKAGE = [
  { id: 1, name: 'Solo', profile_quantity: '30', price: '300000' },
  { id: 2, name: 'Small Team', profile_quantity: '100', price: '500000' },
  { id: 3, name: 'Big Team', profile_quantity: '500', price: '1500000' },
  { id: 4, name: 'Scale', profile_quantity: '1000', price: '2500000' },
  { id: 6, name: 'Resources', profile_quantity: '5000', price: '10000000' },
];

const OS_DEFAULT = 'windows';
const OS_VERSION_DEFAULT = '10';
const NOISE_MODE = '1';
const CUSTOM_MODE = '1';
const ALLOW_MODE = '1';

const WINDOW_VERSION = [
  {
    id: 'win_01',
    label: 'Windows 10',
    value: {
      os: 'windows',
      version: '10',
    },
  },
  {
    id: 'win_02',
    label: 'Windows 8',
    value: {
      os: 'windows',
      version: '8',
    },
  },
  {
    id: 'win_03',
    label: 'Windows 7',
    value: {
      os: 'windows',
      version: '7',
    },
  },
];

const MACOS_VERSION = [
  {
    id: 'mac_01',
    label: 'macOS 13',
    value: {
      os: 'mac_os',
      version: '13',
    },
  },
  {
    id: 'mac_02',
    label: 'macOS 12',
    value: {
      os: 'mac_os',
      version: '12',
    },
  },
  {
    id: 'mac_03',
    label: 'macOS 11',
    value: {
      os: 'mac_os',
      version: '11',
    },
  },
  {
    id: 'mac_04',
    label: 'macOS 10',
    value: {
      os: 'mac_os',
      version: '10',
    },
  },
];

const LINUX_VERSION = [
  {
    id: 'linux_01',
    label: 'All Linux',
    value: {
      os: 'linux',
      version: '',
    },
  },
];

const ANDROID_VERSION = [
  {
    id: 'and_01',
    label: 'Andoird 13',
    value: {
      os: 'android',
      version: '13',
    },
  },
  {
    id: 'and_02',
    label: 'Andoird 12',
    value: {
      os: 'android',
      version: '12',
    },
  },
  {
    id: 'and_03',
    label: 'Andoird 11',
    value: {
      os: 'android',
      version: '11',
    },
  },
  {
    id: 'and_04',
    label: 'Andoird 10',
    value: {
      os: 'android',
      version: '10',
    },
  },
  {
    id: 'and_05',
    label: 'Andoird 9',
    value: {
      os: 'android',
      version: '9',
    },
  },
];

const IOS_VERSION = [
  {
    id: 'ios_01',
    label: 'iOS 15',
    value: {
      os: 'ios',
      version: '15',
    },
  },
  {
    id: 'ios_02',
    label: 'iOS 14',
    value: {
      os: 'ios',
      version: '14',
    },
  },
];

const PROXY_CONNECTION_TYPES = [
  {
    id: 'proxy_type_0',
    label: 'Không sử dụng proxy',
    value: 'none',
  },
  {
    id: 'proxy_type_01',
    label: 'HTTP',
    value: 'http',
  },
  {
    id: 'proxy_type_02',
    label: 'HTTPS',
    value: 'https',
  },
  {
    id: 'proxy_type_03',
    label: 'SOCKS4',
    value: 'socks4',
  },
  {
    id: 'proxy_type_04',
    label: 'SOCKS5',
    value: 'socks5',
  },
];

const WEBRTC_MODES = [
  {
    id: 'webrtc_mode_0',
    label: 'Thay thế',
    value: 'replace',
  },
  {
    id: 'webrtc_mode_1',
    label: 'Real',
    value: 'real',
  },
  {
    id: 'webrtc_mode_2',
    label: 'Vô hiệu hóa',
    value: 'disabled',
  },
];

const LOCATION_MODES = [
  {
    id: 'location_mode_0',
    label: 'Hỏi',
    value: 'ask',
  },
  {
    id: 'location_mode_1',
    label: 'Cho phép',
    value: 'allow',
  },
  {
    id: 'location_mode_2',
    label: 'Vô hiệu hóa',
    value: 'disabled',
  },
];

const RESOLUTION_MODES = [
  {
    id: 'resolution_mode_0',
    label: 'Tùy chỉnh',
    value: 'custom',
  },
  {
    id: 'resolution_mode_1',
    label: 'Ngẫu nhiên',
    value: 'random',
  },
];

const SCREEN_RESOLUTIONS = [
  '750 x 1334',
  '800 x 600',
  '1024 x 600',
  '1024 x 640',
  '1024 x 768',
  '1152 x 864',
  '1280 x 720',
  '1280 x 768',
  '1280 x 800',
  '1280 x 960',
  '1280 x 1024',
  '1360 x 768',
  '808 x 1792',
  '828 x 1792',
  '1080 x 2340',
  '1125 x 2436',
  '1242 x 2208',
  '1170 x 2532',
  '1284 x 2778',
  '1366 x 768',
  '1400 x 1050',
  '1400 x 900',
  '1440 x 900',
  '1536 x 864',
  '1600 x 900',
  '1600 x 1200',
  '1680 x 1050',
  '1920 x 1080',
  '1920 x 1200',
  '2048 x 1152',
  '2304 x 1440',
  '2560 x 1440',
  '2560 x 1600',
  '2880 x 1800',
  '4096 x 2304',
  '5120 x 2880',
];

const FONT_MODES = [
  {
    id: 'font_mode_0',
    label: 'Măc định',
    value: 'none',
  },
  {
    id: 'font_mode_1',
    label: 'Tùy chỉnh',
    value: 'custom',
  },
];

const CANVAS_MODES = [
  {
    id: 'canvas_mode_1',
    label: 'Noise',
    value: '1',
  },
  {
    id: 'canvas_mode_2',
    label: 'Real',
    value: '0',
  },
];

const WEBGL_IMG_MODES = [
  {
    id: 'webgl_img_mode_1',
    label: 'Noise',
    value: '1',
  },
  {
    id: 'webgl_img_mode_2',
    label: 'Real',
    value: '0',
  },
];

const WEBGL_META_DATA_MODES = [
  {
    id: 'webgl_meta_data_mode_1',
    label: 'Tùy chỉnh',
    value: '1',
  },
  {
    id: 'webgl_meta_data_mode_2',
    label: 'Real',
    value: '0',
  },
];

const WEBGL_UNMASKED_VENDORS = [
  {
    id: 'webgl_unmasked_vendors_1',
    label: 'ARM',
    value: 'ARM',
    system: 'android',
  },
  {
    id: 'webgl_unmasked_vendors_2',
    label: 'Qualcomm',
    value: 'Qualcomm',
    system: 'android',
  },
  {
    id: 'webgl_unmasked_vendors_3',
    label: 'Apple Inc.',
    value: 'Apple Inc.',
    system: 'ios',
  },
  {
    id: 'webgl_unmasked_vendors_4',
    label: 'Google Inc. (Apple)',
    value: 'Google Inc. (Apple)',
    system: 'mac_os',
  },
  {
    id: 'webgl_unmasked_vendors_5',
    label: 'Google Inc. (ATI Technologies Inc.)',
    value: 'Google Inc. (ATI Technologies Inc.)',
    system: 'mac_os',
  },
  {
    id: 'webgl_unmasked_vendors_6',
    label: 'Google Inc. (Intel Inc.)',
    value: 'Google Inc. (Intel Inc.)',
    system: 'mac_os',
  },
  {
    id: 'webgl_unmasked_vendors_7',
    label: 'Google Inc. (AMD)',
    value: 'Google Inc. (AMD)',
    system: 'windows',
  },
  {
    id: 'webgl_unmasked_vendors_8',
    label: 'Google Inc. (Intel)',
    value: 'Google Inc. (Intel)',
    system: 'windows',
  },
  {
    id: 'webgl_unmasked_vendors_9',
    label: 'Google Inc. (NVIDIA)',
    value: 'Google Inc. (NVIDIA)',
    system: 'windows',
  },
];

const WEB_GPU_DATA = [
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'ampere',
      gpu_adapterinfo_vendor: 'nvidia',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'turing',
      gpu_adapterinfo_vendor: 'nvidia',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'kepler',
      gpu_adapterinfo_vendor: 'nvidia',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'fermi',
      gpu_adapterinfo_vendor: 'nvidia',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'volta',
      gpu_adapterinfo_vendor: 'nvidia',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'maxwell',
      gpu_adapterinfo_vendor: 'nvidia',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'mali-g78',
      gpu_adapterinfo_vendor: 'arm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'mali-g77',
      gpu_adapterinfo_vendor: 'arm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'mali-g76',
      gpu_adapterinfo_vendor: 'arm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'mali-g72',
      gpu_adapterinfo_vendor: 'arm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'mali-g71',
      gpu_adapterinfo_vendor: 'arm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'mali-g52',
      gpu_adapterinfo_vendor: 'arm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'mali-g31',
      gpu_adapterinfo_vendor: 'arm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'mali-t880',
      gpu_adapterinfo_vendor: 'arm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'mali-t860',
      gpu_adapterinfo_vendor: 'arm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'mali-t760',
      gpu_adapterinfo_vendor: 'arm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'mali-t720',
      gpu_adapterinfo_vendor: 'arm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gen-12lp',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gen12.5-xe-hpg',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gen12-xe-lp',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gen12-xe-hp',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gen12-xe',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gen11-iris-plus',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gen11-iris',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gen11-hd-graphics',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gen10-iris-plus',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gen10-iris',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gen9-hd-graphics',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'xe-hpg',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'xe-lp',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'iris-xe',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'iris-plus',
      gpu_adapterinfo_vendor: 'intel',
    },
  },

  {
    webgpu: {
      gpu_adapterinfo_architecture: 'iris',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'iris-xe-max',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'hd-graphics',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'hd-graphics-650',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'hd-graphics-630',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'hd-graphics-620',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'hd-graphics-615',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'hd-graphics-610',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'hd-graphics-6000',
      gpu_adapterinfo_vendor: 'intel',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'rdna2',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'rdna',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'vega',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'polaris',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gfx9',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gfx8',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gfx7',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'r600',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'sienna-cichlid',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'navi',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gfx6',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gfx5',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'hainan',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'oland',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'thames',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gcn-1',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gcn-2',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gcn-3',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gcn-4',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'gcn-5',
      gpu_adapterinfo_vendor: 'amd',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a12x',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a12',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a11',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a10x',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a10',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a9x',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a9',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a8x',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a8',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a7',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a6x',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a6',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a5x',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a5',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'apple-a4',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'common-3',
      gpu_adapterinfo_vendor: 'apple',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-730',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-650',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-640',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-630',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-620',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-618',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-615',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-612',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-610',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-540',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-530',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-520',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-512',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-510',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
  {
    webgpu: {
      gpu_adapterinfo_architecture: 'adreno-509',
      gpu_adapterinfo_vendor: 'qualcomm',
    },
  },
];

const AUDIO_MODES = [
  {
    id: 'audio_mode_1',
    label: 'Noise',
    value: '1',
  },
  {
    id: 'audio_mode_2',
    label: 'Real',
    value: '0',
  },
];

const MEDIA_DEVICES_MODES = [
  {
    id: 'media_mode_1',
    label: 'Noise',
    value: '1',
  },
  {
    id: 'media_mode_2',
    label: 'Real',
    value: '0',
  },
];

const CLIENT_RECTS_MODES = [
  {
    id: 'client_rects_mode_1',
    label: 'Noise',
    value: '1',
  },
  {
    id: 'client_rects_mode_2',
    label: 'Real',
    value: '0',
  },
];

const SPEECH_SWITCH_MODES = [
  {
    id: 'speech_switch_mode_1',
    label: 'Noise',
    value: '1',
  },
  {
    id: 'speech_switch_mode_2',
    label: 'Real',
    value: '0',
  },
];

const HARDWARE_CONCURRENCY = ['default', '2', '3', '4', '6', '8', '10', '12', '16', '20', '24'];

const DEVICE_MEMORY = ['default', '2', '4', '6', '8'];

const DEVICE_NAME_MODES = [
  {
    id: 'device_name_mode_1',
    label: 'Tùy chỉnh',
    value: '1',
  },
  {
    id: 'device_name_mode_2',
    label: 'Real',
    value: '0',
  },
];

const MAC_ADDRESS_MODES = [
  {
    id: 'mac_address_mode_1',
    label: 'Tùy chỉnh',
    value: '1',
  },
  {
    id: 'mac_address_mode_2',
    label: 'Real',
    value: '0',
  },
];

const DO_NOT_TRACK_MODES = [
  {
    id: 'do_not_track_mode_1',
    label: 'Mặc định',
    value: 'default',
  },
  {
    id: 'do_not_track_mode_2',
    label: 'Mở',
    value: '1',
  },
  {
    id: 'do_not_track_mode_3',
    label: 'Đóng',
    value: '0',
  },
];

const WEB_GPU_MODES = [
  {
    id: 'web_gpu_mode_1',
    label: 'Match WebGL',
    value: '1',
  },
  {
    id: 'web_gpu_mode_2',
    label: 'Real',
    value: '2',
  },
  {
    id: 'web_gpu_mode_3',
    label: 'Disabled',
    value: '3',
  },
];

const FLASH_MODES = [
  {
    id: 'flash_mode_1',
    label: 'Cho phép',
    value: 'allow',
  },
  {
    id: 'flash_mode_2',
    label: 'Đóng',
    value: 'block',
  },
];

const SCAN_PORT_TYPE = [
  {
    id: 'scan_port_type_1',
    label: 'Cho phép',
    value: '1',
  },
  {
    id: 'scan_port_type_2',
    label: 'Đóng',
    value: '0',
  },
];

const GPU_MODES = [
  {
    id: 'gpu_mode_1',
    label: 'Mặc định',
    value: '0',
  },
  {
    id: 'gpu_mode_2',
    label: 'Mở',
    value: '1',
  },
  {
    id: 'gpu_mode_3',
    label: 'Đóng',
    value: '2',
  },
];

const IMAGE_MODES = [
  {
    id: 'image_mode_1',
    label: 'Cho phép',
    value: '1',
  },
  {
    id: 'image_mode_2',
    label: 'Chặn',
    value: '0',
  },
];

const COLORS = [
  ['primary.main', 'primary.dark'],
  ['warning.main', 'warning.dark'],
  ['info.main', 'info.dark'],
  ['secondary.main', 'secondary.dark'],
  ['error.main', 'error.dark'],
  ['success.main', 'success.dark'],
];

const NUM_ID_DISPLAY = 8;

export {
  ACCESS_KEY,
  REFRESH_KEY,
  TICKET,
  SETTINGS,
  OPTIONS_FETCH,
  ERROR_CODE,
  PACKAGE,
  OS_DEFAULT,
  OS_VERSION_DEFAULT,
  WINDOW_VERSION,
  MACOS_VERSION,
  LINUX_VERSION,
  ANDROID_VERSION,
  IOS_VERSION,
  PROXY_CONNECTION_TYPES,
  WEBRTC_MODES,
  LOCATION_MODES,
  RESOLUTION_MODES,
  SCREEN_RESOLUTIONS,
  FONT_MODES,
  CANVAS_MODES,
  WEBGL_IMG_MODES,
  WEBGL_META_DATA_MODES,
  AUDIO_MODES,
  MEDIA_DEVICES_MODES,
  CLIENT_RECTS_MODES,
  SPEECH_SWITCH_MODES,
  NOISE_MODE,
  CUSTOM_MODE,
  WEBGL_UNMASKED_VENDORS,
  HARDWARE_CONCURRENCY,
  DEVICE_MEMORY,
  DEVICE_NAME_MODES,
  MAC_ADDRESS_MODES,
  DO_NOT_TRACK_MODES,
  WEB_GPU_MODES,
  FLASH_MODES,
  SCAN_PORT_TYPE,
  ALLOW_MODE,
  GPU_MODES,
  IMAGE_MODES,
  WEB_GPU_DATA,
  COLORS,
  NUM_ID_DISPLAY,
  USER,
  PASSWORD,
};
