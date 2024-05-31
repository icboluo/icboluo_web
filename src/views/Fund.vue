<template>
  <div>
    <div class="demo-date-picker">
      <div class="block">
        <span class="demonstration">收益计算日期（默认一年</span>
        <el-date-picker
          v-model="initPar.date"
          value-format="YYYY-MM-DD"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="shortcuts"
          size="default"
        />
      </div>
    </div>

    <el-button type="primary" plain @click="init"> 搜索</el-button>

    <base-table :table-info="tableInfo" @init="init">
      <template v-slot:cellSlot="id">
        <div
          :class="
            id.filedRow.max == id.fieldVal ? 'color-red' : id.filedRow.min == id.fieldVal ? 'color-blue' : ''
          "
        >
          {{ id.fieldVal }}
        </div>
      </template>
      <template v-slot:buttonSlot="id">
        <el-button
          @click="handleClick(id.fieldVal, id.fieldOperation)"
          link
          type="primary"
          size="small"
        >
          {{ id.fieldVal }}
        </el-button>
      </template>
    </base-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { simplePost, simplePostPage } from '@/util/Request'
import constant from '@/util/Constant'
import type { TableInfo } from '@/components/BaseTable.vue'
import BaseTable from '@/components/BaseTable.vue'
import { SessionKey } from '@/util/AlUtil'

const initPar = reactive({
  date: null
})
const tableInfo = reactive<TableInfo>({
  header: [
    {
      fieldName: 'id',
      showName: '基金id',
      isButtonSlot: true
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
      fieldName: 'avgMap2',
      showName: '`年${(it)}平均值`'
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
    },
    {
      fieldName: 'id',
      showName: '删除',
      isButtonSlot: true,
      buttonOperation: 'delete'
    }
  ],
  pageInfo: {
    pageNum: 1,
    pageSize: 5,
    total: 100,
    list: []
  }
})

const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  },
  {
    text: '最近一年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
      return [start, end]
    }
  },
  {
    text: '最近二年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 2)
      return [start, end]
    }
  },
  {
    text: '最近三年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 3)
      return [start, end]
    }
  }
]

const router = useRouter()

async function init() {
  const param: any = {}
  if (initPar.date) {
    param.startDate = initPar.date[0]
    param.endDate = initPar.date[1]
  }
  let res = await simplePostPage(
    constant.fundUrlPre + '/fundAttention/init',
    tableInfo.pageInfo,
    param
  )
  tableInfo.pageInfo.list = res.list.map((item: any) => ({
    ...item,
    avgMap2: item.avgMap[2]
  }))
  tableInfo.pageInfo.list.forEach((it) => {
    it.max = Math.max(
      it.fixedInvestmentIncome,
      it.lossInvestmentIncome,
      it.lossRatioIncome,
      it.bigLossIncome
    )
    it.min = Math.min(
      it.fixedInvestmentIncome,
      it.lossInvestmentIncome,
      it.lossRatioIncome,
      it.bigLossIncome
    )
  })
}

async function handleClick(id: any, operation: string) {
  sessionStorage.setItem(SessionKey.fundId, id)
  if (operation === 'delete') {
    await simplePost(constant.fundUrlPre + '/fundAttention/delete', id)
    await init()
    return
  }
  router.push({
    path: '/fundData',
    query: {
      fundId: id
    }
  })
}

onMounted(() => {
  init()
})
</script>

<style scoped>
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
