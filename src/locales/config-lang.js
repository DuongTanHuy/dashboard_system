import merge from 'lodash/merge';
import { vi as viVNAdapter } from 'date-fns/locale';
// core
import { viVN as viVNCore } from '@mui/material/locale';
// date-pickers
import { viVN as viVNDate } from '@mui/x-date-pickers/locales';
// data-grid
import { viVN as viVNDataGrid } from '@mui/x-data-grid';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'Vietnamese',
    value: 'vi',
    systemValue: merge(viVNDate, viVNDataGrid, viVNCore),
    adapterLocale: viVNAdapter,
    icon: 'flagpack:vn',
  },
];

export const defaultLang = allLangs[0]; // Vietnamese

// GET MORE COUNTRY FLAGS
// https://icon-sets.iconify.design/flagpack/
// https://www.dropbox.com/sh/nec1vwswr9lqbh9/AAB9ufC8iccxvtWi3rzZvndLa?dl=0
