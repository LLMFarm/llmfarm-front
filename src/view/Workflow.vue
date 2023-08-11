<template>
  <workflow :nodes="nodes"></workflow>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

import workflow from "@/components/workflow/Index.vue";
import { getWorkFlowData } from "@/plugins/api.js";

let nodes = ref([])

const fetchWorkflow = async () => {
  const flow = await getWorkFlowData({});
  console.log("flow", flow);
  nodes.value = flow.nodes || []
};

onMounted(async () => {
  console.log("加载数据");
  await fetchWorkflow();
});
</script>

<style scoped>
.container {
  transform: scale(1);
  transform-origin: 50% 0px 0px;

  width: 100%;
  background-color: #f5f5f5;
  position: relative;
}
</style>
