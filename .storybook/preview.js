import '../src/assets/global/style.css';

// scrollbar
import 'simplebar-react/dist/simplebar.min.css';

// quill
import 'react-quill/dist/quill.snow.css';

// image
import 'react-lazy-load-image-component/src/effects/blur.css';

// theme
import ThemeProvider from '../src/theme';

// components
import { MotionLazy } from '../src/components/animate/motion-lazy';
import { SettingsProvider, SettingsDrawer } from '../src/components/settings';
// auth
import { SnackbarProvider } from '../src/components/snackbar';
import { LocalizationProvider } from '../src/locales';
import { BrowserRouter } from 'react-router-dom';

/** @type { import('@storybook/react-webpack5').Preview } */

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <LocalizationProvider>
          <SettingsProvider
            defaultSettings={{
              themeMode: 'light', // 'light' | 'dark'
              themeDirection: 'ltr', //  'rtl' | 'ltr'
              themeContrast: 'default', // 'default' | 'bold'
              themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
              themeColorPresets: 'blue', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
              themeStretch: true,
            }}
          >
            <ThemeProvider>
              <MotionLazy>
                <SnackbarProvider>
                  <SettingsDrawer />
                  <Story />
                </SnackbarProvider>
              </MotionLazy>
            </ThemeProvider>
          </SettingsProvider>
        </LocalizationProvider>
      </BrowserRouter>
    ),
  ],
};

export default preview;
