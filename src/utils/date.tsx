const formatDate = (d: any) => {
  let date = new Date(d);
  const day = formatZeros(date.getDate());
  const month = formatZeros(date.getMonth() + 1);
  const year = formatZeros(date.getFullYear());
  return `${day}/${month}/${year}`;
};

const formatHour = (d: any) => {
  let date = new Date(d);
  const hours = formatZeros(date.getHours() + 1);
  const minutes = formatZeros(date.getMinutes() + 1);
  return `${hours}:${minutes}`;
};

const formatZeros = (i: number) => {
  return i < 10 ? ("0" + i).slice(-2) : i;
};

export { formatDate, formatHour };
