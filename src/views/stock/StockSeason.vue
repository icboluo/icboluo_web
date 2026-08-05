<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="4">
        <el-button type="primary" @click="openCreate">创建赛季</el-button>
      </el-col>
      <el-col :span="4">
        <el-button @click="botMatch">机器人对战</el-button>
      </el-col>
    </el-row>

    <el-dialog v-model="createVisible" title="创建赛季" width="420px">
      <el-form label-width="90px">
        <el-form-item label="赛季名称">
          <el-input v-model="createName" placeholder="请输入赛季名称" />
        </el-form-item>
        <el-form-item label="初始资金">
          <el-input v-model="createFund" placeholder="默认 1000000" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCreate">确定</el-button>
      </template>
    </el-dialog>

    <el-table :data="seasons" style="width: 100%; margin-top: 16px" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column prop="initialFund" label="初始资金" width="120" />
      <el-table-column prop="currentTradeDay" label="当前交易日" width="120" />
      <el-table-column prop="totalTradeDays" label="总交易日" width="120" />
      <el-table-column label="历史行情" width="220">
        <template #default="scope">
          <span v-if="scope.row.status === 'FINISHED' && scope.row.historyRevealed">
            {{ scope.row.historyStartDate }} ~ {{ scope.row.historyEndDate }}
          </span>
          <span v-else-if="scope.row.status === 'FINISHED'">未揭示</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="320">
        <template #default="scope">
          <el-button size="small" @click="joinSeason(scope.row)">加入</el-button>
          <el-button
            size="small"
            type="success"
            :disabled="scope.row.status !== 'PREPARING'"
            @click="startSeason(scope.row)"
            >开始</el-button
          >
          <el-button
            size="small"
            type="warning"
            :disabled="scope.row.status !== 'PLAYING'"
            @click="advanceDay(scope.row)"
            >推进一日</el-button
          >
          <el-button
            size="small"
            type="danger"
            :disabled="scope.row.status !== 'PLAYING'"
            @click="finishSeason(scope.row)"
            >结束</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { simplePost } from '@/util/Request'
import { stockUrlPre } from '@/util/Constant'
import { SessionKey } from '@/util/AlUtil'
import type { SeasonVo } from '@/types/stock'

const seasons = ref<SeasonVo[]>([])
const loading = ref(false)
const createName = ref('')
const createFund = ref('')
const createVisible = ref(false)

function init() {
  loading.value = true
  simplePost(stockUrlPre + 'season/list')
    .then((data: SeasonVo[]) => {
      seasons.value = data
    })
    .finally(() => (loading.value = false))
}

function openCreate() {
  createName.value = ''
  createFund.value = ''
  createVisible.value = true
}

function confirmCreate() {
  if (!createName.value) {
    return
  }
  const param: Record<string, unknown> = { name: createName.value }
  if (createFund.value) {
    param.initialFund = Number(createFund.value)
  }
  simplePost(stockUrlPre + 'season/create', param)
    .then(() => {
      createVisible.value = false
      init()
    })
    .catch((e) => console.error('[StockSeason] create failed', e))
}

function botMatch() {
  const name = window.prompt('请输入对战名称', '机器人对战') || '机器人对战'
  simplePost(stockUrlPre + 'season/bot-match', { name })
    .then((data: SeasonVo) => {
      sessionStorage.setItem(SessionKey.stockSeasonId, String(data.id))
      init()
    })
    .catch((e) => console.error('[StockSeason] botMatch failed', e))
}

function joinSeason(row: SeasonVo) {
  const playerName = sessionStorage.getItem(SessionKey.stockPlayerName) || ''
  if (!playerName) {
    window.prompt && (window as any).prompt('请输入玩家昵称')
  }
  simplePost(stockUrlPre + 'season/join', { seasonId: row.id, playerName }).then((data: SeasonVo) => {
    sessionStorage.setItem(SessionKey.stockSeasonId, String(data.id))
    if (playerName) {
      sessionStorage.setItem(SessionKey.stockPlayerName, playerName)
    }
    init()
  })
}

function startSeason(row: SeasonVo) {
  simplePost(stockUrlPre + 'season/start', { seasonId: row.id }).then(() => init())
}

function advanceDay(row: SeasonVo) {
  simplePost(stockUrlPre + 'season/advance', { seasonId: row.id }).then(() => init())
}

function finishSeason(row: SeasonVo) {
  simplePost(stockUrlPre + 'season/finish', { seasonId: row.id }).then(() => init())
}

onMounted(init)
</script>

<style scoped>
.el-row {
  margin-bottom: 8px;
}
</style>
