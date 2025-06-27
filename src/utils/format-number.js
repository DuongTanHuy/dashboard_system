import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}

export function fCurrency(number) {
  const format = number ? numeral(number).format('$0,0.00') : '';

  return result(format, '.00');
}

export function fCurrencyVND(number) {
  const format = number ? numeral(number).format('0,0') : '';

  return `${format || 0}₫`;
}

export function fPercent(number) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number) {
  const format = number ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

function result(format, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}

export function getNumSkeleton(rowPerPage = 10, dataLength = 0, maxValue = 20) {
  const maxRows = Math.min(rowPerPage, maxValue);
  const rows = Math.min(dataLength || maxRows, maxRows);
  return rows;
}

export function fQuantityNumber(number) {
  if (number === 0) return 0;

  let format = number ? numeral(number).format('0.000a') : '';

  if (number % 1000 === 0 || number <= 1000) {
    format = number ? numeral(number).format('0a') : '';
  }

  return format.toUpperCase();
}
