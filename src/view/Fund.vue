<template>
  <div>
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

      <span v-for="(it,ind) in 5">
       <el-table-column
                prop="avgMap"
                label="平均值"
                width="180">
        <template slot-scope="avg">
          <span v-for="(item,index) in avg.row.avgMap" v-if="index===ind+''">
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

    </el-table>
  </div>
</template>

<script>
import Common from '../components/Common'

export default {
  data () {
    return {
      tableData: [],
      total: 1000
    }
  },
  methods: {
    init () {
      this.$axios.get(Common.fundUrlPre + '/fundAttention/init',
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
