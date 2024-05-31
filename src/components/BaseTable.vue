<template>
  <el-table :data="tableInfo?.pageInfo.list" v-bind="$attrs" style="width: 100%">
    <el-table-column
      v-for="(item, idx) in tableInfo?.header"
      v-bind="item"
      :prop="item.fieldName || item.prop || item.buttonName"
      :label="item.showName || item.label"
      :key="idx"
    >
      <template v-slot="cell">
        <slot
          name="cellSlot"
          :fieldVal="cell.row[item.fieldName || item.prop || item.buttonName]"
          :fieldOperation="item.buttonOperation"
          :filedRow="cell.row"
          :idx="idx"
        ></slot>
      </template>
      <!--      这里 default和不写是一致的，代表处理的是表体，如果写header代表处理的是表头-->
      <template v-if="item.isButtonSlot" v-slot="cell">
        <slot
          name="buttonSlot"
          :fieldVal="cell.row[item.fieldName || item.prop || item.buttonName]"
          :fieldOperation="item.buttonOperation"
          :filedRow="cell.row"
          :idx="idx"
        ></slot>
      </template>
    </el-table-column>
  </el-table>

  <div v-if="tableInfo?.pageInfo" class="block">
    <el-pagination
      v-bind="tableInfo?.pageInfo"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="tableInfo?.pageInfo.pageSizes || [3, 5, 10, 20]"
      @size-change="(pageSize: number) => handleSizeChange(pageSize, tableInfo?.pageInfo)"
      @current-change="(curPage: number) => handleCurrentChange(curPage, tableInfo?.pageInfo)"
    >
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import type { PaginationProps, TableColumnCtx } from 'element-plus'
import type { ComponentInternalInstance } from 'vue'
import { getCurrentInstance, onMounted } from 'vue'

/**
 * 不可重复定义，相当于定义了一个全局变量
 */
defineProps({
  tableInfo: {
    type: Object as () => TableInfo
  }
})

/**
 * init 时间不可与 handlerSizeChange handlerCurChange 事件混用
 */
const allEmits = defineEmits(['handlerSizeChange', 'handlerCurChange', 'init'])

let inst: ComponentInternalInstance | null
onMounted(() => {
  inst = getCurrentInstance()
})

const handleSizeChange = (pageSize: number, pageInfo?: PageInfo) => {
  if (pageInfo) {
    pageInfo.pageSize = pageSize
  }
  if (inst?.vnode.props?.onHandlerSizeChange) {
    allEmits('handlerSizeChange', pageSize)
  } else {
    allEmits('init')
  }
}
const handleCurrentChange = (curPage: number, pageInfo?: PageInfo) => {
  if (pageInfo) {
    pageInfo.pageNum = curPage
  }
  // 如果存在该事件，优先使用自定义的事件
  if (inst?.vnode.props?.onHandlerCurChange) {
    allEmits('handlerCurChange', curPage)
  } else {
    allEmits('init')
  }
}

export interface TableInfo {
  header: Header[]
  pageInfo: PageInfo
  body: []
}

export interface Header extends TableColumnCtx<any> {
  /**
   * 字段名称，也就是接口字段名
   */
  fieldName: string
  /**
   * 展示名称，表头名称
   */
  showName: string

  buttonName: string
  isButtonSlot: boolean
  buttonOperation: string
}

export interface PageInfo extends PaginationProps {
  total: number
  pageSize: number
  pageNum: number
  list: []
}

// 勿删，有使用
</script>

<style>
.color1 {
  color: #e10b65;
}

.color-red {
  color: #e10b65;
}

.color-blue {
  color: #19e10b;
}
</style>
