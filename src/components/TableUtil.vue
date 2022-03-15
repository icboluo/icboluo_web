<template>
  <div></div>
</template>

<script>

export default {
  name: 'TableUtil',
  totalRow,
  percentage
}

const rowMaxSum = 4

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

function percentage (a, b, def) {
  if (a === 0 && b === 0) {
    return 100
  }
  if (b === 0) {
    return def
  }
  return Math.floor(a * 100 / b)
}

</script>

<style scoped>

</style>
