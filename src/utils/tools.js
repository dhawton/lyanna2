export const split = (str, separator, limit) => {
  str = str.split(separator);

  if (str.length > limit) {
    const ret = str.splice(0, limit);
    ret.push(str.join(separator));

    return ret;
  }

  return str;
};
