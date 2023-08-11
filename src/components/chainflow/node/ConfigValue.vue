<template>
  <div class="content">
    <div class="item-section">
      <ValueTypeSelector v-model:value="modelValue.type" style="width: 100%;" />
    </div>

    <NodeSelector v-model:value="modelValue.nodeId" :options="nodeOptions" :disabled="modelValue.type !== 'node'"
      style="width: 180px;" />

    <div class="item-section">
      <a-input v-model:value="modelValue.value" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { Modal as AModal, Select as ASelect, Button as AButton, Input as AInput } from "ant-design-vue"
import ValueTypeSelector from './ValueTypeSelector.vue';
import NodeSelector from './NodeSelector.vue';
import useNodeOptions from "@/components/chainflow/hooks/useNodeOptions.js";
const { nodeOptions } = useNodeOptions();

const props = defineProps({
  value: {
    type: Object,
    required: true,
    default: () => { }
  },
})

const emit = defineEmits('update:value');

const modelValue = computed({
  get() {
    if (!props.value || !props.value.type) {
      return { type: 'node', value: '' }
    }
    return props.value;
  },
  set(value) {
    console.log('value', value);
    emit('update:value', value);
  }
})

</script>

<style lang="scss" scoped>
.content {
  display: flex;
  gap: 8px;

  .item-section {
    flex: 1;
  }
}
</style>