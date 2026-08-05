<template>
  <div>
    <el-row :gutter="12" align="middle">
      <el-col :span="8">
        <el-select v-model="seasonId" placeholder="选择赛季" @change="initAll">
          <el-option v-for="s in seasons" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input v-model="playerName" placeholder="玩家昵称" />
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="initAll">查询</el-button>
      </el-col>
    </el-row>

    <el-card header="账户" style="margin-top: 16px" v-if="account">
      <el-descriptions :column="3" border>
        <el-descriptions-item label="总资产">{{ account.totalAsset }}</el-descriptions-item>
        <el-descriptions-item label="可用资金">{{ account.availableFund }}</el-descriptions-item>
        <el-descriptions-item label="收益率">{{ account.profitRate }}%</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card header="交易过的股票走势" style="margin-top: 16px">
      <el-tabs v-model="activeStock" type="card" @tab-change="renderActiveChart">
        <el-tab-pane v-for="c in charts" :key="c.stockCode" :label="c.stockName" :name="c.stockCode">
          <div :ref="(el) => (chartEls[c.stockCode] = el)" style="width: 100%; height: 420px"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { simplePost } from '@/util/Request'
import { stockUrlPre } from '@/util/Constant'
import { SessionKey } from '@/util/AlUtil'
import * as echarts from 'echarts'
import type { AccountVo, SeasonVo, StockChartVo } from '@/types/stock'

const seasons = ref<SeasonVo[]>([])
const seasonId = ref<number>()
const playerName = ref('')
const account = ref<AccountVo>()
const charts = ref<StockChartVo[]>([])
const activeStock = ref('')
const chartEls = reactive<Record<string, any>>({})

function collectParam() {
  return {
    seasonId: seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId)),
    playerName: playerName.value || sessionStorage.getItem(SessionKey.stockPlayerName) || ''
  }
}

function initAll() {
  const param = collectParam()
  if (!param.seasonId || !param.playerName) {
    return
  }
  simplePost(stockUrlPre + 'stockAccount', param).then((data: AccountVo) => (account.value = data))
  simplePost(stockUrlPre + 'stockQuote/playerCharts', param).then((data: StockChartVo[]) => {
    charts.value = data
    if (data.length) {
      activeStock.value = data[0].stockCode
      nextTick(renderActiveChart)
    }
  })
}

function renderActiveChart() {
  const code = activeStock.value
  const el = chartEls[code]
  const c = charts.value.find((x) => x.stockCode === code)
  if (!el || !c) {
    return
  }
  echarts.init(el).setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['收盘价', '持仓市值'] },
    xAxis: { type: 'category', data: c.prices.map((p) => p.tradeDay) },
    yAxis: { type: 'value' },
    series: [
      {
        name: '收盘价',
        type: 'candlestick',
        data: c.prices.map((p) => [p.openPrice, p.closePrice, p.lowPrice, p.highPrice])
      },
      { name: '持仓市值', type: 'line', data: c.prices.map((p) => p.holdMarketValue) },
      {
        name: '买卖点',
        type: 'scatter',
        data: c.trades.map((t) => ({
          value: [t.tradeDay, t.price],
          symbol: t.tradeType === 'BUY' ? 'triangle' : 'pin',
          symbolSize: 14,
          itemStyle: { color: t.tradeType === 'BUY' ? '#67c23a' : '#f56c6c' }
        }))
      }
    ]
  })
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
    playerName.value = sessionStorage.getItem(SessionKey.stockPlayerName) || ''
    initAll()
  })
}

onMounted(loadSeasons)
</script>

<style scoped></style>
