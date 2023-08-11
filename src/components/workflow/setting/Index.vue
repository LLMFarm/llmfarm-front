<template>
  <el-drawer v-model="drawerVisible" :title="node.name + '设置'" :append-to-body="true">
    <el-radio-group v-model="node.props.type" class="clear" @change="changeType">
      <el-radio :label="1">指定成员</el-radio>
      <el-radio :label="2">主管</el-radio>
      <el-radio :label="4">发起人自选</el-radio>
      <el-radio :label="5">发起人自己</el-radio>
      <el-radio :label="7">连续多级主管</el-radio>
    </el-radio-group>

    <pre>
      {{ JSON.stringify(node, null, 2) }}
    </pre>
    <template #footer>
      <h5>自定义页脚</h5>
    </template>
  </el-drawer>
</template>

<script setup>
import { defineProps, computed } from "vue";
let props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  node: {
    type: Object,
    default: () => ({}),
  },
});

let emits = defineEmits(["update:visible"]);
const drawerVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("update:visible", val);
  },
});
</script>

<style lang="scss" scoped>

</style>
