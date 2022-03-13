<template>
  <div>
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple-dark">
          totalTimeAmount {{ totalTimeAmount }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-dark">
          timeNoteAmount {{ timeNoteAmount }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-dark">
          weekTimeAmount {{ weekTimeAmount }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-dark">
          monthTimeAmount {{ monthTimeAmount }}
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-input v-model="input" placeholder="万能查询"></el-input>
        </div>
      </el-col>
    </el-row>

    <!--    <el-row>
          <el-col v-for="(item,index) in selectByFiledRes" :span="24">
            <div class="grid-content bg-purple-light">
              res {{ index }} {{ item }}
            </div>
          </el-col>
        </el-row>-->
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple-dark">
          <el-input v-model="addParam.problem" placeholder="problem"></el-input>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-dark">
          <el-input v-model="addParam.result" placeholder="result"></el-input>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-dark">
          <el-input v-model="addParam.belongToScope" placeholder="belongToScope"></el-input>
        </div>
      </el-col>
    </el-row>

    <el-button type="primary" @click="selectByFiled">selectByFiled</el-button>
    <el-button type="primary" @click="add">add</el-button>

    <el-table
      :data="tableData.list"
      style="width: 100%">
      <el-table-column
        prop="problem"
        label="问题"
        width="200">
      </el-table-column>
      <el-table-column
        prop="result"
        label="结果">
        <template slot-scope="scope">
          <div v-if="scope.row.shouRes">
            <el-button @click="result" type="text" size="small">
              {{ scope.row.result }}
            </el-button>
          </div>
          <div v-else>
            <button @click="result(scope.$index,scope.row)">result</button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="finishTime"
        label="完成次数"
        width="180">
      </el-table-column>
      <el-table-column
        prop="belongToScope"
        label="所属范围"
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="type"
        width="100">
      </el-table-column>
      <el-table-column
        prop="shouldFinishTime"
        label="应该完成时间"
        width="180">
      </el-table-column>
      <el-table-column
        label="finish"
        width="100">
        <template slot-scope="scope">
          <el-button @click="finish(scope.row)" type="text" size="small">
            {{ scope.row.id }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="onlyUpdate"
        width="110">
        <template slot-scope="scope">
          <el-button @click="onlyUpdate(scope.row)" type="text" size="small">
            {{ scope.row.id }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="notFinish"
        width="100">
        <template slot-scope="scope">
          <el-button @click="notFinish(scope.row)" type="text" size="small">
            {{ scope.row.id }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="onlyRead"
        width="100">
        <template slot-scope="scope">
          <el-button @click="onlyRead(scope.row)" type="text" size="small">
            {{ scope.row.id }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @current-change="handlerCurChange"
        :current-page.sync="dataParam.currentPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>

import Common, {getRequest} from '../components/Common'

export default {
  data () {
    return {
      timeNoteAmount: {},
      weekTimeAmount: {},
      monthTimeAmount: {},
      totalTimeAmount: {},
      input: null,
      selectByFiledRes: [],
      tableData: {
        total: 1000,
        list: null,
        thisPageAvg: null
      },
      dataParam: {
        currentPage: 1,
        // 区间日期
        intervalDate: '',
        chooseDate: null,
        chooseDateLength: null
      },
      total: 1000,
      addParam: {
        problem: null,
        result: null,
        belongToScope: null
      }
    }
  },
  mounted () {
    this.selectAmount()
    this.init()
  },
  methods: {
    init () {
      getRequest(
        Common.noteUrlPre + '/timeNote/init',
        {
          pageNum: this.dataParam.currentPage
        }
      ).then(r => {
        this.tableData.list = r.list
        this.total = r.total
        this.tableData.total = r.total
        this.tableData.thisPageAvg = r.thisPageAvg
      })
    },
    selectAmount () {
      getRequest(
        Common.noteUrlPre + '/timeNote/selectAmount',
        {
          params: {}
        }
      ).then(r => {
        this.timeNoteAmount = r.timeNoteAmount
        this.weekTimeAmount = r.weekTimeAmount
        this.monthTimeAmount = r.monthTimeAmount
        this.totalTimeAmount = r.totalTimeAmount
      })
    },
    selectByFiled () {
      getRequest(
        Common.noteUrlPre + '/timeNote/selectByFiled',
        {
          params: {filed: this.input}
        }
      ).then(r => {
        this.selectByFiledRes = r.data
      })
    },
    public: function (row, url) {
      getRequest(
        Common.noteUrlPre + url,
        {
          params: {type: row.type, id: row.id}
        }
      ).then(r => {
        this.message = r.message
        this.code = r.code
      })
    },
    finish: function (row) {
      this.public(row, '/timeNote/updateFinishTime')
      // 刷新页面
      location.reload()
    },
    onlyUpdate: function (row) {
      this.public(row, '/timeNote/onlyUpdateTime')
      location.reload()
    },
    notFinish: function (row) {
      this.public(row, '/timeNote/updateNotFinishTime')
      location.reload()
    },
    onlyRead: function (row) {
      this.public(row, '/timeNote/toOnlyRead')
      location.reload()
    },
    result: function (index, row) {
      row.shouRes = true
      // 刷新单行单元格
      this.$set(this.tableData.list, index, row)
    },
    handlerCurChange (val) {
      this.init()
    },
    add () {
      getRequest(
        Common.noteUrlPre + '/timeNote/add',
        {
          params: {
            problem: this.addParam.problem,
            result: this.addParam.result,
            belongToScope: this.addParam.belongToScope
          }
        }
      ).then(r => {
        console.log(r)
      })
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;

&
:last-child {
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
