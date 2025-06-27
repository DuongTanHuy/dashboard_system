import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useEffect, useMemo, useCallback, useState } from 'react';
// hooks
import { useLocalStorage } from 'src/hooks/use-local-storage';
// utils
import { localStorageGetItem } from 'src/utils/storage-available';
//
import { SETTINGS } from 'src/utils/constance';
import { palette } from 'src/theme/palette';
import { SettingsContext } from './settings-context';

// ----------------------------------------------------------------------

export function SettingsProvider({ children, defaultSettings }) {
  const { state, update, reset } = useLocalStorage(SETTINGS, defaultSettings);

  const themeColors = {
    cyan: { main: '#078DEE', light: '#68CDF9' },
    purple: { main: '#7635dc', light: '#B985F4' },
    blue: { main: '#2065D1', light: '#76B0F1' },
    orange: { main: '#fda92d', light: '#FED680' },
    red: { main: '#FF3030', light: '#FFC1AC' },
    default: { main: '#00A76F', light: '#5BE49B' },
  };

  function getThemeColors(preset) {
    return themeColors[preset] || themeColors.default;
  }

  const theme = getThemeColors(state.themeColorPresets);

  document.documentElement.style.setProperty(
    '--theme-background',
    palette(state.themeMode).background.neutral
  );
  document.documentElement.style.setProperty('--theme-border', palette(state.themeMode).grey[500]);
  document.documentElement.style.setProperty('--theme-color-main', theme.main);
  document.documentElement.style.setProperty('--theme-color-light', theme.light);

  const [openDrawer, setOpenDrawer] = useState(false);

  const isArabic = localStorageGetItem('i18nextLng') === 'ar';

  useEffect(() => {
    if (isArabic) {
      onChangeDirectionByLang('ar');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArabic]);

  // Direction by lang
  const onChangeDirectionByLang = useCallback(
    (lang) => {
      update('themeDirection', lang === 'ar' ? 'rtl' : 'ltr');
    },
    [update]
  );

  // Drawer
  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const canReset = !isEqual(state, defaultSettings);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      onUpdate: update,
      // Direction
      onChangeDirectionByLang,
      // Reset
      canReset,
      onReset: reset,
      // Drawer
      open: openDrawer,
      onToggle: onToggleDrawer,
      onClose: onCloseDrawer,
    }),
    [
      reset,
      update,
      state,
      canReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
      onChangeDirectionByLang,
    ]
  );

  return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}

SettingsProvider.propTypes = {
  children: PropTypes.node,
  defaultSettings: PropTypes.object,
};
