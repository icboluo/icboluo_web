<template>
  <div></div>
</template>

<script>

export default {
  name: 'TableUtil',
  totalRow
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

</script>

<style scoped>

</style>
