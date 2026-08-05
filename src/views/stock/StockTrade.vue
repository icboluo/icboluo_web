<template>
  <div>
    <el-row :gutter="12" align="middle">
      <el-col :span="8">
        <el-select v-model="seasonId" placeholder="选择赛季" @change="init">
          <el-option v-for="s in seasons" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="init">刷新</el-button>
      </el-col>
    </el-row>

    <el-row :gutter="12" style="margin-top: 12px" align="middle">
      <el-col :span="6">
        <el-input v-model="tradeForm.stockCode" placeholder="股票代码" />
      </el-col>
      <el-col :span="6">
        <el-input v-model.number="tradeForm.quantity" placeholder="数量（100的整数倍）" />
      </el-col>
      <el-col :span="4">
        <el-button type="success" @click="buy">买入</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="danger" @click="sell">卖出</el-button>
      </el-col>
    </el-row>

    <BaseTable :table-info="tableInfo" @handler-size-change="init" @handler-cur-change="init">
      <template #cellSlot="{ filedRow, fieldName }">
        <span v-if="fieldName === 'tradeType'" :style="{ color: filedRow.tradeType === 'BUY' ? '#67c23a' : '#f56c6c' }">
          {{ filedRow.tradeType === 'BUY' ? '买入' : '卖出' }}
        </span>
      </template>
    </BaseTable>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { simplePost, simplePostPage } from '@/util/Request'
import { stockUrlPre } from '@/util/Constant'
import { SessionKey } from '@/util/AlUtil'
import BaseTable from '@/components/BaseTable.vue'
import type { SeasonVo, TradeRecordVo } from '@/types/stock'
import type { TableInfo, PageInfo } from '@/components/BaseTable.vue'

const seasons = ref<SeasonVo[]>([])
const seasonId = ref<number>()
const tradeForm = reactive({ stockCode: '', quantity: 100 })

const pageInfo = reactive<PageInfo>({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  list: []
})

const tableInfo = reactive<TableInfo<TradeRecordVo>>({
  header: [
    { fieldName: 'id', showName: 'ID', width: 80 },
    { fieldName: 'stockCode', showName: '代码', width: 100 },
    { fieldName: 'stockName', showName: '名称', width: 120 },
    { fieldName: 'tradeType', showName: '类型', width: 80 },
    { fieldName: 'quantity', showName: '数量', width: 100 },
    { fieldName: 'price', showName: '价格', width: 100 },
    { fieldName: 'amount', showName: '金额', width: 120 },
    { fieldName: 'tradeDay', showName: '交易日', width: 100 },
    { fieldName: 'createTime', showName: '时间', width: 180 }
  ],
  pageInfo: pageInfo,
  body: pageInfo.list as TradeRecordVo[]
})

function init() {
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  const playerName = sessionStorage.getItem(SessionKey.stockPlayerName)
  if (!sid || !playerName) {
    return
  }
  simplePostPage(stockUrlPre + 'stockTrade/records', pageInfo, { seasonId: sid, playerName }).then(
    (data: PageInfo) => {
      pageInfo.list = data.list as TradeRecordVo[]
      tableInfo.body = pageInfo.list
    }
  )
}

function loadSeasons() {
  simplePost(stockUrlPre + 'season/list').then((data: SeasonVo[]) => {
    seasons.value = data
    const saved = Number(sessionStorage.getItem(SessionKey.stockSeasonId))
    if (saved && data.some((s) => s.id === saved)) {
      seasonId.value = saved
    } else if (data.length) {
      seasonId.value = data[data.length - 1].id
    }
    init()
  })
}

function buy() {
  doTrade('buy')
}
function sell() {
  doTrade('sell')
}
function doTrade(type: 'buy' | 'sell') {
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  const playerName = sessionStorage.getItem(SessionKey.stockPlayerName)
  if (!sid || !playerName || !tradeForm.stockCode) {
    return
  }
  simplePost(stockUrlPre + 'stockTrade/' + type, {
    seasonId: sid,
    playerName,
    stockCode: tradeForm.stockCode,
    quantity: tradeForm.quantity
  }).then(() => init())
}

onMounted(loadSeasons)
</script>

<style scoped></style>
