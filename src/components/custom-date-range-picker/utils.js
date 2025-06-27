import { isSameDay, isSameMonth, getYear } from 'date-fns';
// utils
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function shortDateLabel(startDate, endDate, format = 'dd MMM yy', secondFormat = 'dd MMM') {
  if (!startDate || !endDate) {
    if (!startDate) {
      return fDate(endDate, format);
    }
    return fDate(startDate, format);
  }

  const getCurrentYear = new Date().getFullYear();

  const startDateYear = startDate ? getYear(startDate) : null;

  const endDateYear = endDate ? getYear(endDate) : null;

  const currentYear = getCurrentYear === startDateYear && getCurrentYear === endDateYear;

  const sameDay = startDate && endDate ? isSameDay(new Date(startDate), new Date(endDate)) : false;

  const sameMonth =
    startDate && endDate ? isSameMonth(new Date(startDate), new Date(endDate)) : false;

  if (currentYear) {
    if (sameMonth) {
      if (sameDay) {
        return fDate(endDate, format);
      }
      return `${fDate(startDate, 'dd')} - ${fDate(endDate, format)}`;
    }
    return `${fDate(startDate, secondFormat)} - ${fDate(endDate, format)}`;
  }

  return `${fDate(startDate, format)} - ${fDate(endDate, format)}`;
}
