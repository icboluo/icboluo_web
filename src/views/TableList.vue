<template>
  <BaseTable :table-info="tableInfo" :page-info="pageInfo" @handler-cur-change="handlerCurChange">
  </BaseTable>
</template>

<script setup lang="ts">
import BaseTable from '../components/BaseTable.vue'
import { onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { PageInfo, TableInfo } from '@/components/BaseTable.vue'

onMounted(() => {
  invoking()
})

function handlerCurChange(curPage: number) {
  ElMessage.success(curPage + '')
}

const tableInfo = reactive<TableInfo>({
  header: [
    {
      fieldName: 'date',
      showName: 'Date'
    },
    {
      fieldName: 'name',
      showName: 'Name'
    },
    {
      fieldName: 'address',
      showName: 'Address'
    }
  ],
  data1: []
})
const pageInfo = reactive<PageInfo>({
  total: 336
})

function invoking() {
  tableInfo.data1 = [
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '2016-05-04',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '2016-05-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    }
  ]
}
</script>

<style scoped></style>
