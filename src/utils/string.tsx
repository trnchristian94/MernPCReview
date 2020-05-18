const getUrlDir = (dirSpaces?: number) => {
  let stringSpaces = dirSpaces === undefined ? 1 : dirSpaces;
  let loc =
    location.pathname.substr(location.pathname.length - 1) === "/"
      ? location.pathname.substr(0, location.pathname.length - 1)
      : location.pathname.substr(0, location.pathname.length);
  loc = loc[0] === "/" ? loc.substr(1, loc.length) : loc.substr(0, loc.length);
  const direction = loc.split("/");
  let returnDirection = "";
  for (let i = 0; i < stringSpaces; i++) {
    returnDirection = direction[direction.length - (i+1)] + `${i===0?'':'/'}` + returnDirection;
  }
  return returnDirection;
};
export { getUrlDir };
