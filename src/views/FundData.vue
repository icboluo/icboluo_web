<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
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
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
      </el-col>
      <el-col :span="8">
        <el-input
          v-model="fundDataParam.chooseDate"
          placeholder="please input compare date"
        ></el-input>
      </el-col>
      <el-col :span="8">
        <el-select v-model="fundDataParam.chooseDateLength" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content bg-purple">fund id {{ fundId }}</div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">fund name {{ fundInfo.name }}</div>
      </el-col>
    </el-row>

    <el-button type="primary" plain @click="initCal"> 搜索</el-button>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input v-model="simCal.source" placeholder="请输入source"></el-input>
      </el-col>
      <el-col :span="8">
        <el-input v-model="simCal.target" placeholder="请输入target"></el-input>
      </el-col>
      <el-button type="primary" plain @click="httpSimCal"> 计算增长率 {{ simCal.res }}</el-button>
    </el-row>

    <!-- Form -->
    <el-button text @click="dialogFormVisible = true">
      新增
    </el-button>

    <el-dialog v-model="dialogFormVisible" title="Shipping address">
      <el-form :model="form">
        <el-form-item label="请输入今天增长率" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Zones" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="Please select a zone">
            <el-option label="Zone No.1" value="shanghai" />
            <el-option label="Zone No.2" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addToday(form.name)">
          Confirm
        </el-button>
      </span>
      </template>
    </el-dialog>

    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">max {{ view.max }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">min {{ view.min }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">avg {{ view.avg }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">thisPageAvg {{ thisPageAvg }}</div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!--      一行总长24，平均分成5份-->
      <el-col :span="5">
        <div class="grid-content bg-purple">星期一 {{ view.weekMap.MONDAY }}</div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">星期二 {{ view.weekMap.TUESDAY }}</div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">星期三 {{ view.weekMap.WEDNESDAY }}</div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">星期四 {{ view.weekMap.THURSDAY }}</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">星期五 {{ view.weekMap.FRIDAY }}</div>
      </el-col>
    </el-row>
    <base-table
      :table-info="tableInfo"
      :page-info="pageInfo"
      :cell-style="set_cell_style"
      @init="init"
    >
      <template v-slot:buttonSlot="netValueDate">
        <el-button @click="myChooseDate(netValueDate.fieldVal)" link type="primary" size="small">
          {{ netValueDate.fieldVal }}
        </el-button>
      </template>

    </base-table>

    <el-row v-for="(row, rowIndex) in parseFindRecentRetRow" :key="row" :gutter="20">
      <el-col
        v-for="(line, lineIndex) in parseFindRecentRetLineTotal(rowIndex)"
        :key="line"
        :span="parseFindRecentRetLine(rowIndex)"
      >
        <!--          长度是3 列的索引是2，需要索引是2-->
        <!--          长度是2 列的索引是1，需要索引是1  需要索引是列的索引-->
        <!--          长度是5 列的索引是1，行的索引是0，需要索引是1-->
        <!--          长度是5 列的索引是1，行的索引是1，需要索引是4  需要索引是列的索引+3*行的索引-->
        <el-table
          :data="findRecentRet[lineIndex + rowIndex * findRecentRetLineNumber]"
          :cell-style="set_cell_style"
          style="width: 100%"
        >
          <el-table-column prop="netValueDate" label="净值日期"></el-table-column>
          <el-table-column prop="dayOfWeek" label="星期"></el-table-column>
          <el-table-column prop="increaseRateDay" label="日增长率"></el-table-column>
        </el-table>
        <span
          v-if="findRecentRetVal[lineIndex + rowIndex * findRecentRetLineNumber].nextAvg > 0"
          class="red"
        >
          nextAvg {{ findRecentRetVal[lineIndex + rowIndex * findRecentRetLineNumber].nextAvg }}
        </span>
        <span v-else class="green">
          nextAvg {{ findRecentRetVal[lineIndex + rowIndex * findRecentRetLineNumber].nextAvg }}
        </span>
        avg {{ findRecentRetVal[lineIndex + rowIndex * findRecentRetLineNumber].avg }} min
        {{ findRecentRetVal[lineIndex + rowIndex * findRecentRetLineNumber].min }} max
        {{ findRecentRetVal[lineIndex + rowIndex * findRecentRetLineNumber].max }}
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import request from "@/util/Request";
import { useRoute } from "vue-router";
import constant from "@/util/Constant";
import BaseTable, { PageInfo, TableInfo } from "@/components/BaseTable.vue";

let route = useRoute();

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})


