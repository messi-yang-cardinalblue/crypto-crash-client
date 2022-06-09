export const pause = async (time: number) =>
  new Promise((res, rej) => {
    try {
      setTimeout(res, time);
    } catch (e) {
      rej(e);
    }
  });

export default {};

export function hashFnv32a(str: string, seed?: number): number {
  /* eslint-disable */
  let i,
    l,
    hval = seed === undefined ? 0x811c9dc5 : seed;

  /* eslint-disable */
  for (i = 0, l = str.length; i < l; i++) {
    /* eslint-disable */
    hval ^= str.charCodeAt(i);
    /* eslint-disable */
    hval +=
      (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  /* eslint-disable */
  return hval >>> 0;
}
