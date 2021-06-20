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

    <el-row>
      <el-col v-for="(item,index) in selectByFiledRes" :span="24">
        <div class="grid-content bg-purple-light">
          res {{ index }} {{ item }}
        </div>
      </el-col>
    </el-row>
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
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="problem"
        label="问题"
        width="200">
      </el-table-column>
      <el-table-column
        prop="result"
        label="结果">
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
        prop="shouldFinishTime"
        label="应该完成时间"
        width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Common from '../components/Common'

export default {
  data () {
    return {
      timeNoteAmount: {},
      weekTimeAmount: {},
      monthTimeAmount: {},
      totalTimeAmount: {},
      input: null,
      selectByFiledRes: [],
      tableData: [],
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
      this.$axios.get(Common.noteUrlPre + '/timeNote/init',
        {
          params: {}
        }
      )
        .then(r => {
          const data = r.data.data
          this.tableData = data.list
        }).catch(function (error) {
          console.log(error)
        })
    },
    selectAmount () {
      this.$axios.get(Common.noteUrlPre + '/timeNote/selectAmount',
        {
          params: {}
        }
      )
        .then(r => {
          const data = r.data.data
          this.timeNoteAmount = data.timeNoteAmount
          this.weekTimeAmount = data.weekTimeAmount
          this.monthTimeAmount = data.monthTimeAmount
          this.totalTimeAmount = data.totalTimeAmount
        }).catch(function (error) {
          console.log(error)
        })
    },
    selectByFiled () {
      this.$axios.get(Common.noteUrlPre + '/timeNote/selectByFiled',
        {
          params: {filed: this.input}
        }
      )
        .then(r => {
          this.selectByFiledRes = r.data.data
        }).catch(function (error) {
          console.log(error)
        })
    },
    add () {
      this.$axios.get(Common.noteUrlPre + '/timeNote/add',
        {
          params: {
            problem: this.addParam.problem,
            result: this.addParam.result,
            belongToScope: this.addParam.belongToScope
          }
        }
      )
        .then(r => {
          console.log(r)
        }).catch(function (error) {
          console.log(error)
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
