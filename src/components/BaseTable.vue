<template>
  <el-table :data="tableInfo?.data1" style="width: 100%">
    <el-table-column
      v-for="(item, idx) in tableInfo?.header"
      :prop="item.fieldName"
      :label="item.showName"
      :key="idx"
    />
  </el-table>
  <div v-if="pageInfo" class="block">
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total"
      @current-change="handlerCurChange"
    >
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
// 不可重复定义
const allProps = defineProps({
  tableInfo: {
    type: Object as () => TableInfo
  },
  pageInfo: {
    type: Object as () => PageInfo
  }
})

const allEmits = defineEmits(['handlerCurChange'])

function handlerCurChange(curPage: number) {
  allEmits('handlerCurChange', curPage)
}

export interface TableInfo {
  header: Header[]
  data1: object[]
}

export interface Header {
  fieldName: string
  showName: string
}

export interface PageInfo {
  total: number
  pageSize: number
  pageNum: number
}

export interface PageQuery {
  pageSize: number
  pageNum: number
}
</script>

<style scoped></style>
