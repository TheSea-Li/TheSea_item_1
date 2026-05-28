<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="card-item">
          <div class="title">用户总数</div>
          <div class="num">1258</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card-item">
          <div class="title">今日访问</div>
          <div class="num">368</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card-item">
          <div class="title">订单数量</div>
          <div class="num">896</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card-item">
          <div class="title">待处理</div>
          <div class="num">26</div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <div class="chart-box" ref="lineChartRef"></div>
      </el-col>
      <el-col :span="12">
        <div class="chart-box" ref="pieChartRef"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const lineChartRef = ref<HTMLDivElement>()
const pieChartRef = ref<HTMLDivElement>()

// 折线图
const initLineChart = () => {
  if (!lineChartRef.value) return
  const chart = echarts.init(lineChartRef.value)
  const option = {
    title: { text: '访问趋势' },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150, 80, 70, 110], type: 'line', smooth: true }]
  }
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 饼图
const initPieChart = () => {
  if (!pieChartRef.value) return
  const chart = echarts.init(pieChartRef.value)
  const option = {
    title: { text: '数据分布' },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: [
          { name: '正常用户', value: 1000 },
          { name: '访客', value: 258 }
        ]
      }
    ]
  }
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

onMounted(() => {
  initLineChart()
  initPieChart()
})
</script>

<style scoped>
.dashboard {
  padding: 10px;
}
.card-item {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
.card-item .title {
  font-size: 14px;
  color: #666;
}
.card-item .num {
  font-size: 28px;
  font-weight: bold;
  margin-top: 10px;
  color: #409eff;
}
.chart-box {
  height: 360px;
  background: #fff;
  border-radius: 8px;
  padding: 10px;
}
</style>
