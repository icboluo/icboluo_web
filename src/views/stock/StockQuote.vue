<template>
  <div>
    <el-row :gutter="12" align="middle">
      <el-col :span="8">
        <el-select v-model="seasonId" placeholder="选择赛季" @change="init">
          <el-option v-for="s in seasons" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="init">刷新行情</el-button>
      </el-col>
    </el-row>

    <el-table :data="quotes" style="width: 100%; margin-top: 16px" v-loading="loading">
      <el-table-column prop="stockCode" label="代码" width="100" />
      <el-table-column prop="stockName" label="名称" width="120" />
      <el-table-column prop="openPrice" label="开盘" />
      <el-table-column prop="closePrice" label="收盘" />
      <el-table-column prop="highPrice" label="最高" />
      <el-table-column prop="lowPrice" label="最低" />
      <el-table-column prop="volume" label="成交量" />
      <el-table-column prop="increaseRateDay" label="日涨跌幅" width="120">
        <template #default="scope">
          <span :style="{ color: scope.row.increaseRateDay >= 0 ? '#f56c6c' : '#67c23a' }">
            {{ scope.row.increaseRateDay }}%
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button size="small" @click="openChart(scope.row)">走势</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="chartVisible" title="走势图" width="80%">
      <div v-if="chart" ref="chartRef" style="width: 100%; height: 480px"></div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { simplePost } from '@/util/Request'
import { stockUrlPre } from '@/util/Constant'
import { SessionKey } from '@/util/AlUtil'
import * as echarts from 'echarts'
import type { QuoteVo, SeasonVo, StockChartVo } from '@/types/stock'

const seasons = ref<SeasonVo[]>([])
const quotes = ref<QuoteVo[]>([])
const loading = ref(false)
const seasonId = ref<number>()
const chartVisible = ref(false)
const chart = ref<StockChartVo>()
const chartRef = ref<HTMLElement>()

function init() {
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  if (!sid) {
    return
  }
  loading.value = true
  simplePost(stockUrlPre + 'stockQuote/current', { seasonId: sid })
    .then((data: QuoteVo[]) => {
      quotes.value = data
    })
    .finally(() => (loading.value = false))
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

function openChart(row: QuoteVo) {
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  const playerName = sessionStorage.getItem(SessionKey.stockPlayerName) || undefined
  simplePost(stockUrlPre + 'stockQuote/chart', {
    seasonId: sid,
    stockCode: row.stockCode,
    playerName
  }).then((data: StockChartVo) => {
    chart.value = data
    chartVisible.value = true
    nextTick(renderChart)
  })
}

function renderChart() {
  if (!chartRef.value || !chart.value) {
    return
  }
  const c = chart.value
  const option = {
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
      {
        name: '持仓市值',
        type: 'line',
        data: c.prices.map((p) => p.holdMarketValue)
      },
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
  }
  echarts.init(chartRef.value).setOption(option)
}

onMounted(loadSeasons)
</script>

<style scoped></style>
