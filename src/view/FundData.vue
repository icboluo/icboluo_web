<template>
  <div>
    <el-input v-model="fundId" placeholder="请输入内容"></el-input>
    <el-button type="primary" plain @click="init">
      搜索
    </el-button>
    <el-input v-model="simCal.source" placeholder="请输入source"></el-input>
    <el-input v-model="simCal.target" placeholder="请输入target"></el-input>
    <el-button type="primary" plain @click="httpSimCal">
      计算增长率 {{ simCal.res }}
    </el-button>

    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          max {{ view.max }}
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          min {{ view.min }}
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          avg {{ view.avg }}
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          incrIncr {{ view.incrIncr }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          incrDecr {{ view.incrDecr }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          decrIncr {{ view.decrIncr }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          decrDecr {{ view.decrDecr }}
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!--      一行总长24，平均分成5份-->
      <el-col :span="5">
        <div class="grid-content bg-purple">
          monday {{ view.weekMap.MONDAY }}
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          tuesday {{ view.weekMap.TUESDAY }}
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          wednesday {{ view.weekMap.WEDNESDAY }}
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          thursday {{ view.weekMap.THURSDAY }}
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          friday {{ view.weekMap.FRIDAY }}
        </div>
      </el-col>
    </el-row>

    <el-table
      :data="tableData"
      style="width: 100%">

      <el-table-column
        prop="fundId"
        label="基金id">
      </el-table-column>
      <el-table-column
        prop="fundName"
        label="基金名称">
      </el-table-column>
      <el-table-column
        prop="increaseRateDay"
        label="日增长率">
      </el-table-column>
      <el-table-column
        prop="netValueDate"
        label="净值日期">
      </el-table-column>
      <el-table-column
        prop="dayOfWeek"
        label="星期">
      </el-table-column>
      <el-table-column
        prop="netAssetValue"
        label="单位净值">
      </el-table-column>
      <el-table-column
        prop="netValueCumulative"
        label="累计净值">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间">
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @current-change="handlerCurChange"
        :current-page.sync="currentPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Common from '../components/Common'

export default {
  data () {
    return {
      tableData: [],
      fundId: this.$route.query.fundId,
      currentPage: 1,
      total: 1000,
      view: {
        count: null,
        min: null,
        max: null,
        avg: null,
        incrIncr: null,
        incrDecr: null,
        decrIncr: null,
        decrDecr: null,
        weekMap: {
          MONDAY: null,
          TUESDAY: null,
          WEDNESDAY: null,
          THURSDAY: null,
          FRIDAY: null
        },
        monthMap: null
      },
      simCal: {
        source: null,
        target: null,
        res: null
      }
    }
  },
  methods: {
    init () {
      this.$axios.get(Common.fundUrlPre + '/fundData/init',
        {
          params: {
            fundId: this.fundId,
            pageNum: this.currentPage
          }
        }
      )
        .then(r => {
          const data = r.data.data
          this.tableData = data.list
          this.total = data.total
        }).catch(function (error) {
          console.log(error)
        })
    },
    handlerCurChange (val) {
      this.init()
    },
    cal () {
      this.$axios.get(Common.fundUrlPre + '/fundData/cal',
        {
          params: {fundId: this.fundId}
        }
      )
        .then(r => {
          this.view = r.data.data
        })
    },
    httpSimCal () {
      this.$axios.get(Common.fundUrlPre + '/fundData/simCal',
        {
          params: {
            source: this.simCal.source,
            target: this.simCal.target
          }
        }
      )
        .then(r => {
          this.simCal.res = r.data.data
        })
    }
  },
  mounted () {
    this.init()
    this.cal()
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
