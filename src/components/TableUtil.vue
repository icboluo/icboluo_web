<template>
  <div></div>
</template>

<script>

export default {
  tableAddSerialNum
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
