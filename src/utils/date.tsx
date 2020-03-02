const formatDate = (d: any) => {
  let date = new Date(d);
  const day = formatZeros(date.getDay());
  const month = formatZeros(date.getMonth() + 1);
  const year = formatZeros(date.getFullYear());
  return `${day}/${month}/${year}`;
};

const formatZeros = (i: number) => {
  return i < 10 ? ("0" + i).slice(-2) : i;
};

export { formatDate };
