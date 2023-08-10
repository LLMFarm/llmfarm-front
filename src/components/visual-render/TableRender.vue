<template>
  <el-table :data="value" style="width: 100%" height="400">
    <template v-for="col in columns">
      <el-table-column :prop="col.name" :label="col.label" />
    </template>
  </el-table>
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Object,
    default: () => {
      return { type: "table" };
    },
  },
});

const columns = computed(() => {
  console.log('columns', props.options);
  return props.options.columns || [];
});
</script>

<style lang="scss" scoped></style>
