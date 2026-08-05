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
      <el-col :span="6">
        <el-tag type="info">当前玩家：{{ currentPlayer || '未选择' }}</el-tag>
      </el-col>
      <el-col :span="4">
        <el-button type="warning" @click="openDetail">交易详情图</el-button>
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
      <template #cellSlot="{ filedRow, fieldVal }">
        <span v-if="fieldVal === 'BUY' || fieldVal === 'SELL'" :style="{ color: filedRow.tradeType === 'BUY' ? '#67c23a' : '#f56c6c' }">
          {{ filedRow.tradeType === 'BUY' ? '买入' : '卖出' }}
        </span>
      </template>
    </BaseTable>

    <el-dialog v-model="detailVisible" title="交易详情图" width="80%" @opened="renderActiveChart" @closed="handleDetailClosed">
      <el-tabs v-model="activeStockCode" @tab-change="onTabChange">
        <el-tab-pane v-for="c in detailCharts" :key="c.stockCode" :label="c.stockCode" :name="c.stockCode">
          <div v-if="c.stockCode === activeStockCode" ref="chartRef" style="width: 100%; height: 460px"></div>
        </el-tab-pane>
      </el-tabs>
      <el-empty v-if="!detailCharts.length" description="暂无交易数据" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { simplePost, simplePostPage } from '@/util/Request'
import { stockUrlPre } from '@/util/Constant'
import { SessionKey } from '@/util/AlUtil'
import * as echarts from 'echarts'
import BaseTable from '@/components/BaseTable.vue'
import type { SeasonVo, StockChartVo, TradeRecordVo } from '@/types/stock'
import type { TableInfo, PageInfo } from '@/components/BaseTable.vue'

const seasons = ref<SeasonVo[]>([])
const seasonId = ref<number>()
const currentPlayer = sessionStorage.getItem(SessionKey.stockPlayerName) || ''
const tradeForm = reactive({ stockCode: '', quantity: 100 })

const detailVisible = ref(false)
const detailCharts = ref<StockChartVo[]>([])
const activeStockCode = ref<string>('')
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

const pageInfo = reactive<PageInfo>({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  list: [] as TradeRecordVo[]
})

const tableInfo = reactive<TableInfo>({
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
      tableInfo.body = pageInfo.list as TradeRecordVo[]
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

function openDetail() {
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  const playerName = sessionStorage.getItem(SessionKey.stockPlayerName)
  if (!sid || !playerName) {
    return
  }
  simplePost(stockUrlPre + 'stockQuote/playerCharts', { seasonId: sid, playerName }).then(
    (data: StockChartVo[]) => {
      detailCharts.value = data
      activeStockCode.value = data.length ? data[0].stockCode : ''
      detailVisible.value = true
    }
  )
}

function renderActiveChart() {
  if (!chartRef.value || !activeStockCode.value) {
    return
  }
  const c = detailCharts.value.find((x) => x.stockCode === activeStockCode.value)
  if (!c) {
    return
  }
  const series: echarts.SeriesOption[] = [
    {
      name: '收盘价',
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: c.prices.map((p) => p.closePrice)
    }
  ]
  if (c.trades.length) {
    series.push({
      name: '买卖点',
      type: 'scatter',
      data: c.trades.map((t) => ({
        value: [t.tradeDay, t.price],
        symbol: t.tradeType === 'BUY' ? 'triangle' : 'pin',
        symbolSize: 14,
        itemStyle: { color: t.tradeType === 'BUY' ? '#67c23a' : '#f56c6c' }
      }))
    })
  }
  const option: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: series.map((s) => (s as { name?: string }).name).filter(Boolean) as string[] },
    xAxis: { type: 'category', data: c.prices.map((p) => p.tradeDay) },
    yAxis: { type: 'value', name: '价格', scale: true },
    series
  }
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(option)
  chartInstance.resize()
}

function onTabChange(code: string | number) {
  activeStockCode.value = String(code)
  // tab 切换后对应图表容器需等待 DOM 更新，下一帧再渲染
  nextTick(renderActiveChart)
}

function handleDetailClosed() {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

onMounted(loadSeasons)
</script>

<style scoped></style>
