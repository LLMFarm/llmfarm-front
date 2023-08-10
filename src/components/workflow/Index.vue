<template>
  <div class="container dingflow-design">
    <div style="display: flex; justify-content: center; padding: 10px 0">
      <el-button @click="viewNodes" type="primary">查看数据</el-button>
    </div>
    <node-wrap :nodeConfig="nodeConfig"></node-wrap>
    <div class="end-node">
      <div class="end-node-circle"></div>
      <div class="end-node-text">流程结束</div>
    </div>

    <setting v-model:visible="settingVisible" :node="selectedNode"></setting>
  </div>
</template>

<script setup>
import nodeWrap from "./node/NodeWrap.vue";
import setting from "@/components/workflow/setting/Index.vue";
import { computed, provide, ref, reactive } from "vue";
let props = defineProps({
  nodes: {
    type: Array,
    default: () => [],
  },
  flowPermission: {
    type: Object,
    default: () => [],
  },
});

let settingVisible = ref(false);
let selectedNode = reactive({});

const computedNodes = computed(() => {
  return props.nodes;
});
provide("nodes", computedNodes);

// 封装 nodes 操作方法
const appendNode = (node = {}) => {
  props.nodes.push(node);
};
const appendNodes = (nodes = []) => {
  props.nodes.push(...nodes);
};
const deleteNode = (node, parent) => {};

provide("appendNode", appendNode);
provide("appendNodes", appendNodes);

// 节点设置
const openNodeSetting = (node) => {
  console.log("openNodeSetting.node", node);
  selectedNode = node;
  // console.log("settingVisible", settingVisible);
  settingVisible.value = true;
};
provide("openNodeSetting", openNodeSetting);

const viewNodes = () => {
  console.log("节点数据", JSON.stringify(props.nodes, null, 2));
};

const resolveNodes = (nodes = []) => {
  const startNode = nodes.find((node) => node.type == 0);
  if (!startNode) {
    return {};
  }
  const resolveChildNode = (node = {}) => {
    if (!!node.next) {
      const matchNode = nodes.find((item) => item.id == node.next);
      matchNode.childNode = resolveChildNode(matchNode);
      // 路由节点处理
      if (matchNode.type == 4 && matchNode.conditions.length) {
        const set = new Set(matchNode.conditions);
        matchNode.conditionNodes = nodes
          .filter((item) => {
            return set.has(item.id);
          })
          .map((item) => {
            item.childNode = resolveChildNode(item);
            // console.log("条件节点.childNode", item.childNode, item);
            return item;
          });
      }
      return matchNode;
    }
    return null;
  };
  startNode.childNode = resolveChildNode(startNode);
  return startNode;
};

const nodeConfig = computed(() => {
  const value = resolveNodes(props.nodes);
  return value;
});
</script>

<style></style>
