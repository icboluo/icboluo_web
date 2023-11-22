<template>
  <el-table :data="tableInfo?.data1" style="width: 100%">
    <el-table-column
      v-for="(item, idx) in tableInfo?.header"
      v-bind="item"
      :prop="item.fieldName || item.prop"
      :label="item.showName || item.label"
      :key="idx"
    >
      <!--      这里 default和不写是一致的，代表处理的是表体，如果写header代表处理的是表头-->
      <template v-if="item.isButtonSlot" v-slot="cell">
        <slot name="buttonSlot" :fieldVal="cell.row[item.fieldName]" :idx="idx"></slot>
      </template>
    </el-table-column>
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
import type { PaginationProps, TableColumnCtx } from 'element-plus'

// 不可重复定义
defineProps({
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

export interface Header extends TableColumnCtx<any> {
  fieldName: string
  showName: string
  isButtonSlot: boolean
}

export interface PageInfo extends PaginationProps {
  total: number
  pageSize: number
  pageNum: number
}

// 勿删，有使用
</script>

<style>
.color1 {
  color: #e10b65;
}
</style>
