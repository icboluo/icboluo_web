<template>
  <div>
    <el-row :gutter="12" align="middle">
      <el-col :span="8">
        <el-select v-model="seasonId" placeholder="选择赛季" @change="initAll">
          <el-option v-for="s in seasons" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select
          v-model="playerName"
          filterable
          allow-create
          style="width: 100%"
          placeholder="选择玩家"
          @change="initAll"
        >
          <el-option v-for="p in players" :key="p" :label="p" :value="p" />
        </el-select>
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
      <el-row :gutter="16">
        <el-col :span="18">
          <el-tabs v-model="activeStock" type="card">
            <el-tab-pane v-for="c in charts" :key="c.stockCode" :label="c.stockName" :name="c.stockCode">
              <div :ref="(el) => (chartEls[c.stockCode] = el)" style="width: 100%; height: 420px"></div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="6" v-if="activeChart">
          <el-descriptions title="当前持仓概况" :column="1" border>
            <el-descriptions-item label="投资中最大投入金额">{{ activeChart.stockMaxInvest }}</el-descriptions-item>
            <el-descriptions-item label="原始股票可操作金额">{{ activeChart.stockInitInvest }}</el-descriptions-item>
            <el-descriptions-item label="总收益">
              <span :style="{ color: profitColor(activeChart.stockProfit) }">{{ activeChart.stockProfit }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="收益率(按原始金额)">
              <span :style="{ color: profitColor(activeChart.stockProfitRateByInit) }">{{ activeChart.stockProfitRateByInit }}%</span>
            </el-descriptions-item>
            <el-descriptions-item label="收益率(按最大投入)">
              <span :style="{ color: profitColor(activeChart.stockProfitRateByMax) }">{{ activeChart.stockProfitRateByMax }}%</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { simplePost } from '@/util/Request'
import { stockUrlPre } from '@/util/Constant'
import { SessionKey } from '@/util/AlUtil'
import * as echarts from 'echarts'
import type { AccountVo, SeasonVo, StockChartVo } from '@/types/stock'

const seasons = ref<SeasonVo[]>([])
const seasonId = ref<number>()
const playerName = ref('')
const players = ref<string[]>([])
const account = ref<AccountVo>()
const charts = ref<StockChartVo[]>([])
const activeStock = ref('')
const chartEls = reactive<Record<string, HTMLElement>>({})
const route = useRoute()

// 当前选中股票（tab）的走势数据，用于右侧持仓概况展示
const activeChart = computed<StockChartVo | undefined>(() =>
  charts.value.find((x) => x.stockCode === activeStock.value)
)

// 盈亏颜色：赚为红（A股习惯），亏为绿，持平为默认
function profitColor(value: number | undefined): string {
  if (value == null || value === 0) {
    return ''
  }
  return value > 0 ? '#f56c6c' : '#67c23a'
}

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

// 图表 tooltip：展示当日价格/市值、当日持仓数与总金额，并在有买卖点时展示交易详情
function tradeTooltip(params: any[], priceByDay?: Map<number, any>): string {
  if (!params || !params.length) {
    return ''
  }
  const day = params[0]?.axisValue
  const point = priceByDay?.get(Number(day))
  let html = `<div style="font-weight:600;margin-bottom:4px">第 ${day} 交易日</div>`
  if (point) {
    html += `<div>当前持仓数：${point.holdQty} 股</div>`
    html += `<div>当前总金额：${point.holdMarketValue}</div>`
  }
  for (const p of params) {
    if (p.seriesName === '买卖点') {
      const t = p.data?.trade
      if (t) {
        const isBuy = t.tradeType === 'BUY'
        const typeText = isBuy ? '买入' : '卖出'
        const color = isBuy ? '#67c23a' : '#f56c6c'
        html += `<div style="margin-top:4px;color:${color};font-weight:600">${typeText}</div>`
        html += `<div>数量：${t.quantity} 股</div>`
        html += `<div>单价：${t.price}</div>`
        html += `<div>总金额：${t.amount}</div>`
      }
      continue
    }
    if (p.value == null || p.value === '' || p.value !== p.value) {
      continue
    }
    html += `<div>${p.marker} ${p.seriesName}：${p.value}</div>`
  }
  return html
}

function renderActiveChart() {
  const code = activeStock.value
  const el = chartEls[code]
  const c = charts.value.find((x) => x.stockCode === code)
  if (!el || !c) {
    return
  }
  // 复用已有实例，避免重复 init；容器切换显示后用 resize 修正宽度
  let chart = echarts.getInstanceByDom(el)
  if (!chart) {
    chart = echarts.init(el)
  }
  const xData = c.prices.map((p) => p.tradeDay)
  const priceByDay = new Map<number, any>(c.prices.map((p) => [p.tradeDay, p]))
  chart.setOption({
    tooltip: { trigger: 'axis', formatter: (params: any) => tradeTooltip(params, priceByDay) },
    legend: { data: ['收盘价', '持仓市值', '买卖点'], selected: { '持仓市值': false } },
    xAxis: { type: 'category', data: xData },
    yAxis: [
      { type: 'value', name: '收盘价', scale: true },
      { type: 'value', name: '持仓市值', scale: true }
    ],
    series: [
      {
        name: '收盘价',
        type: 'line',
        smooth: false,
        showSymbol: false,
        tooltip: { show: false },
        data: c.prices.map((p) => p.closePrice)
      },
      {
        name: '持仓市值',
        type: 'line',
        smooth: false,
        showSymbol: false,
        yAxisIndex: 1,
        data: c.prices.map((p) => p.holdMarketValue)
      },
      {
        name: '买卖点',
        type: 'scatter',
        symbolSize: 14,
        data: c.trades.map((t) => {
          // 用交易日序号在 x 轴上的下标定位，保证与收盘价同一坐标点
          const idx = xData.indexOf(t.tradeDay)
          return {
            value: [idx < 0 ? t.tradeDay : idx, t.price],
            symbol: t.tradeType === 'BUY' ? 'triangle' : 'pin',
            itemStyle: { color: t.tradeType === 'BUY' ? '#67c23a' : '#f56c6c' },
            trade: t
          }
        })
      }
    ]
  })
  chart.resize()
}

// tab 切换后等待 DOM 完成布局再渲染，避免容器宽度为 0 导致图表过窄
watch(activeStock, () => nextTick(renderActiveChart))

function loadPlayers() {
  if (!seasonId.value) {
    return
  }
  simplePost(stockUrlPre + 'stockAccount/players', { seasonId: seasonId.value }).then(
    (data: string[]) => (players.value = data)
  )
}

function loadSeasons() {
  simplePost(stockUrlPre + 'season/list').then((data: SeasonVo[]) => {
    seasons.value = data
    // 优先使用路由携带的参数（从排行榜跳转而来）
    const qSeason = Number(route.query.seasonId)
    const qPlayer = (route.query.playerName as string) || ''
    if (qSeason && data.some((s) => s.id === qSeason)) {
      seasonId.value = qSeason
      sessionStorage.setItem(SessionKey.stockSeasonId, String(qSeason))
    } else {
      const saved = Number(sessionStorage.getItem(SessionKey.stockSeasonId))
      if (saved && data.some((s) => s.id === saved)) {
        seasonId.value = saved
      } else if (data.length) {
        seasonId.value = data[data.length - 1].id
      }
    }
    playerName.value = qPlayer || sessionStorage.getItem(SessionKey.stockPlayerName) || ''
    if (qPlayer) {
      sessionStorage.setItem(SessionKey.stockPlayerName, qPlayer)
    }
    loadPlayers()
    initAll()
  })
}

// 切换赛季时刷新玩家下拉列表
watch(seasonId, loadPlayers)

onMounted(loadSeasons)
</script>

<style scoped></style>
