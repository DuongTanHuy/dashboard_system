import PropTypes from 'prop-types';
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider as MuiLocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { defaultLang } from './config-lang';

// ----------------------------------------------------------------------

export default function LocalizationProvider({ children }) {
  return (
    <MuiLocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={defaultLang.adapterLocale}>
      {children}
    </MuiLocalizationProvider>
  );
}

LocalizationProvider.propTypes = {
  children: PropTypes.node,
};
