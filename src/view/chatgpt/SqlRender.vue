<template>
  <CodeRender language="sql" :code="formatted" style="width: 100%" />
</template>

<script setup>
import CodeRender from '@/components/visual-render/CodeRender.vue';
import { computed, defineProps } from "vue";
import { format as formatsql } from "sql-formatter";

const props = defineProps({
  sql: {
    type: String,
    defualt: "",
  }
})

const formatted = computed(() => {
  if (props.sql) {
    try {
      const SQL = formatsql(props.sql, { language: "mysql" });
      return SQL;
    } catch (error) { }
    return props.sql;
  }
  return "";
})
</script>

<style lang="scss" scoped></style>