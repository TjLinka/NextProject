export const localInt = (val : number) => {
  return new Intl.NumberFormat().format(val);
};
