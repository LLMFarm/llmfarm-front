<template>
  <chart :options="options" style="width: 100%; min-height: 400px;" />
</template>

<script setup>
import { computed, ref } from "vue";
import chart from "./Chart.vue";
import { buildAxis, optimizeOptions, buildDataByField } from "./common";

const chartType = "line";
const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  xAxis: {
    type: String,
    default: "",
  },
  yAxis: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "柱状图",
  },
  sortType: {
    type: String,
    default: "",
  },
});

const hookToolTip = ref([]);

const options = computed(() => {
  let list = props.value || [];

  // 坐标数据处理
  const axis = buildAxis(chartType, props, list);
  // 根据 series 计算 top
  let top = 0;
  if (axis.series.length > 2) {
    top = Math.ceil(axis.series.length / 4) * 15;
  }

  const option = {
    chartType,
    title: {
      text: props.title,
      top: "auto",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      enterable: true,
      formatter: (params) => {
        hookToolTip.value = params;
        let str = `<div style="text-align:left">${params[0].axisValue}</div>`;
        for (const item of params) {
          str += `<div style="margin: 10px 0 0">
                        <div style="display:flex; width: 150px; justify-content: space-between;">
                          <div>${item.marker}${item.seriesName}</div>
                          <div style="font-weight: 500">${item.data}</div>
                          <div id="btnTooltip" style="color: #1890FF">查看</div>
                        </div>
                      </div>`;
        }
        return str;
      },
    },
    legend: {
      top: top || 30,
      type: "plain",
    },
    grid: {
      show: true,
      top: top + 60,
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: axis.xAxis,
    yAxis: axis.yAxis,
    series: axis.series,
  };

  console.log('option', option);
  return optimizeOptions(option, chartType, list);
});
</script>

<style lang="scss" scoped></style>
