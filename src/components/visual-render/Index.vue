<template>
  <div class="visual-render" style="height: 100%;">
    <tableRender v-if="type == 'table'" :value="props.value" :options="props.renderOptions" />

    <chartBar v-if="type == 'bar' || type == 'column'" :value="props.value" :title="renderOptions.title"
      :xAxis="renderOptions.xAxisField" :yAxis="renderOptions.yAxisField" sortType="desc" />

    <chartLine v-if="type == 'line'" :value="props.value" :title="renderOptions.title" :xAxis="renderOptions.xAxisField"
      :yAxis="renderOptions.yAxisField" />

    <div class="number" v-if="type == 'number' || type == 'count'" :style="numberStyle">
      <div class="title" v-if="renderOptions.title">{{ renderOptions.title }}</div>
      <div class="value" @tap="numDrillDown(numberValue)">{{ numberValue }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";
import tableRender from "./TableRender.vue";
import chartBar from "@/components/echarts/ChartBar.vue";
import chartLine from "@/components/echarts/ChartLine.vue";

const props = defineProps({
  value: {
    type: Object,
  },
  renderOptions: {
    type: Object,
    default: () => {
      return { type: "table" };
    },
  },
});

const type = computed(() => {
  return props.renderOptions.chartType;
});

const numberValue = computed(() => {
  try {
    if (props.value && props.value.length) {
      const item = props.value[0];
      const keys = Object.keys(item);
      const key = keys[0] || "total";
      return item[key] || 0;
    }
    return props.value || 0;
  } catch (error) {
    return props.value || 0;
  }
});
</script>

<style lang="scss" scoped>
.visual-render {
  padding: 14px 0;
  border: 1px solid #f5f5f5;
}


.number {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
  background: white;
  box-shadow: 0 1px 3px hsl(0deg 0% 7% / 10%);

  .title {
    text-align: left;
    color: #1f2d3d;
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .value {
    font-size: 38px;
    width: 100%;
    height: 100%;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
