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

    <el-table :data="stockList" style="width: 100%; margin-top: 16px" empty-text="该玩家暂无交易股票">
      <el-table-column prop="stockCode" label="代码" width="110" />
      <el-table-column prop="stockName" label="名称" width="140" />
      <el-table-column prop="stockTotalInvest" label="累计投入" width="130" />
      <el-table-column label="总收益" width="130">
        <template #default="scope">
          <span :style="{ color: profitColor(scope.row.stockProfit) }">{{ scope.row.stockProfit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收益率(%)" width="120">
        <template #default="scope">
          <span :style="{ color: profitColor(scope.row.stockProfitRate) }">{{ scope.row.stockProfitRate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180">
        <template #default="scope">
          <el-button size="small" type="primary" @click="openChart(scope.row)">走势图</el-button>
          <el-button size="small" type="warning" @click="openRecords(scope.row)">交易记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="chartVisible" :title="(chartStock?.stockName || '') + ' 走势图'" width="80%" @opened="renderChart" @closed="handleChartClosed">
      <div v-if="chartStock" ref="chartRef" style="width: 100%; height: 480px"></div>
    </el-dialog>

    <el-dialog v-model="recordsVisible" :title="(recordStock?.stockName || '') + ' 交易记录'" width="80%">
      <el-table :data="records" empty-text="暂无交易记录">
        <el-table-column prop="tradeDay" label="交易日" width="100" />
        <el-table-column prop="stockCode" label="代码" width="110" />
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
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { simplePost } from '@/util/Request'
import { stockUrlPre } from '@/util/Constant'
import { SessionKey } from '@/util/AlUtil'
import * as echarts from 'echarts'
import type { SeasonVo, StockChartVo, TradeRecordVo } from '@/types/stock'
import type { PageInfo } from '@/components/BaseTable.vue'

const route = useRoute()
// 优先使用排行榜跳转携带的玩家名，并回写 sessionStorage 保证后续一致
const routePlayer = (route.query.playerName as string) || ''
if (routePlayer) {
  sessionStorage.setItem(SessionKey.stockPlayerName, routePlayer)
}

const seasons = ref<SeasonVo[]>([])
const seasonId = ref<number>()
const currentPlayer = routePlayer || sessionStorage.getItem(SessionKey.stockPlayerName) || ''
const tradeForm = reactive({ stockCode: '', quantity: 100 })

// 股票列表：该玩家交易过的股票
const stockList = ref<StockChartVo[]>([])

// 走势图弹窗
const chartVisible = ref(false)
const chartStock = ref<StockChartVo>()
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 交易记录弹窗
const recordsVisible = ref(false)
const records = ref<TradeRecordVo[]>([])
const recordStock = ref<StockChartVo>()

function init() {
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  const playerName = sessionStorage.getItem(SessionKey.stockPlayerName)
  if (!sid || !playerName) {
    return
  }
  // 用 playerCharts 获取该玩家交易过的股票清单（含收益信息）
  simplePost(stockUrlPre + 'stockQuote/playerCharts', { seasonId: sid, playerName }).then(
    (data: StockChartVo[]) => {
      stockList.value = data
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

function openChart(row: StockChartVo) {
  chartStock.value = row
  chartVisible.value = true
}

function renderChart() {
  if (!chartRef.value || !chartStock.value) {
    return
  }
  const c = chartStock.value
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

function handleChartClosed() {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
}

function openRecords(row: StockChartVo) {
  recordStock.value = row
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
    records.value = data.list.filter((r) => r.stockCode === row.stockCode)
    recordsVisible.value = true
  })
}

onMounted(loadSeasons)
</script>

<style scoped></style>
