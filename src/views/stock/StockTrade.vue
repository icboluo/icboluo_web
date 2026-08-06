<template>
  <div>
    <el-row :gutter="12" align="middle">
      <el-col :span="7">
        <el-select v-model="seasonId" placeholder="选择赛季" @change="onSeasonChange">
          <el-option v-for="s in seasons" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" @click="onSeasonChange">刷新</el-button>
      </el-col>
      <el-col :span="6">
        <el-tag type="info">当前玩家：{{ currentPlayer || '未选择' }}</el-tag>
      </el-col>
      <el-col :span="3" style="text-align: right">
        <el-switch v-model="onlyMine" active-text="仅持仓" />
      </el-col>
      <el-col :span="3" style="text-align: right">
        <el-button type="warning" plain @click="openHistory">历史记录</el-button>
      </el-col>
    </el-row>

    <el-alert
      v-if="!hasContext"
      style="margin-top: 12px"
      title="请先在「赛季大厅」创建或加入一个赛季并设置玩家昵称，才能查看持仓与行情。"
      type="warning"
      :closable="false"
    />

    <!-- 快速买卖区（按代码） -->
    <el-card style="margin-top: 12px">
      <el-row :gutter="12" align="middle">
        <el-col :span="6">
          <el-input v-model="tradeForm.stockCode" placeholder="股票代码" />
        </el-col>
        <el-col :span="6">
          <el-input v-model.number="tradeForm.quantity" placeholder="数量（100的整数倍）" />
        </el-col>
        <el-col :span="3">
          <el-button type="success" @click="doTrade('buy')">买入</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="danger" @click="doTrade('sell')">卖出</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 全部股票行情 + 持仓标记 + 行内操作 -->
    <el-card style="margin-top: 12px" v-loading="quoteLoading">
      <el-table :data="visibleStocks" style="width: 100%" empty-text="暂无行情数据">
        <el-table-column prop="stockCode" label="代码" width="110" />
        <el-table-column prop="stockName" label="名称" width="130" />
        <el-table-column prop="closePrice" label="收盘" />
        <el-table-column label="日涨跌幅" width="110">
          <template #default="scope">
            <span :style="{ color: scope.row.increaseRateDay >= 0 ? '#f56c6c' : '#67c23a' }">
              {{ scope.row.increaseRateDay }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="持仓投入" width="120">
          <template #default="scope">
            <span>{{ myProfitMap[scope.row.stockCode]?.stockTotalInvest ?? '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="持仓收益" width="110">
          <template #default="scope">
            <span :style="{ color: profitColor(myProfitMap[scope.row.stockCode]?.stockProfit) }">
              {{ myProfitMap[scope.row.stockCode]?.stockProfit ?? '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template #default="scope">
            <el-button size="small" type="success" @click="openTrade(scope.row, 'buy')">买入</el-button>
            <el-button size="small" type="danger" @click="openTrade(scope.row, 'sell')">卖出</el-button>
            <el-button size="small" @click="openChart(scope.row)">走势</el-button>
            <el-button size="small" type="warning" @click="openRecords(scope.row)">记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 交易弹窗 -->
    <el-dialog
      v-model="tradeVisible"
      :title="(tradeStock?.stockName || '') + (tradeType === 'buy' ? ' 买入' : ' 卖出')"
      width="420px"
    >
      <el-form label-width="90px">
        <el-form-item label="代码">
          <span>{{ tradeStock?.stockCode }}</span>
        </el-form-item>
        <el-form-item label="当前价">
          <span>{{ tradeStock?.closePrice }}</span>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model.number="tradeQty" placeholder="100 的整数倍" />
        </el-form-item>
        <el-form-item label="预计金额">
          <span>{{ estimatedAmount }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="tradeVisible = false">取消</el-button>
        <el-button :type="tradeType === 'buy' ? 'success' : 'danger'" @click="confirmTrade">
          确认{{ tradeType === 'buy' ? '买入' : '卖出' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 走势弹窗 -->
    <el-dialog v-model="chartVisible" :title="(chartStock?.stockName || '') + ' 走势图'" width="80%" @opened="renderChart" @closed="handleChartClosed">
      <div v-if="chartStock" ref="chartRef" style="width: 100%; height: 480px"></div>
    </el-dialog>

    <!-- 历史交易记录弹窗 -->
    <el-dialog v-model="recordsVisible" title="历史交易记录" width="80%" @opened="loadHistory">
      <el-table :data="records" empty-text="暂无交易记录">
        <el-table-column prop="tradeDay" label="交易日" width="100" />
        <el-table-column prop="stockCode" label="代码" width="110" />
        <el-table-column prop="stockName" label="名称" width="140" />
        <el-table-column label="类型" width="80">
          <template #default="scope">
            <span :style="{ color: scope.row.tradeType === 'BUY' ? '#67c23a' : '#f56c6c' }">
              {{ scope.row.tradeType === 'BUY' ? '买入' : '卖出' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="amount" label="金额" width="120" />
        <el-table-column prop="createTime" label="时间" min-width="180" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { simplePost } from '@/util/Request'
import { stockUrlPre } from '@/util/Constant'
import { SessionKey } from '@/util/AlUtil'
import * as echarts from 'echarts'
import type { QuoteVo, SeasonVo, StockChartVo, TradeRecordVo } from '@/types/stock'
import type { PageInfo } from '@/components/BaseTable.vue'

const route = useRoute()
const routePlayer = (route.query.playerName as string) || ''
if (routePlayer) {
  sessionStorage.setItem(SessionKey.stockPlayerName, routePlayer)
}

const seasons = ref<SeasonVo[]>([])
const seasonId = ref<number>()
const currentPlayer = routePlayer || sessionStorage.getItem(SessionKey.stockPlayerName) || ''
const hasContext = ref(true)
const router = useRouter()
const onlyMine = ref(false)

const tradeForm = reactive({ stockCode: '', quantity: 100 })

// 全部股票行情
const quotes = ref<QuoteVo[]>([])
const quoteLoading = ref(false)

// 该玩家交易过的股票（含收益）
const myStocks = ref<StockChartVo[]>([])
const myProfitMap = computed<Record<string, StockChartVo>>(() => {
  const m: Record<string, StockChartVo> = {}
  myStocks.value.forEach((s) => (m[s.stockCode] = s))
  return m
})

// 行内/弹窗交易
const tradeVisible = ref(false)
const tradeStock = ref<QuoteVo>()
const tradeType = ref<'buy' | 'sell'>('buy')
const tradeQty = ref(100)
const estimatedAmount = computed(() => {
  const price = tradeStock.value?.closePrice
  if (price == null || !tradeQty.value) {
    return '0'
  }
  const p = typeof price === 'number' ? price : Number(price)
  return (p * tradeQty.value).toFixed(2)
})

// 走势弹窗
const chartVisible = ref(false)
const chartStock = ref<StockChartVo>()
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 历史记录弹窗
const recordsVisible = ref(false)
const records = ref<TradeRecordVo[]>([])

const visibleStocks = computed(() => {
  if (!onlyMine.value) {
    return quotes.value
  }
  const codes = new Set(myStocks.value.map((s) => s.stockCode))
  return quotes.value.filter((q) => codes.has(q.stockCode))
})

function goSeason() {
  router.push('/stockSeason')
}

function onSeasonChange() {
  init()
  loadQuotes()
}

function init() {
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  const playerName = sessionStorage.getItem(SessionKey.stockPlayerName)
  if (!sid || !playerName) {
    hasContext.value = false
    return
  }
  hasContext.value = true
  simplePost(stockUrlPre + 'stockQuote/playerCharts', { seasonId: sid, playerName }).then(
    (data: StockChartVo[]) => (myStocks.value = data)
  )
}

function loadQuotes() {
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  if (!sid) {
    return
  }
  quoteLoading.value = true
  simplePost(stockUrlPre + 'stockQuote/current', { seasonId: sid })
    .then((data: QuoteVo[]) => {
      quotes.value = data
      if (onlyMine.value) {
        onlyMine.value = false
      }
    })
    .finally(() => (quoteLoading.value = false))
}

function openTrade(row: QuoteVo, type: 'buy' | 'sell') {
  if (!currentPlayer) {
    alert('请先在赛季大厅加入并设置玩家昵称')
    return
  }
  tradeStock.value = row
  tradeType.value = type
  tradeQty.value = 100
  tradeVisible.value = true
}

function confirmTrade() {
  if (!tradeStock.value || !tradeQty.value) {
    return
  }
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  if (!sid || !currentPlayer) {
    return
  }
  simplePost(stockUrlPre + 'stockTrade/' + tradeType.value, {
    seasonId: sid,
    playerName: currentPlayer,
    stockCode: tradeStock.value.stockCode,
    quantity: tradeQty.value
  }).then(() => {
    tradeVisible.value = false
    init()
    loadQuotes()
  })
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
  }).then(() => {
    init()
    loadQuotes()
  })
}

function profitColor(v: string | number | null | undefined): string {
  if (v == null) {
    return ''
  }
  const n = typeof v === 'number' ? v : Number(v)
  if (Number.isNaN(n)) {
    return ''
  }
  return n > 0 ? '#67c23a' : n < 0 ? '#f56c6c' : ''
}

function openChart(row: QuoteVo) {
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  const playerName = sessionStorage.getItem(SessionKey.stockPlayerName) || undefined
  simplePost(stockUrlPre + 'stockQuote/chart', {
    seasonId: sid,
    stockCode: row.stockCode,
    playerName
  }).then((data: StockChartVo) => {
    chartStock.value = data
    chartVisible.value = true
  })
}

function renderChart() {
  if (!chartRef.value || !chartStock.value) {
    return
  }
  const c = chartStock.value
  const series: echarts.SeriesOption[] = [
    { name: '收盘价', type: 'line', showSymbol: false, data: c.prices.map((p) => p.closePrice) }
  ]
  series.push({
    name: '持仓市值',
    type: 'line',
    yAxisIndex: 1,
    data: c.prices.map((p) => p.holdMarketValue)
  })
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
    yAxis: [
      { type: 'value', name: '价格', scale: true },
      { type: 'value', name: '市值', scale: true }
    ],
    series
  }
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(option)
  chartInstance.resize()
}

function handleChartClosed() {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

function openRecords(row: QuoteVo) {
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  const playerName = sessionStorage.getItem(SessionKey.stockPlayerName)
  if (!sid || !playerName) {
    return
  }
  simplePost(stockUrlPre + 'stockTrade/records', {
    seasonId: sid,
    playerName,
    pageNum: 1,
    pageSize: 1000
  }).then((data: PageInfo<TradeRecordVo>) => {
    records.value = data.list
      .filter((r) => r.stockCode === row.stockCode)
      .map((r) => ({ ...r, stockName: row.stockName }))
    recordsVisible.value = true
  })
}

function openHistory() {
  if (!currentPlayer) {
    alert('请先在赛季大厅加入并设置玩家昵称')
    return
  }
  recordsVisible.value = true
}

function loadHistory() {
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  const playerName = sessionStorage.getItem(SessionKey.stockPlayerName)
  if (!sid || !playerName) {
    return
  }
  const nameMap = new Map(quotes.value.map((q) => [q.stockCode, q.stockName]))
  simplePost(stockUrlPre + 'stockTrade/records', {
    seasonId: sid,
    playerName,
    pageNum: 1,
    pageSize: 1000
  }).then((data: PageInfo<TradeRecordVo>) => {
    records.value = data.list.map((r) => ({
      ...r,
      stockName: nameMap.get(r.stockCode) || r.stockCode
    }))
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
    onSeasonChange()
  })
}

onMounted(loadSeasons)
</script>

<style scoped></style>
