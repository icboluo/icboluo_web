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
      <el-table-column prop="playerName" label="玩家" width="140" />
      <el-table-column prop="totalAsset" label="总资产" width="140" />
      <el-table-column prop="profitRate" label="收益率" width="120">
        <template #default="scope">
          <span :style="{ color: scope.row.profitRate >= 0 ? '#f56c6c' : '#67c23a' }">
            {{ scope.row.profitRate }}%
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="positionCount" label="持仓数" width="100" />
      <el-table-column prop="positionStockNames" label="持仓股票">
        <template #default="scope">{{ scope.row.positionStockNames.join('、') }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { simplePost } from '@/util/Request'
import { stockUrlPre } from '@/util/Constant'
import { SessionKey } from '@/util/AlUtil'
import type { RankVo, SeasonVo } from '@/types/stock'

const seasons = ref<SeasonVo[]>([])
const seasonId = ref<number>()
const rank = ref<RankVo[]>([])
const loading = ref(false)

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

onMounted(loadSeasons)
</script>

<style scoped></style>
