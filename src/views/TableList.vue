<template>
  <BaseTable :table-info="tableInfo" :page-info="pageInfo" @handler-cur-change="handlerCurChange">
    <template v-slot:buttonSlot="butt">
      {{ butt.fieldVal }}+ {{ butt.idx}}
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import BaseTable from '@/components/BaseTable.vue'
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
      showName: 'Date',
      width: '50%'
    },
    {
      fieldName: 'name',
      showName: 'Name',
      isButtonSlot: true,
    },
    {
      fieldName: 'address',
      showName: 'Address',
      className:'color1'
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
      name: 'Tom1',
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '2017-05-02',
      name: 'Tom2',
      address: 'No. 190, Grove St, Los Angeles'
    },
    {
      date: '2018-05-04',
      name: 'Tom3',
      address: 'No. 191, Grove St, Los Angeles'
    },
    {
      date: '2019-05-01',
      name: 'Tom4',
      address: 'No. 192, Grove St, Los Angeles'
    }
  ]
}
</script>

<style scoped></style>
