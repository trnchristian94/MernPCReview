const formatDate = (d: any) => {
  let date = new Date(d);
  const day = formatZeros(date.getDate());
  const month = formatZeros(date.getMonth() + 1);
  const year = formatZeros(date.getFullYear());
  return `${day}/${month}/${year}`;
};

const formatHour = (d: any) => {
  let date = new Date(d);
  const hours = formatZeros(date.getHours());
  const minutes = formatZeros(date.getMinutes());
  return `${hours}:${minutes}`;
};

const formatZeros = (i: number) => {
  return i < 10 ? ("0" + i).slice(-2) : i;
};

const getTimeUntilNow = (d: any) => {
  const dif = new Date().getTime() - new Date(d).getTime();
  const secondsBetweenDates = Math.round(dif / 1000);
  const s = secondsBetweenDates;
  if (s < 60) {
    return `${secondsBetweenDates} seconds ago.`;
  } else if (Math.round(s / 60) < 60) {
    return `${Math.round(s / 60)} minutes ago.`;
  } else if (Math.round(s / 3600) < 24) {
    return `${Math.round(s / 3600)} hours ago.`;
  } else if (Math.round(s / 3600 / 24) < 31) {
    return `${Math.round(s / 3600 / 24)} days ago.`;
  } else if (Math.round(s / 3600 / 24 / 31) < 12) {
    return `${Math.round(s / 3600 / 24 / 31)} months ago.`;
  } else {
    return `${Math.round(s / 3600 / 24 / 31 / 12)} years ago.`;
  }
};

export { formatDate, formatHour, getTimeUntilNow };
