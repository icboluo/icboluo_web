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
      <el-tabs v-model="activeStock" type="card">
        <el-tab-pane v-for="c in charts" :key="c.stockCode" :label="c.stockName" :name="c.stockCode">
          <div :ref="(el) => (chartEls[c.stockCode] = el)" style="width: 100%; height: 420px"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
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
const chartEls = reactive<Record<string, any>>({})
const route = useRoute()

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
  // 复用已有实例，避免重复 init；容器切换显示后用 resize 修正宽度
  let chart = echarts.getInstanceByDom(el)
  if (!chart) {
    chart = echarts.init(el)
  }
  const xData = c.prices.map((p) => p.tradeDay)
  chart.setOption({
    tooltip: { trigger: 'axis' },
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
            itemStyle: { color: t.tradeType === 'BUY' ? '#67c23a' : '#f56c6c' }
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
