<template>
  <div class="branch-wrap" v-if="nodeConfig.type == 4">
    <div class="branch-box-wrap">
      <div class="branch-box">
        <button class="add-branch" @click="appendCondition">添加条件</button>
        <div class="col-box" v-for="(item, index) in nodeConfig.conditionNodes" :key="index">
          <div class="condition-node">
            <div class="condition-node-box">
              <div class="auto-judge" :class="isTried && item.error ? 'error active' : ''">
                <div class="sort-left" v-if="index != 0" @click="transfer(index, -1)">&lt;</div>
                <div class="title-wrapper">
                  <input v-if="isInputList[index]" type="text" class="ant-input editable-title-input"
                    @blur="blurEvent(index)" @focus="$event.currentTarget.select()" v-model="item.name" />
                  <span v-else class="editable-title" @click="clickEvent(index)">{{ item.id }}.{{ item.name }}</span>
                  <span class="priority-title" @click="openSetting(item.priorityLevel)">优先级{{
                    item.priorityLevel
                  }}</span>
                  <i class="anticon anticon-close close" @click="delTerm(index)"></i>
                </div>
                <div class="sort-right" v-if="index != nodeConfig.conditionNodes.length - 1" @click="transfer(index)">
                  &gt;
                </div>
                <div class="content" @click="openSetting(item.priorityLevel)">
                  {{ $util.conditionStr(nodeConfig, index) }}
                </div>
                <div class="error_tip" v-if="isTried && item.error">
                  <i class="anticon anticon-exclamation-circle"></i>
                </div>
              </div>
              <addNode v-model:childNodeP="item.childNode" :node="item" />
            </div>
          </div>
          <nodeWrap v-if="item.childNode" v-model:nodeConfig="item.childNode" />
          <template v-if="index == 0">
            <div class="top-left-cover-line"></div>
            <div class="bottom-left-cover-line"></div>
          </template>
          <template v-if="index == nodeConfig.conditionNodes.length - 1">
            <div class="top-right-cover-line"></div>
            <div class="bottom-right-cover-line"></div>
          </template>
        </div>
      </div>
      <addNode v-model:childNodeP="nodeConfig.childNode" :node="nodeConfig" />
    </div>
  </div>
</template>

<script setup>
import addNode from "@/components/workflow/AddNode.vue";
import nodeWrap from "@/components/workflow/node/NodeWrap.vue";
import map from "../model/index";
import { TYPES } from "../common";

import $util from "@/plugins/util";

import { ref, defineProps, defineEmits, onMounted, inject } from "vue";

let emits = defineEmits(["update:flowPermission", "update:nodeConfig"]);

let props = defineProps({
  nodeConfig: {
    type: Object,
    default: () => ({}),
  },
  flowPermission: {
    type: Object,
    default: () => [],
  },
});

let isInputList = ref([]);
const clickEvent = (index) => {
  if (index || index === 0) {
    isInputList.value[index] = true;
  }
};
const blurEvent = (index) => {
  if (index || index === 0) {
    isInputList.value[index] = false;
    props.nodeConfig.conditionNodes[index].name = props.nodeConfig.conditionNodes[index].name || "条件";
  }
};

// 节点设置
const openNodeSetting = inject("openNodeSetting")
const openSetting = () => {
  openNodeSetting(props.nodeConfig);
}

// 条件处理
const resetConditionNodesErr = () => {
  for (var i = 0; i < props.nodeConfig.conditionNodes.length; i++) {
    props.nodeConfig.conditionNodes[i].error =
      $util.conditionStr(props.nodeConfig, i) == "请设置条件" && i != props.nodeConfig.conditionNodes.length - 1;
  }
};

// 节点处理
const nodes = inject('nodes');
const appendNode = inject('appendNode');

const appendCondition = () => {
  const len = props.nodeConfig.conditionNodes.length + 1;
  const define = JSON.parse(JSON.stringify(map[TYPES.CONDITION].default));
  const nodeId = nodes.value.length + 1;
  const conditionNode = Object.assign(define, {
    id: nodeId, next: 0, name: `条件 ${len}`
  })
  appendNode(conditionNode);

  props.nodeConfig.conditions.push(nodeId);
  resetConditionNodesErr();
};

const delTerm = (index) => {
  props.nodeConfig.conditionNodes.splice(index, 1);
  props.nodeConfig.conditionNodes.map((item, index) => {
    item.priorityLevel = index + 1;
    item.name = `条件${index + 1}`;
  });
  resetConditionNodesErr();
  emits("update:nodeConfig", props.nodeConfig);
  if (props.nodeConfig.conditionNodes.length == 1) {
    if (props.nodeConfig.childNode) {
      if (props.nodeConfig.conditionNodes[0].childNode) {
        reData(props.nodeConfig.conditionNodes[0].childNode, props.nodeConfig.childNode);
      } else {
        props.nodeConfig.conditionNodes[0].childNode = props.nodeConfig.childNode;
      }
    }
    emits("update:nodeConfig", props.nodeConfig.conditionNodes[0].childNode);
  }
};

const transfer = (index, type = 1) => {
  // 向左-1, 向右1
  props.nodeConfig.conditionNodes[index] = props.nodeConfig.conditionNodes.splice(
    index + type,
    1,
    props.nodeConfig.conditionNodes[index]
  )[0];
  props.nodeConfig.conditionNodes.map((item, index) => {
    item.priorityLevel = index + 1;
  });
  resetConditionNodesErr();
  emits("update:nodeConfig", props.nodeConfig);
};

let isTried = ref(false);

onMounted(() => {
  resetConditionNodesErr();
});
</script>

<style lang="scss" scoped>

</style>
