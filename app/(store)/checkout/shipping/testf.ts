const ab = {
  a: 1,
  b: 2,
};
const sum = (ab: { a: number; b: number }, c: number) => ab.a + ab.b + c;

export { sum };
