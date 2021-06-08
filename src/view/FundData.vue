<template>
  <div>
    <el-input v-model="fundId" placeholder="请输入内容"></el-input>
    <el-button type="primary" plain @click="init">
      搜索
    </el-button>
    <el-button type="primary" plain @click="cal">
      计算
    </el-button>

    <div>
      incrIncr {{view.incrIncr}}
    </div>
    <div>
      incrDecr {{view.incrDecr}}
    </div>
    <div>
      decrIncr {{view.decrIncr}}
    </div>
    <div>
      decrDecr {{view.decrDecr}}
    </div>

    count {{ view.count }}
    max {{ view.max }}
    min {{ view.min }}
    avg {{ view.avg }}
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
        prop="netAssetValue"
        label="单位净值">
      </el-table-column>
      <el-table-column
        prop="netValueCumulative"
        label="累计净值">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间">
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        layout="prev, pager, next"
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
        decrDecr: null
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
    }
  },
  mounted () {
    this.init()
    this.cal()
  }
}
</script>
<style scoped>

</style>
