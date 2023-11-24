const rowMaxSum = 4;

/**
 * 将一组元素分为多组
 * @param list
 * @return {*[]|number}
 */
export function toDoubleArray<T>(list: T[]): T[][] {
  if (!list || list.length === 0) {
    return [];
  }
  const ans: T[][] = [];
  let i = 0;
  while (i < list.length) {
    let row = [];
    for (let j = 0; j < rowMaxSum && i < list.length; j++) {
      row.push(list[i++]);
    }
    ans.push(row);
  }
  return ans;
}


/**
 * 百分比
 * @param a 分子
 * @param b 分母
 * @param def 默认值
 * @return {number|*}
 */
export function percentage(a: number, b: number, def: number) {
  if (a === 0 && b === 0) {
    return 100;
  }
  if (b === 0) {
    return def;
  }
  return Math.floor(a * 100 / b);
}

export default {
  toDoubleArray,
  percentage
};
