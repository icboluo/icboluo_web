<template>
  <el-table :data="tableInfo?.data1" style="width: 100%">
    <el-table-column
      v-for="(item, idx) in tableInfo?.header"
      v-bind="item"
      :prop="item.fieldName || item.prop"
      :label="item.showName || item.label"
      :key="idx"
    >
      <template v-if="item.isButtonSlot" #header>
        <slot name="buttonSlot" :fieldVal="item" :idx="idx"></slot>
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
import type { TableColumnCtx } from 'element-plus'

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

export interface PageInfo {
  total: number
  pageSize: number
  pageNum: number
}

export interface PageQuery {
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
