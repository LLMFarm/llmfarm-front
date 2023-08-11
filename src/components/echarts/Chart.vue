<template>
  <div class="echarts" ref="echarts" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "chart",
  props: {
    options: {
      type: Object,
      default: () => { },
    },
  },
  watch: {
    options() {
      console.log("重新渲染 ECharts");
      this.chart.setOption(this.options);
    },
  },
  mounted() {
    console.log("echart", this.$refs.echarts);
    this.chart = echarts.init(this.$refs.echarts);
    this.chart.setOption(this.options);
    console.log(this.chart);
  },
};
</script>

<style></style>


