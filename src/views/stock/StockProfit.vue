<template>
  <div>
    <el-row :gutter="12" align="middle">
      <el-col :span="8">
        <el-select v-model="seasonId" placeholder="选择赛季" @change="init">
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
          @change="init"
        >
          <el-option v-for="p in players" :key="p" :label="p" :value="p" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="init">查询</el-button>
      </el-col>
    </el-row>

    <el-card style="margin-top: 16px">
      <div ref="chartRef" style="width: 100%; height: 420px"></div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import { simplePost } from '@/util/Request'
import { stockUrlPre } from '@/util/Constant'
import { SessionKey } from '@/util/AlUtil'
import * as echarts from 'echarts'
import type { ProfitPointVo, SeasonVo } from '@/types/stock'

const seasons = ref<SeasonVo[]>([])
const seasonId = ref<number>()
const playerName = ref('')
const players = ref<string[]>([])
const profit = ref<ProfitPointVo[]>([])
const chartRef = ref<HTMLElement>()

function loadPlayers() {
  if (!seasonId.value) {
    return
  }
  simplePost(stockUrlPre + 'stockAccount/players', { seasonId: seasonId.value }).then(
    (data: string[]) => (players.value = data)
  )
}

function init() {
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  const name = playerName.value || sessionStorage.getItem(SessionKey.stockPlayerName) || ''
  if (!sid || !name) {
    return
  }
  simplePost(stockUrlPre + 'stockAccount/profitCurve', { seasonId: sid, playerName: name }).then(
    (data: ProfitPointVo[]) => {
      profit.value = data
      nextTick(renderChart)
    }
  )
}

function renderChart() {
  if (!chartRef.value) {
    return
  }
  echarts.init(chartRef.value).setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['总资产', '收益率'] },
    xAxis: { type: 'category', data: profit.value.map((p) => p.tradeDay) },
    yAxis: [
      { type: 'value', name: '总资产' },
      { type: 'value', name: '收益率', axisLabel: { formatter: '{value}%' } }
    ],
    series: [
      { name: '总资产', type: 'line', data: profit.value.map((p) => p.totalAsset) },
      { name: '收益率', type: 'line', yAxisIndex: 1, data: profit.value.map((p) => p.profitRate) }
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
    loadPlayers()
    init()
  })
}

onMounted(loadSeasons)
</script>

<style scoped></style>
