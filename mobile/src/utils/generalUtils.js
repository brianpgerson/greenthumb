export const waitAtLeastASecond = async (ms = 1000) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('done!');
  }, ms);
});

export const isBefore = (date1, date2) => {
  return new Date(date1).getTime() < new Date(date2).getTime();
}

export const toCalendarDay = (date) => date.toISOString().split('T')[0];