<template>
  <a-select v-model:value="modelValue" :options="options" :disabled="disabled"></a-select>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Select as ASelect } from "ant-design-vue"

const props = defineProps({
  value: {
    type: [String, Number, Array, Object],
    required: true,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits('update:value');

const modelValue = computed({
  get() { return props.value; },
  set(value) {
    emit('update:value', value);
  }
})

</script>

<style lang="scss" scoped></style>