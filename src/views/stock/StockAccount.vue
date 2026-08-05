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

    <el-card v-if="account" style="margin-top: 16px">
      <el-descriptions title="账户概览" :column="3" border>
        <el-descriptions-item label="玩家">{{ account.playerName }}</el-descriptions-item>
        <el-descriptions-item label="可用资金">{{ account.availableFund }}</el-descriptions-item>
        <el-descriptions-item label="总资产">{{ account.totalAsset }}</el-descriptions-item>
        <el-descriptions-item label="初始资金">{{ account.initialFund }}</el-descriptions-item>
        <el-descriptions-item label="收益率">{{ account.profitRate }}%</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="12">
        <el-card header="持仓">
          <el-table :data="account?.positions || []" style="width: 100%">
            <el-table-column prop="stockCode" label="代码" width="100" />
            <el-table-column prop="stockName" label="名称" width="100" />
            <el-table-column prop="quantity" label="数量" width="90" />
            <el-table-column prop="currentPrice" label="现价" width="90" />
            <el-table-column prop="marketValue" label="市值" width="110" />
            <el-table-column prop="profitLoss" label="盈亏" width="110" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="持仓分布">
          <el-table :data="distribution" style="width: 100%">
            <el-table-column prop="stockName" label="名称" width="100" />
            <el-table-column prop="quantity" label="数量" width="90" />
            <el-table-column prop="marketValue" label="市值" width="110" />
            <el-table-column prop="proportion" label="占比" width="90">
              <template #default="scope">{{ scope.row.proportion }}%</template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-card header="收益曲线" style="margin-top: 16px">
      <div ref="profitRef" style="width: 100%; height: 320px"></div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue'
import { simplePost } from '@/util/Request'
import { stockUrlPre } from '@/util/Constant'
import { SessionKey } from '@/util/AlUtil'
import * as echarts from 'echarts'
import type {
  AccountVo,
  PositionDistributionVo,
  ProfitPointVo,
  SeasonVo
} from '@/types/stock'

const seasons = ref<SeasonVo[]>([])
const seasonId = ref<number>()
const playerName = ref('')
const account = ref<AccountVo>()
const distribution = ref<PositionDistributionVo[]>([])
const profit = ref<ProfitPointVo[]>([])
const profitRef = ref<HTMLElement>()

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
  simplePost(stockUrlPre + 'stockAccount/positionDistribution', param).then(
    (data: PositionDistributionVo[]) => (distribution.value = data)
  )
  simplePost(stockUrlPre + 'stockAccount/profitCurve', param).then((data: ProfitPointVo[]) => {
    profit.value = data
    nextTick(renderProfit)
  })
}

function renderProfit() {
  if (!profitRef.value) {
    return
  }
  echarts.init(profitRef.value).setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: profit.value.map((p) => p.tradeDay) },
    yAxis: { type: 'value' },
    series: [
      { name: '总资产', type: 'line', data: profit.value.map((p) => p.totalAsset) },
      { name: '收益率', type: 'line', data: profit.value.map((p) => p.profitRate) }
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
