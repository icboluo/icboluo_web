<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="block">
          <span class="demonstration">收益计算日期（默认一年</span>
          <el-date-picker
            v-model="initPar.date"
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
    </el-row>
    <el-button type="primary" plain @click="init">
      搜索
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">

      <el-table-column
        label="基金id"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">{{ scope.row.id }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="基金名称"
        width="180">
      </el-table-column>

      <span v-for="(it,idx) in 5" :key="it">
       <el-table-column
         prop="avgMap"
         label="`年${(it)}平均值`"
         width="180">
        <template slot-scope="avg">
          <span v-for="(item,index) in avg.row.avgMap" v-if="index===idx+''" :key="item">
            {{ item }}
          </span>
        </template>
        </el-table-column>
      </span>
      <el-table-column
        prop="tenAvg"
        label="最近10天平均值"
        width="180">
      </el-table-column>
      <el-table-column
        prop="fixedInvestmentIncome"
        label="万份定投收益"
        width="180">
      </el-table-column>
      <el-table-column
        prop="totalDay"
        label="定投总天数"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lossInvestmentIncome"
        label="万份亏损投入收益"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lossTotalDay"
        label="亏损投入总天数"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lossRatioIncome"
        label="万份亏损比率投入收益"
        width="180">
      </el-table-column>
      <el-table-column
        prop="bigLossIncome"
        label="万份大亏损时收益"
        width="180">
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageRes.total"
        @current-change="init()"
        :current-page.sync="pageQuery.pageNum">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Common, {getRequest} from '../components/Common'

export default {
  data () {
    return {
      tableData: [],
      initPar: {
        date: null
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
      fundDataRet: {
        list: null,
        thisPageAvg: null
      },
      pageRes: {
        total: 1000,
        pageSize: 10,
        pageNum: 1
      },
      pageQuery: {
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  methods: {
    init () {
      let params = {}
      params.fundId = this.fundId
      if (this.initPar.date) {
        params.startDate = this.initPar.date[0]
        params.endDate = this.initPar.date[1]
      }
      params.pageNum = this.pageQuery.pageNum
      params.pageSize = this.pageQuery.pageSize
      getRequest(
        Common.fundUrlPre + '/fundAttention/init',
        params
      ).then(r => {
        this.tableData = r.list
        this.pageRes.pageNum = r.pageNum
        this.pageRes.pageSize = r.pageSize
        this.pageRes.total = r.total
      })
    },
    handleClick (row) {
      this.$router.push(
        {
          path: '/fundData',
          query: {
            fundId: row.id
          }
        }
      )
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>

</style>
