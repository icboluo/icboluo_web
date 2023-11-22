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
      v-bind="pageInfo"
      :page-sizes="pageInfo.pageSizes||[3,5,10,20]"
      @size-change="(pageSize:number)=>handleSizeChange(pageSize,pageInfo)"
      @current-change="(curPage:number)=>handleCurrentChange(curPage,pageInfo)"
    >
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import type { PaginationProps, TableColumnCtx } from "element-plus";

/**
 * 不可重复定义，相当于定义了一个全局变量
 */
defineProps({
  tableInfo: {
    type: Object as () => TableInfo
  },
  pageInfo: {
    type: Object as () => PageInfo
  }
});

/**
 * init 时间不可与 handlerSizeChange handlerCurChange 事件混用
 */
const allEmits = defineEmits([
  "handlerSizeChange",
  "handlerCurChange",
  "init"
]);

const handleSizeChange = (pageSize: number, pageInfo?: PageInfo) => {
  if (pageInfo) {
    pageInfo.pageSize = pageSize;
  }
  allEmits("init");
  allEmits("handlerSizeChange", pageSize);
};
const handleCurrentChange = (curPage: number, pageInfo?: PageInfo) => {
  if (pageInfo) {
    pageInfo.pageNum = curPage;
  }
  allEmits("init");
  allEmits("handlerCurChange", curPage);
};

export interface TableInfo {
  header: Header[];
  data1: object[];
}

export interface Header extends TableColumnCtx<any> {
  fieldName: string;
  showName: string;
  isButtonSlot: boolean;
}

export interface PageInfo extends PaginationProps {
  total: number;
  pageSize: number;
  pageNum: number;
}

// 勿删，有使用
</script>

<style>
.color1 {
  color: #e10b65;
}
</style>
