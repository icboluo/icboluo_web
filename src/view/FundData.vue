<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="block">
          <span class="demonstration">带快捷选项</span>
          <el-date-picker
            v-model="fundDataParam.intervalDate"
            value-format="yyyy-MM-dd"
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
        <el-input v-model="fundDataParam.chooseDate" placeholder="please input compare date"></el-input>
      </el-col>
      <el-col :span="6">
        <el-select v-model="fundDataParam.chooseDateLength" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          fund id {{ fundId }}
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          fund name {{ fundInfo.name }}
        </div>
      </el-col>
    </el-row>

    <el-button type="primary" plain @click="initCal">
      搜索
    </el-button>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input v-model="simCal.source" placeholder="请输入source"></el-input>
      </el-col>
      <el-col :span="8">
        <el-input v-model="simCal.target" placeholder="请输入target"></el-input>
      </el-col>
      <el-button type="primary" plain @click="httpSimCal">
        计算增长率 {{ simCal.res }}
      </el-button>
    </el-row>

    <el-row :gutter="20">
      请输入今天增长率
      <el-col :span="8">
        <el-input v-model="todayRate" placeholder="请输入source"></el-input>
      </el-col>
      <el-button type="primary" plain @click="addToday(todayRate)">
        新增
      </el-button>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          max {{ view.max }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          min {{ view.min }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          avg {{ view.avg }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          thisPageAvg {{ fundDataRet.thisPageAvg }}
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!--      一行总长24，平均分成5份-->
      <el-col :span="5">
        <div class="grid-content bg-purple">
          星期一 {{ view.weekMap.MONDAY }}
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          星期二 {{ view.weekMap.TUESDAY }}
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          星期三 {{ view.weekMap.WEDNESDAY }}
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          星期四 {{ view.weekMap.THURSDAY }}
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          星期五 {{ view.weekMap.FRIDAY }}
        </div>
      </el-col>
    </el-row>

    <el-table
      :data="fundDataRet.list"
      :cell-style="set_cell_style"
      style="width: 100%">
      <el-table-column
        prop="netValueDate"
        label="净值日期">
      </el-table-column>
      <el-table-column
        prop="dayOfWeek"
        label="星期">
      </el-table-column>
      <el-table-column
        prop="increaseRateDay"
        label="日增长率">
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
      <el-table-column
        prop="updateTime"
        label="最近10天">
        <template slot-scope="scope">
          <el-button @click="myChooseDate(scope.row)">
            {{ scope.row.id }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="fundDataRet.total"
        @current-change="handlerCurChange"
        :current-page.sync="fundDataParam.currentPage">
      </el-pagination>
    </div>

    <el-row v-for="(row,rowIndex) in parseFindRecentRetRow()" :key="row" :gutter="20">
      <el-col v-for="(line,lineIndex) in parseFindRecentRetLineTotal(rowIndex)" :key="line"
              :span="parseFindRecentRetLine(rowIndex)">
        <!--          长度是3 列的索引是2，需要索引是2-->
        <!--          长度是2 列的索引是1，需要索引是1  需要索引是列的索引-->
        <!--          长度是5 列的索引是1，行的索引是0，需要索引是1-->
        <!--          长度是5 列的索引是1，行的索引是1，需要索引是4  需要索引是列的索引+3*行的索引-->
        <el-table
          :data="findRecentRet[lineIndex+rowIndex*findRecentRetLineNumber]"
          :cell-style="set_cell_style"
          style="width: 100%">
          <el-table-column
            prop="netValueDate"
            label="净值日期">
          </el-table-column>
          <el-table-column
            prop="dayOfWeek"
            label="星期">
          </el-table-column>
          <el-table-column
            prop="increaseRateDay"
            label="日增长率">
          </el-table-column>
        </el-table>
        <span v-if="findRecentRetVal[lineIndex + rowIndex * findRecentRetLineNumber].nextAvg>0 " class="red">
        nextAvg {{ findRecentRetVal[lineIndex + rowIndex * findRecentRetLineNumber].nextAvg }}
        </span>
        <span v-else class="green">
        nextAvg {{ findRecentRetVal[lineIndex + rowIndex * findRecentRetLineNumber].nextAvg }}
        </span>
        avg {{ findRecentRetVal[lineIndex + rowIndex * findRecentRetLineNumber].avg }}
        min {{ findRecentRetVal[lineIndex + rowIndex * findRecentRetLineNumber].min }}
        max {{ findRecentRetVal[lineIndex + rowIndex * findRecentRetLineNumber].max }}
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Common from '../components/Common'

export default {
  data () {
    return {
      todayRate: null,
      fundId: this.$route.query.fundId,
      view: {
        count: null,
        min: null,
        max: null,
        avg: null,
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
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
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

      fundInfo: {
        id: null,
        name: null
      },
      fundDataParam: {
        currentPage: 1,
        // 区间日期
        intervalDate: '',
        chooseDate: null,
        chooseDateLength: null
      },
      fundDataRet: {
        total: 1000,
        list: null,
        thisPageAvg: null
      },
      // 查询最近区间返回值
      findRecentRet: [],
      findRecentRetVal: [],
      findRecentRetLineNumber: 4
    }
  },
  methods: {
    init () {
      this.$axios.get(Common.fundUrlPre + '/fundData/init',
        {
          params: {
            fundId: this.fundId,
            pageNum: this.fundDataParam.currentPage,
            startDate: this.fundDataParam.intervalDate[0],
            endDate: this.fundDataParam.intervalDate[1],
            chooseDateLength: this.fundDataParam.chooseDateLength,
            chooseDate: this.fundDataParam.chooseDate
          }
        }
      )
        .then(r => {
          const data = r.data.data
          this.fundDataRet.list = data.list
          this.fundDataRet.total = data.total
          this.fundDataRet.thisPageAvg = data.thisPageAvg
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
            startDate: this.fundDataParam.intervalDate[0],
            endDate: this.fundDataParam.intervalDate[1]
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
    },
    initFundInfo () {
      this.$axios.get(Common.fundUrlPre + '/fundInfo/fundInfoInit',
        {
          params: {
            id: this.fundId
          }
        }
      )
        .then(r => {
          this.fundInfo = r.data.data
        })
    },
    myChooseDate (row) {
      this.$axios.get(Common.fundUrlPre + '/fundData/findRecentData',
        {
          params: {
            fundId: this.fundId,
            myChooseDate: row.netValueDate
          }
        }
      )
        .then(r => {
          const data = r.data.data
          this.findRecentRet.push(data.list)
          this.findRecentRetVal.push(data)
        })
    },
    /**
     * 计算一共有多少行数据
     * @returns {number}
     */
    parseFindRecentRetRow () {
      const length = this.findRecentRet.length
      return Math.floor((length + this.findRecentRetLineNumber - 1) / this.findRecentRetLineNumber)
    },
    /**
     * 计算一行的宽度
     * @param row
     * @return {number}
     */
    parseFindRecentRetLine (row) {
      const length = this.findRecentRet.length
      // 当前行剩余元素
      const curRowRemainder = length - row * this.findRecentRetLineNumber
      if (curRowRemainder > this.findRecentRetLineNumber) {
        return 24 / this.findRecentRetLineNumber
      } else {
        return 24 / curRowRemainder
      }
    },
    /**
     * 计算列个数
     * @param row
     * @return {number}
     */
    parseFindRecentRetLineTotal (row) {
      const lineTotal = this.parseFindRecentRetLine(row)
      return 24 / lineTotal
    },
    set_cell_style ({row, column}) {
      if (column.label === '日增长率') {
        if (row.increaseRateDay > 0) {
          return 'color:#ff0000'
        } else {
          return 'color:#1ede27'
        }
      }
      // 这里的medicalCommonName指的是在el-table-column定义的prop中的值,并不会走到这里
      if (row.medicalCommonName === 'increaseRateDay') {
        return 'color:#5f0606'
      }
    },
    addToday (rate) {
      this.$axios.get(Common.fundUrlPre + '/fundData/addToday',
        {
          params: {
            fundId: this.fundId,
            rate: rate
          }
        }
      )
    }
  },
  mounted () {
    this.init()
    this.cal()
    this.initFundInfo()
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

.green {
  background: #1ede27;
}

.red {
  background: #ff0000;
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
