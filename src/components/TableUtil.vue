<template>
  <div></div>
</template>

<script>

export default {
  name: 'TableUtil',
  totalRow,
  percentage,
  tableAddSerialNum
}

const rowMaxSum = 4

/**
 * 总行数
 * @param list
 * @return {*[]|number}
 */
function totalRow (list) {
  if (!list || list.length === 0) {
    return 0
  }
  const ans = []
  let row = []
  for (let i = 0; i < list.length; i++) {
    row.push(list[i])
    if (i !== 0 && row.length === rowMaxSum) {
      ans.push(row)
      row = []
    }
  }
  if (row.length !== 0) {
    ans.push(row)
  }
  return ans
}

/**
 * 百分比
 * @param a 分子
 * @param b 分母
 * @param def 默认值
 * @return {number|*}
 */
function percentage (a, b, def) {
  if (a === 0 && b === 0) {
    return 100
  }
  if (b === 0) {
    return def
  }
  return Math.floor(a * 100 / b)
}

/**
 * 表单增加序号属性
 */
function tableAddSerialNum ({row, rowIndex}) {
  row.index = rowIndex + 1
}

</script>

<style scoped>

</style>
