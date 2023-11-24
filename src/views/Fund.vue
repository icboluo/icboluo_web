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
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-button type="primary" plain @click="init"> 搜索</el-button>
    <base-table
      :table-info="tableInfo"
      :page-info="pageInfo"
      @init="init1"
    >
      <template v-slot:buttonSlot="id">
        <el-button @click="handleClick(id.fieldVal)" link type="primary" size="small">
          {{ id.fieldVal }}
        </el-button>
      </template>
    </base-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { simpleGetPage } from "@/util/Request";
import constant from "@/util/Constant";
import type { PageInfo, TableInfo } from "@/components/BaseTable.vue";
import BaseTable from "@/components/BaseTable.vue";

const initPar = reactive({
  date: null
});
const tableInfo = reactive<TableInfo>({
  header: [
    {
      fieldName: "id",
      showName: "基金id",
      isButtonSlot: true
    },
    {
      fieldName: "name",
      showName: "基金名称"
    },
    {
      fieldName: "tenAvg",
      showName: "最近10天平均值"
    },
    {
      fieldName: "avgMap2",
      showName: "`年${(it)}平均值`"
    },
    {
      fieldName: "fixedInvestmentIncome",
      showName: "万份定投收益"
    },
    {
      fieldName: "totalDay",
      showName: "定投总天数"
    },
    {
      fieldName: "lossInvestmentIncome",
      showName: "万份亏损投入收益"
    },
    {
      fieldName: "lossTotalDay",
      showName: "亏损投入总天数"
    },
    {
      fieldName: "lossRatioIncome",
      showName: "万份亏损比率投入收益"
    },
    {
      fieldName: "bigLossIncome",
      showName: "万份大亏损时收益"
    }
  ],
  data1: []
});

const pickerOptions = reactive({
  shortcuts: [
    {
      text: "最近一周",
      onClick(picker: any) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近一个月",
      onClick(picker: any) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近三个月",
      onClick(picker: any) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit("pick", [start, end]);
      }
    }
  ]
});

const pageInfo = reactive<PageInfo>({
  total: 1000,
  pageSize: 5,
  pageNum: 1
});
const router = useRouter();

async function init() {
  const param: any = {};
  if (initPar.date) {
    param.startDate = initPar.date[0];
    param.endDate = initPar.date[1];
  }
  let res = await simpleGetPage(constant.fundUrlPre + "/fundAttention/init", pageInfo, param);
  tableInfo.data1 = res.list.map((item: any) => ({
    ...item,
    avgMap2: item.avgMap[2]
  }));
}

function init1() {
  init();
}

function handleClick(id: any) {
  router.push({
    path: "/fundData",
    query: {
      fundId: id
    }
  });
}

onMounted(() => {
  init();
});
</script>

<style scoped></style>
