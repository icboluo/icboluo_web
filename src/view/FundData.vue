<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input v-model="fundId" placeholder="please input fund id"></el-input>
      </el-col>
      <el-col :span="6">
        <div class="block">
          <span class="demonstration">带快捷选项</span>
          <el-date-picker
            v-model="intervalDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </el-col>
      <el-col :span="6">
        <el-input v-model="chooseDate" placeholder="please input compare date"></el-input>
      </el-col>
      <el-col :span="6">
        <el-select v-model="chooseDateLength" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-button type="primary" plain @click="initCal">
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
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            const end1 = new Date(+new Date(end)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
            const start1 = new Date(+new Date(start)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
            picker.$emit('pick', [start1, end1])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            const end1 = new Date(+new Date(end)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
            const start1 = new Date(+new Date(start)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
            picker.$emit('pick', [start1, end1])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            const end1 = new Date(+new Date(end)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
            const start1 = new Date(+new Date(start)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
            picker.$emit('pick', [start1, end1])
          }
        }]
      },
      intervalDate: '',
      options: [{
        value: '1',
        label: '1天'
      }, {
        value: '2',
        label: '2天'
      }, {
        value: '3',
        label: '3天'
      }, {
        value: '4',
        label: '4天'
      }, {
        value: '5',
        label: '5天'
      }],
      chooseDate: null,
      chooseDateLength: null
    }
  },
  methods: {
    init () {
      this.$axios.get(Common.fundUrlPre + '/fundData/init',
        {
          params: {
            fundId: this.fundId,
            pageNum: this.currentPage,
            startDate: this.intervalDate[0],
            endDate: this.intervalDate[1],
            chooseDateLength: this.chooseDateLength,
            chooseDate: this.chooseDate
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
          params: {
            fundId: this.fundId,
            startDate: this.intervalDate[0],
            endDate: this.intervalDate[1]
          }
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
    },
    initCal () {
      this.init()
      this.cal()
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
