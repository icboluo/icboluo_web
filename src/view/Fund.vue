<template>
  <div>
    <el-input v-model="initPar.date" placeholder="查询时间">
    </el-input>
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
        prop="fixedVote"
        label="定投总收益"
        width="180">
      </el-table-column>
      <el-table-column
        prop="totalDay"
        label="总天数"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lossInvestment"
        label="亏损投入总收益"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lossTotalDay"
        label="亏损总天数"
        width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Common, {getRequest} from '../components/Common'

export default {
  data () {
    return {
      tableData: [],
      total: 1000,
      initPar: {
        date: null
      }
    }
  },
  methods: {
    init () {
      getRequest(
        Common.fundUrlPre + '/fundAttention/init',
        {
          fundId: this.fundId,
          pageNum: this.currentPage,
          date: this.initPar.date
        }
      ).then(r => {
        this.tableData = r.list
        this.total = r.total
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
