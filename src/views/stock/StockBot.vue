<template>
  <div>
    <el-row :gutter="12" align="middle">
      <el-col :span="8">
        <el-select v-model="seasonId" placeholder="选择赛季">
          <el-option v-for="s in seasons" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="loadAll">加载策略</el-button>
      </el-col>
    </el-row>

    <el-tabs style="margin-top: 16px">
      <el-tab-pane label="机器人管理">
        <el-card header="预置机器人" style="margin-top: 16px">
          <el-table :data="presets" style="width: 100%">
            <el-table-column prop="botName" label="名称" width="140" />
            <el-table-column prop="buyStrategyName" label="买入策略" width="160" />
            <el-table-column prop="sellStrategyName" label="卖出策略" width="160" />
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button size="small" @click="usePreset(scope.row)">选用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card header="组合机器人" style="margin-top: 16px">
          <el-table :data="composes" style="width: 100%">
            <el-table-column prop="botName" label="名称" width="140" />
            <el-table-column prop="buyStrategyName" label="买入策略" width="160" />
            <el-table-column prop="sellStrategyName" label="卖出策略" width="160" />
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button size="small" type="danger" @click="deleteCompose(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card header="新建组合机器人" style="margin-top: 16px">
          <el-row :gutter="12" align="middle">
            <el-col :span="5">
              <el-input v-model="form.name" placeholder="机器人名称" />
            </el-col>
            <el-col :span="5">
              <el-select v-model="form.buyStrategyId" placeholder="买入策略">
                <el-option v-for="s in buyStrategies" :key="s.id" :label="s.name" :value="s.id" />
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select v-model="form.sellStrategyId" placeholder="卖出策略">
                <el-option v-for="s in sellStrategies" :key="s.id" :label="s.name" :value="s.id" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button type="success" @click="createCompose">创建</el-button>
            </el-col>
          </el-row>
          <el-alert
            v-if="buyStrategies.length && form.buyStrategyId"
            style="margin-top: 12px"
            :title="selectedBuyDesc"
            type="info"
            :closable="false"
          />
          <el-alert
            v-if="sellStrategies.length && form.sellStrategyId"
            style="margin-top: 12px"
            :title="selectedSellDesc"
            type="info"
            :closable="false"
          />
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="策略介绍">
        <el-tabs>
          <el-tab-pane label="买入策略">
            <el-row :gutter="16">
              <el-col :span="8">
                <el-menu :default-active="introBuyId" @select="(id: string) => (introBuyId = id)">
                  <el-menu-item v-for="s in buyStrategies" :key="s.id" :index="s.id">
                    {{ s.name }}
                  </el-menu-item>
                </el-menu>
              </el-col>
              <el-col :span="16">
                <div v-if="selectedBuy">
                  <h4>{{ selectedBuy.name }}</h4>
                  <p><strong>描述：</strong>{{ selectedBuy.description }}</p>
                  <h5>参数说明</h5>
                  <el-table :data="selectedBuy.params" style="width: 100%">
                    <el-table-column prop="label" label="参数" width="140" />
                    <el-table-column prop="description" label="说明" />
                    <el-table-column prop="type" label="类型" width="100" />
                    <el-table-column prop="defaultValue" label="默认值" width="100" />
                  </el-table>
                </div>
                <el-empty v-else description="请选择左侧买入策略" />
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="卖出策略">
            <el-row :gutter="16">
              <el-col :span="8">
                <el-menu :default-active="introSellId" @select="(id: string) => (introSellId = id)">
                  <el-menu-item v-for="s in sellStrategies" :key="s.id" :index="s.id">
                    {{ s.name }}
                  </el-menu-item>
                </el-menu>
              </el-col>
              <el-col :span="16">
                <div v-if="selectedSell">
                  <h4>{{ selectedSell.name }}</h4>
                  <p><strong>描述：</strong>{{ selectedSell.description }}</p>
                  <h5>参数说明</h5>
                  <el-table :data="selectedSell.params" style="width: 100%">
                    <el-table-column prop="label" label="参数" width="140" />
                    <el-table-column prop="description" label="说明" />
                    <el-table-column prop="type" label="类型" width="100" />
                    <el-table-column prop="defaultValue" label="默认值" width="100" />
                  </el-table>
                </div>
                <el-empty v-else description="请选择左侧卖出策略" />
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { simplePost } from '@/util/Request'
import { stockUrlPre } from '@/util/Constant'
import { SessionKey } from '@/util/AlUtil'
import type { PresetBotVo, SeasonVo, StrategyVo } from '@/types/stock'

const seasons = ref<SeasonVo[]>([])
const seasonId = ref<number>()

const buyStrategies = ref<StrategyVo[]>([])
const sellStrategies = ref<StrategyVo[]>([])
const presets = ref<PresetBotVo[]>([])
const composes = ref<PresetBotVo[]>([])

const form = reactive({
  name: '',
  buyStrategyId: '',
  sellStrategyId: '',
  buyParams: '',
  sellParams: ''
})

const selectedBuyDesc = computed(
  () => buyStrategies.value.find((s) => s.id === form.buyStrategyId)?.description || ''
)
const selectedSellDesc = computed(
  () => sellStrategies.value.find((s) => s.id === form.sellStrategyId)?.description || ''
)

// 策略介绍页签选中的策略（独立于新建表单的选择）
const introBuyId = ref('')
const introSellId = ref('')
const selectedBuy = computed(() => buyStrategies.value.find((s) => s.id === introBuyId.value))
const selectedSell = computed(() => sellStrategies.value.find((s) => s.id === introSellId.value))

function currentSeasonId() {
  return seasonId.value ?? Number(sessionStorage.getItem(SessionKey.stockSeasonId))
}

function loadAll() {
  const sid = currentSeasonId()
  if (!sid) {
    return
  }
  simplePost(stockUrlPre + 'bot-strategy/buy/list').then((d: StrategyVo[]) => {
    buyStrategies.value = d
    if (d.length) introBuyId.value = d[0].id
  })
  simplePost(stockUrlPre + 'bot-strategy/sell/list').then((d: StrategyVo[]) => {
    sellStrategies.value = d
    if (d.length) introSellId.value = d[0].id
  })
  simplePost(stockUrlPre + 'bot-strategy/preset/list').then(
    (d: PresetBotVo[]) => (presets.value = d)
  )
  simplePost(stockUrlPre + 'bot-strategy/compose/list', { seasonId: sid }).then(
    (d: PresetBotVo[]) => (composes.value = d)
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
    loadAll()
  })
}

function usePreset(row: PresetBotVo) {
  form.name = row.botName
  form.buyStrategyId = row.buyStrategyId
  form.sellStrategyId = row.sellStrategyId
  form.buyParams = row.buyParams || ''
  form.sellParams = row.sellParams || ''
}

function createCompose() {
  const sid = currentSeasonId()
  if (!sid || !form.name || !form.buyStrategyId || !form.sellStrategyId) {
    return
  }
  const param = {
    name: form.name,
    buyStrategyId: form.buyStrategyId,
    sellStrategyId: form.sellStrategyId,
    seasonId: sid
  }
  if (form.buyParams) (param as any).buyParams = form.buyParams
  if (form.sellParams) (param as any).sellParams = form.sellParams
  simplePost(stockUrlPre + 'bot-strategy/compose', param).then(() => loadAll())
}

function deleteCompose(row: PresetBotVo) {
  if (row.id == null) {
    return
  }
  simplePost(stockUrlPre + 'bot-strategy/compose/' + row.id, {}).then(() => loadAll())
}

onMounted(loadSeasons)
</script>

<style scoped></style>
