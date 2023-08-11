<template>
  <div class="node-wrap">
    <div class="node-wrap-box"
      :class="(nodeConfig.type == 0 ? 'start-node ' : '') + (isTried && nodeConfig.error ? 'active error' : '')">
      <div class="title" :style="`background: ${colors[nodeConfig.type]};`">
        <span v-if="nodeConfig.type == 0">{{ nodeConfig.id }}.{{ nodeConfig.name }}</span>
        <template v-else>
          <span class="iconfont">{{ nodeConfig.type == 1 ? "" : "" }}</span>
          <input v-if="isInput" type="text" class="ant-input editable-title-input" @blur="blurEvent()"
            @focus="$event.currentTarget.select()" v-model="nodeConfig.name" :placeholder="defaultText" />
          <span v-else class="editable-title" @click="clickEvent()">{{ nodeConfig.id }}.{{ nodeConfig.name }}</span>
          <i class="anticon anticon-close close" @click="delNode"></i>
        </template>
      </div>
      <div class="content" @click="openSetting()">
        <div class="text">
          <span class="placeholder" v-if="!showText">请选择{{ defaultText }}</span>
          {{ showText }}
        </div>
        <i class="anticon anticon-right arrow"></i>
      </div>
      <div class="error_tip" v-if="isTried && nodeConfig.error">
        <i class="anticon anticon-exclamation-circle"></i>
      </div>
    </div>
    <addNode v-model:childNodeP="nodeConfig.childNode" :node="nodeConfig" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, inject } from "vue";

import addNode from "@/components/workflow/AddNode.vue";
import { colors } from "../common.js";

import $util from "@/plugins/util";

let showText = computed(() => {
  if (props.nodeConfig.type == 0) return $util.arrToStr(props.flowPermission) || "所有人";
  if (props.nodeConfig.type == 1) return $util.setApproverStr(props.nodeConfig);
  return $util.copyerStr(props.nodeConfig);
});

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

let isTried = ref(false);
let isInput = ref(false);

let placeholderList = ["发起人", "审核人", "抄送人"];
let defaultText = computed(() => {
  return placeholderList[props.nodeConfig.type];
});

// 节点设置
const openNodeSetting = inject("openNodeSetting")
const openSetting = () => {
  console.log("setting.open", props.nodeConfig);
  openNodeSetting(props.nodeConfig);
}

const clickEvent = (index) => {
  if (index || index === 0) {
    isInputList.value[index] = true;
  } else {
    isInput.value = true;
  }
};

const blurEvent = (index) => {
  if (index || index === 0) {
    isInputList.value[index] = false;
    props.nodeConfig.conditionNodes[index].name = props.nodeConfig.conditionNodes[index].name || "条件";
  } else {
    isInput.value = false;
    props.nodeConfig.name = props.nodeConfig.name || defaultText;
  }
};

</script>

<style lang="scss" scoped>

</style>
