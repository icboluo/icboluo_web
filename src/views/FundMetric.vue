<template>
  <el-input v-model="input"></el-input>
  <el-button @click="click"></el-button>

  <el-row v-for="(row, rowIndex) in data" :key="row" :gutter="16">
    <el-col v-for="(cell, lineIndex) in row" :key="cell" :span="6">
      <div class="statistic-card">
        <div style="display: flex; align-items: center">
          <el-popover placement="right" :width="400" trigger="click">
            <template #reference>
              <el-button style="margin-right: 16px">Click to activate</el-button>
            </template>
            <el-table :data="cell.dataList">
              <el-table-column width="150" property="netValueDate" label="date" />
              <el-table-column width="100" property="increaseRateDay" label="日增长率" />
              <el-table-column width="300" property="address" label="address" />
            </el-table>
            <div v-for="row in cell.doubleDataList" :key="row[0].fundId">
              <el-table :data="row">
                <el-table-column width="150" property="netValueDate" label="date" />
                <el-table-column width="100" property="increaseRateDay" label="日增长率" />
                <el-table-column width="300" property="address" label="address" />
              </el-table>
            </div>
          </el-popover>
        </div>
        <el-statistic
          :value="cell.number"
          @click="a"
          :formatter="(b: any) => (b == null ? 0 : b.toString())"
          :value-style="{ color: cell.numberClass }"
        >
          <template #title>
            <div style="display: inline-flex; align-items: center">
              {{ cell.desc }}
              <el-tooltip effect="dark" :content="cell.metricName" placement="top">
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-statistic>

        <div v-for="smallRow in cell.itemList" :key="smallRow.id">
          <div class="statistic-footer">
            <div class="footer-item">
              <span>{{ smallRow.id }}</span>
              <span :class="smallRow.class">
                {{ smallRow.name }}
                <el-icon>
                  <CaretTop />
                </el-icon>
              </span>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <el-divider />
  </el-row>
</template>

<script lang="ts" setup>
import { CaretTop, Warning } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { toDoubleArray2 } from '@/util/AlUtil'
import { simplePost } from '@/util/Request'
import constant from '@/util/Constant'

interface FundData {
  id: number
  /**
   * 基金id
   */
  fundId: string
  /**
   * 日增长率
   */
  increaseRateDay: number
  /**
   * 申购状态
   */
  subscribeStatus: string
  /**
   * 净值日期
   */
  netValueDate: string
  /**
   * 单位净值
   */
  netAssetValue: number
  /**
   * 累计净值
   */
  netValueCumulative: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新时间
   */
  updateTime: string
}

interface C {
  id: string
  name: number
  class: string
}

interface F {
  dataList: FundData[]
  doubleDataList: FundData[][]
  metricName: string
  desc: string
  number: any
  itemList: C[]
  numberClass: string
}

let input = ref('')
// 数组此块使用 reactive 是非响应式的
let data = ref<F[][]>([])

async function click() {
  let param = {
    fundId: '161725'
  }
  let metric = await simplePost(constant.fundUrlPre + '/fundAttention/fundWeight', param)
  metric.forEach((cell: F) => {
    cell.numberClass = calColor(cell.number)
    cell.itemList.forEach((item) => {
      item.class = calColor(item.name)
    })
  })
  data.value = toDoubleArray2(metric, 4)
}

function calColor(val: number): string {
  if (val == null || val === 0) {
    return 'grey'
  } else {
    return val < 0 ? 'green' : 'red'
  }
}

function a() {}
</script>

<style scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}

.grey {
  color: var(--el-text-color-regular);
}
</style>
