<template>
  <div>
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple-dark">totalTimeAmount {{ amount.totalTimeAmount }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-dark">timeNoteAmount {{ amount.timeNoteAmount }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-dark">weekTimeAmount {{ amount.weekTimeAmount }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-dark">monthTimeAmount {{ amount.monthTimeAmount }}</div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-input v-model="universalQuery" placeholder="万能查询"></el-input>
        </div>
      </el-col>
    </el-row>

    <el-button type="primary" @click="selectByFiled">selectByFiled</el-button>
    <el-button type="primary" @click="init">init</el-button>

    <el-popover placement="right" width="800" trigger="click">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple-dark">
            <el-input v-model="addParam.problem" placeholder="problem"></el-input>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple-dark">
            <el-input v-model="addParam.result" placeholder="result"></el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-dark">
            <el-input v-model="addParam.belongToScope" placeholder="belongToScope"></el-input>
          </div>
        </el-col>
      </el-row>
      <!--      此块怎么做局部变量使用，只有新增一处使用到了这个变量-->
      <el-button
        type="primary"
        @click="add(addParam.problem, addParam.result, addParam.belongToScope)"
        >add
      </el-button>
      <el-button slot="reference">add</el-button>
    </el-popover>

    <el-table :data="tableList" :row-class-name="TableUtil.tableAddSerialNum" style="width: 100%">
      <el-table-column prop="index" label="序号" width="100">
        <template v-slot="scope">
          <el-popover placement="right" width="800" trigger="click">
            <el-row>
              <el-col :span="8">
                <div class="grid-content bg-purple-dark">
                  <el-input v-model="scope.row.problem" placeholder="problem"></el-input>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple-dark">
                  <el-input v-model="scope.row.result" placeholder="result"></el-input>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple-dark">
                  <el-input
                    v-model="scope.row.belongToScope"
                    placeholder="belongToScope"
                  ></el-input>
                </div>
              </el-col>
            </el-row>
            <!--      此块怎么做局部变量使用，只有新增一处使用到了这个变量-->
            <el-button type="primary" @click="update(scope.row)">update</el-button>
            <el-button slot="reference">{{ scope.row.index }}</el-button>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="problem" label="问题" width="200"></el-table-column>
      <el-table-column prop="result" label="结果">
        <template v-slot="scope">
          <div v-if="scope.row.shouRes">
            <el-button @click="result" type="text" size="small">
              {{ scope.row.result }}
            </el-button>
          </div>
          <div v-else>
            <button @click="result(scope.$index, scope.row)">result</button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="finishTime" label="完成次数" width="180"></el-table-column>
      <el-table-column prop="belongToScope" label="所属范围" width="180"></el-table-column>
      <el-table-column prop="type" label="type" width="100"></el-table-column>
      <el-table-column prop="shouldFinishTime" label="应该完成时间" width="180"></el-table-column>
      <el-table-column label="finish" width="100">
        <template v-slot="scope">
          <el-button @click="finish(scope.row)" type="text" size="small">
            {{ scope.row.id }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="onlyUpdate" width="110">
        <template v-slot="scope">
          <el-button @click="onlyUpdate(scope.row)" type="text" size="small">
            {{ scope.row.id }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="notFinish" width="100">
        <template v-slot="scope">
          <el-button @click="notFinish(scope.row)" type="text" size="small">
            {{ scope.row.id }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="onlyRead" width="100">
        <template v-slot="scope">
          <el-button @click="onlyRead(scope.row)" type="text" size="small">
            {{ scope.row.id }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageRes.total"
        @current-change="handlerCurChange"
        :current-page.sync="dataParam.currentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import TableUtil from '@/components/TableUtil.vue'
import constant from '@/util/Constant'
import { reactive, ref } from 'vue'
import request from '@/util/Request'
// 数量
let amount = reactive({
  timeNoteAmount: {},
  weekTimeAmount: {},
  monthTimeAmount: {},
  totalTimeAmount: {}
})
// 万能查询
const universalQuery = ref()
// 列表
let tableList = ref()
const dataParam = reactive({
  currentPage: 1,
  // 区间日期
  intervalDate: '',
  chooseDate: null,
  chooseDateLength: null
})
const addParam = reactive({
  problem: null,
  result: null,
  belongToScope: null
})
const pageRes = reactive({
  total: 1000,
  pageSize: 10,
  pageNum: 1
})
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})

async function mounted() {
  selectAmount()
  init()
}

async function init() {
  const data = await request.simpleGet(constant.noteUrlPre + '/timeNote/init', {
    pageNum: dataParam.currentPage
  })
  tableList = data.list
  pageRes.total = data.total
}

async function selectAmount() {
  const data = await request.simpleGet(constant.noteUrlPre + '/timeNote/selectAmount', {})
  amount = data
}

async function selectByFiled() {
  const data = await request.simpleGet(constant.noteUrlPre + '/timeNote/selectByFiled', {
    filed: universalQuery
  })
  tableList = data
}

async function publi(row, url) {
  const data = await request.simpleGet(constant.noteUrlPre + url, {
    type: row.type,
    id: row.id
  })
  message = data.message
  code = data.code
}

async function finish(row) {
  publi(row, '/timeNote/updateFinishTime')
  // 刷新页面
  location.reload()
}

async function onlyUpdate(row) {
  publi(row, '/timeNote/onlyUpdateTime')
  location.reload()
}

async function notFinish(row) {
  publi(row, '/timeNote/updateNotFinishTime')
  location.reload()
}

async function onlyRead(row) {
  publi(row, '/timeNote/toOnlyRead')
  location.reload()
}

async function result(index, row) {
  row.shouRes = true
  // 刷新单行单元格
  this.$set(tableList, index, row)
}

async function handlerCurChange() {
  init()
}

async function add(problem, result, belongToScope) {
  const data = request.simpleGet(constant.noteUrlPre + '/timeNote/add', {
    problem: problem,
    result: result,
    belongToScope: belongToScope
  })
  console.log(data)
}

async function update(row) {
  const data = request.get(constant.noteUrlPre + '/timeNote/update', {
    problem: row.problem,
    result: row.result,
    belongToScope: row.belongToScope,
    type: row.type,
    id: row.id
  })
  console.log(data)
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;

  & :last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