const fundId = ref(route.query.fundId);
const tableInfo = reactive<TableInfo>({
    header: [
      {
        fieldName: "netValueDate",
        showName: "净值日期"
      }, {
        fieldName: "dayOfWeek",
        showName: "星期"
      }, {
        fieldName: "increaseRateDay",
        showName: "日增长率"
      }, {
        fieldName: "netAssetValue",
        showName: "单位净值"
      }, {
        fieldName: "netValueCumulative",
        showName: "累计净值"
      }, {
        fieldName: "updateTime",
        showName: "更新时间"
      }, {
        fieldName: "netValueDate",
        showName: "最近10天",
        isButtonSlot: true
      }
    ],
    data1: []
  }
);
const pageInfo = reactive<PageInfo>({
  total: 1000,
  pageSize: 10,
  pageNum: 1
});
let view = ref({
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
});
const simCal = reactive({
  source: null,
  target: null,
  res: null
});
const parseFindRecentRetRow = ref(1);
const pickerOptions = reactive({
  shortcuts: [
    {
      text: "最近一周",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近一个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近三个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit("pick", [start, end]);
      }
    }
  ]
});

const options = reactive([
  {
    value: "1",
    label: "1天"
  },
  {
    value: "2",
    label: "2天"
  },
  {
    value: "3",
    label: "3天"
  },
  {
    value: "4",
    label: "4天"
  },
  {
    value: "5",
    label: "5天"
  }
]);
let fundInfo = ref({
  id: null,
  name: null
});
const thisPageAvg = ref();
const fundDataParam = reactive({
  currentPage: 1,
  // 区间日期
  intervalDate: "",
  chooseDate: null,
  chooseDateLength: null
});

// 查询最近区间返回值
const findRecentRet = ref([]);
const findRecentRetVal = ref([]);
const findRecentRetLineNumber: number = 4;

async function init() {
  const res = await request.simpleGetPage(constant.fundUrlPre + "/fundData/init", pageInfo, {
    fundId: fundId.value,
    startDate: fundDataParam.intervalDate[0],
    endDate: fundDataParam.intervalDate[1],
    chooseDateLength: fundDataParam.chooseDateLength,
    chooseDate: fundDataParam.chooseDate
  });
  tableInfo.data1 = res.list;
  thisPageAvg.value = res.isPageAvg;
}

async function cal() {
  const res = await request.simpleGet(constant.fundUrlPre + "/fundData/cal", {
    fundId: fundId.value,
    startDate: fundDataParam.intervalDate[0],
    endDate: fundDataParam.intervalDate[1]
  });
  view.value = res;
}

async function httpSimCal() {
  const data = await request.simpleGet(constant.fundUrlPre + "/fundData/simCal", {
    source: simCal.source,
    target: simCal.target
  });
  simCal.res = data;
}

function initCal() {
  init();
  cal();
}

async function initFundInfo() {
  const res = await request.simpleGet(constant.fundUrlPre + "/fundInfo/fundInfoInit", {
    id: fundId.value
  });
  fundInfo.value = res;
}

async function myChooseDate(netValueDate: Date) {
  const data = await request.simpleGet(constant.fundUrlPre + "/fundData/findRecentData", {
    fundId: fundId.value,
    myChooseDate: netValueDate
  });
  findRecentRet.value.push(data.list);
  findRecentRetVal.value.push(data);

  // 计算一共有多少行数据
  const length = findRecentRet.value.length;
  parseFindRecentRetRow.value = Math.floor((length + findRecentRetLineNumber - 1) / findRecentRetLineNumber);
}

/**
 * 计算一行的宽度
 * @param row
 * @return {number}
 */
function parseFindRecentRetLine(row: number): number {
  const length = findRecentRet.value.length;
  // 当前行剩余元素
  const curRowRemainder = length - row * findRecentRetLineNumber;
  if (curRowRemainder > findRecentRetLineNumber) {
    return 24 / findRecentRetLineNumber;
  } else {
    return 24 / curRowRemainder;
  }
}

/**
 * 计算列个数
 * @param row
 * @return {number}
 */
function parseFindRecentRetLineTotal(row: number) {
  const lineTotal: number = parseFindRecentRetLine(row);
  return 24 / lineTotal;
}

async function set_cell_style({ row, column }) {
  if (column.label === "日增长率") {
    if (row.increaseRateDay > 0) {
      return {
        color: "#ff0000"
      };
    } else {
      return {
        color: "#1ede27"
      };
    }
  }
  // 这里的medicalCommonName指的是在el-table-column定义的prop中的值,并不会走到这里
  if (row.medicalCommonName === "increaseRateDay") {
    return {
      color: "#5f0606"
    };
  }
}

async function addToday(rate) {
  dialogFormVisible.value=false
  await request.simpleGet(constant.fundUrlPre + "/fundData/addToday", {
    fundId: fundId.value,
    rate: rate
  });
}

onMounted(() => {
  init();
  cal();
  initFundInfo();
});

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
