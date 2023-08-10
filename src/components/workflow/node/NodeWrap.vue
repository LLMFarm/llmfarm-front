<template>
  <node-normal :nodeConfig="nodeConfig" v-if="nodeConfig.type < 3"></node-normal>

  <node-switch :nodeConfig="nodeConfig" v-if="nodeConfig.type == 4"></node-switch>

  <nodeWrap v-if="nodeConfig.childNode" v-model:nodeConfig="nodeConfig.childNode" />
</template>

<script setup>
import nodeNormal from "@/components/workflow/node/NodeNormal.vue";
import nodeSwitch from "@/components/workflow/node/NodeSwitch.vue";

let props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  nodeConfig: {
    type: Object,
    default: () => ({}),
  },
  flowPermission: {
    type: Object,
    default: () => [],
  },
});

let emits = defineEmits(["update:flowPermission", "update:nodeConfig"]);

</script>

<style>
@import "@/css/workflow.css";
</style>
<style>
.error_tip {
  position: absolute;
  top: 0px;
  right: 0px;
  transform: translate(150%, 0px);
  font-size: 24px;
}

.promoter_person .el-dialog__body {
  padding: 10px 20px 14px 20px;
}

.selected_list {
  margin-bottom: 20px;
  line-height: 30px;
}

.selected_list span {
  margin-right: 10px;
  padding: 3px 6px 3px 9px;
  line-height: 12px;
  white-space: nowrap;
  border-radius: 2px;
  border: 1px solid rgba(220, 220, 220, 1);
}

.selected_list img {
  margin-left: 5px;
  width: 7px;
  height: 7px;
  cursor: pointer;
}
</style>
