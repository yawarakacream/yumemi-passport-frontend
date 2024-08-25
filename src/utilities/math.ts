/**
 * 整数の乱数を生成する
 *
 * 範囲は [l, r)
 */
export const randInt = (l: number, r: number): number => {
  if (!Number.isInteger(l)) throw new Error(`"l" must be Integer: ${l}`);
  if (!Number.isInteger(r)) throw new Error(`"r" must be Integer: ${r}`);
  return Math.floor(Math.random() * (r - l)) + l;
};
