<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="block">
          <span class="demonstration">收益计算日期（默认一年</span>
          <el-date-picker
            v-model="initPar.date"
            value-format="yyyy-MM-dd"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-button type="primary" plain @click="init"> 搜索</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="基金id" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >{{ scope.row.id }}
          </el-button>
        </template>
      </el-table-column>

      <span v-for="(it, idx) in 5" :key="it">
        <el-table-column prop="avgMap" label="`年${(it)}平均值`" width="180">
          <template slot-scope="avg">
            <span v-for="(item, index) in avg.row.avgMap" v-if="index === idx + ''" :key="item">
              {{ item }}
            </span>
          </template>
        </el-table-column>
      </span>
    </el-table>
    <base-table
      :table-info="tableInfo"
      :page-info="pageInfo"
      @handler-cur-change="handlerCurChange"
    ></base-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '@/util/Request'
import constant from '@/util/Constant'
import type { PageInfo, PageQuery, TableInfo } from '@/components/BaseTable.vue'
import BaseTable from '@/components/BaseTable.vue'

let tableData = ref([])
const initPar = reactive({
  date: null
})
const tableInfo = reactive<TableInfo>({
  header: [
    {
      fieldName: 'id',
      showName: '基金id'
    },
    {
      fieldName: 'name',
      showName: '基金名称'
    },
    {
      fieldName: 'tenAvg',
      showName: '最近10天平均值'
    },
    {
      fieldName: 'fixedInvestmentIncome',
      showName: '万份定投收益'
    },
    {
      fieldName: 'totalDay',
      showName: '定投总天数'
    },
    {
      fieldName: 'lossInvestmentIncome',
      showName: '万份亏损投入收益'
    },
    {
      fieldName: 'lossTotalDay',
      showName: '亏损投入总天数'
    },
    {
      fieldName: 'lossRatioIncome',
      showName: '万份亏损比率投入收益'
    },
    {
      fieldName: 'bigLossIncome',
      showName: '万份大亏损时收益'
    }
  ],
  data1: []
})

const pickerOptions = reactive({
  shortcuts: [
    {
      text: '最近一周',
      onClick(picker: any) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近一个月',
      onClick(picker: any) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近三个月',
      onClick(picker: any) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }
  ]
})
const fundDataRet = reactive({
  list: null,
  thisPageAvg: null
})
const pageInfo = reactive<PageInfo>({
  total: 1000,
  pageSize: 10,
  pageNum: 1
})
const pageQuery = reactive<PageQuery>({
  pageSize: 10,
  pageNum: 1
})
const router = useRouter()

async function init() {
  if (initPar.date) {
    pageQuery.startDate = initPar.date[0]
    pageQuery.endDate = initPar.date[1]
  }
  let res = await get(constant.fundUrlPre + '/fundAttention/init', pageQuery)
  if (res.isSuccessOrPopBox()) {
    tableInfo.data1 = res.data.list
    pageInfo.pageNum = res.data.pageNum
    pageInfo.pageSize = res.data.pageSize
    pageInfo.total = res.data.total
  }
}

function handlerCurChange(curPage: number) {
  pageQuery.pageNum = curPage
  init()
}

function handleClick(row: any) {
  router.push({
    path: '/fundData',
    query: {
      fundId: row.id
    }
  })
}

onMounted(() => {
  init()
})
</script>

<style scoped></style>
