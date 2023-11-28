<script setup lang="ts">
import * as echarts from 'echarts'

function a() {
  // 基于准备好的dom，初始化echarts实例
  let myChart = echarts.init(document.getElementById('main1'))
  // 绘制图表
  myChart.setOption({
    title: {
      text: 'ECharts 入门示例'
    },
    tooltip: {},
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  })
}

function b() {
  let myChart = echarts.init(document.getElementById('main2'))
  const option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true
      }
    ]
  }
  myChart.setOption(option)
}
</script>

<template>
  <div style="display: flex; width: 100%; height: 100%">
    <div id="main1" style="width: 100%; height: 50%">
      <el-button @click="a"> a</el-button>
    </div>
    <div id="main2" style="width: 100%; height: 50%">
      <el-button @click="b"> b</el-button>
    </div>
  </div>
</template>

<style scoped></style>
