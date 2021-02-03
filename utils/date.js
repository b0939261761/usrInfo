import { zeroStart } from './tools.js';

const getDateTime = (date = new Date()) => (date instanceof Date ? date : new Date(date));

export const formatDate = (format, datePar) => {
  if (!format) return '';
  const date = getDateTime(datePar);
  let result = format.toString();

  const mask = {
    YYYY: date.getFullYear().toString(),
    YY: date.getFullYear().toString().slice(2),
    MM: zeroStart(date.getMonth() + 1),
    DD: zeroStart(date.getDate()),
    HH: zeroStart(date.getHours()),
    mm: zeroStart(date.getMinutes()),
    ss: zeroStart(date.getSeconds()),
    SSS: zeroStart(date.getMilliseconds(), 3)
  };

  Object.entries(mask).forEach(({ 0: key, 1: value }) => {
    result = result.replace(new RegExp(key, 'g'), value);
  });

  return result;
};

export const addDays = (amount = 0, datePar) => {
  const date = getDateTime(datePar);
  date.setDate(date.getDate() + amount);
  return date;
};

export const getDateObj = ({ year, month, day }) => {
  const currentDate = new Date();
  return {
    year: year || currentDate.getFullYear(),
    month: month >= 1 && month <= 12 ? +month : currentDate.getMonth() + 1,
    day: +day || currentDate.getDay()
  };
};

export const monthToStr = month => zeroStart(month);

export const dayToStr = day => zeroStart(day);

export default {
  formatDate,
  addDays,
  getDateObj,
  monthToStr,
  dayToStr
};
