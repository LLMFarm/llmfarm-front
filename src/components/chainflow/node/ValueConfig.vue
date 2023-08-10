<template>
  <div class="value-config">
    <ValueTypeSelector v-model:value="modelValue.type" style="flex-basis:120px;" />
    <ValueSelector v-if="modelValue.type === 'node'" v-model:value="modelValue.value" :options="selectorOptions"
      style="flex-basis: 180px;" />
    <a-input v-model:value="modelValue.value" v-else style="flex-basis: 180px;" />
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { Modal as AModal, Select as ASelect, Button as AButton, Input as AInput } from "ant-design-vue"
import ValueSelector from './ValueSelector.vue'
import ValueTypeSelector from './ValueTypeSelector.vue'
import useFlowOptions from "@/components/chainflow/hooks/useFlowOptions.js";
const { selectorOptions } = useFlowOptions();

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
.value-config {
  display: flex;
  gap: 12px;
}
</style>