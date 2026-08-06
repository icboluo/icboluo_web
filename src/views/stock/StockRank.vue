<template>
  <div>
    <el-row :gutter="12" align="middle">
      <el-col :span="8">
        <el-select v-model="seasonId" placeholder="选择赛季" @change="init">
          <el-option v-for="s in seasons" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="init">刷新排行</el-button>
      </el-col>
    </el-row>

    <el-table :data="rank" style="width: 100%; margin-top: 16px" v-loading="loading">
      <el-table-column prop="rank" label="排名" width="80" />
      <el-table-column label="玩家" width="140">
        <template #default="scope">
          <el-link type="primary" @click="goTrade(scope.row)">{{ scope.row.playerName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="totalAsset" label="总资产" width="140" />
      <el-table-column prop="profitRate" label="收益率" width="120">
        <template #default="scope">
          <span :style="{ color: scope.row.profitRate >= 0 ? '#f56c6c' : '#67c23a' }">
            {{ scope.row.profitRate }}%
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="positionCount" label="持仓数" width="100" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button size="small" type="primary" @click="viewTrades(scope.row)">查看交易</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="tradeVisible" :title="tradeTitle" width="720px">
      <el-table :data="tradeRecords" style="width: 100%" v-loading="tradeLoading" max-height="420">
        <el-table-column prop="tradeDay" label="交易日" width="90" />
        <el-table-column prop="stockCode" label="股票代码" width="120" />
        <el-table-column prop="tradeType" label="方向" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.tradeType === 'BUY' ? 'danger' : 'success'">
              {{ scope.row.tradeType === 'BUY' ? '买入' : '卖出' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="amount" label="金额" width="120" />
        <el-table-column prop="createTime" label="时间" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { simplePost } from '@/util/Request'
import { stockUrlPre } from '@/util/Constant'
import { SessionKey } from '@/util/AlUtil'
import type { RankVo, SeasonVo, TradeRecordVo } from '@/types/stock'

const seasons = ref<SeasonVo[]>([])
const seasonId = ref<number>()
const rank = ref<RankVo[]>([])
const loading = ref(false)

const tradeVisible = ref(false)
const tradeLoading = ref(false)
const tradeTitle = ref('')
const tradeRecords = ref<TradeRecordVo[]>([])
const router = useRouter()

function init() {
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  if (!sid) {
    return
  }
  loading.value = true
  simplePost(stockUrlPre + 'stockAccount/rank', { seasonId: sid })
    .then((data: RankVo[]) => (rank.value = data))
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

function viewTrades(row: RankVo) {
  const sid = seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
  if (!sid) {
    return
  }
  tradeTitle.value = `交易详情 - ${row.playerName}`
  tradeVisible.value = true
  tradeLoading.value = true
  simplePost(stockUrlPre + 'stockTrade/records', {
    seasonId: sid,
    playerName: row.playerName,
    pageNum: 1,
    pageSize: 100
  })
    .then((page: { list?: TradeRecordVo[] }) => {
      tradeRecords.value = page.list ?? []
    })
    .finally(() => (tradeLoading.value = false))
}

function goTrade(row: RankVo) {
  router.push({ path: '/stockTrade', query: { playerName: row.playerName } })
}

onMounted(loadSeasons)
</script>

<style scoped></style>
