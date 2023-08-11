<template>
  <a-select v-model:value="modelValue" :options="options"></a-select>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Select as ASelect } from "ant-design-vue"

const props = defineProps({
  value: {
    type: String,
    required: true,
    default: ''
  }
})

const emit = defineEmits('update:value');

const modelValue = computed({
  get() { return props.value; },
  set(value) {
    console.log('ValueTypeSelector', value);
    emit('update:value', value);
  }
})

const options = [{
  value: 'string',
  label: '字符串'
}, {
  value: 'node',
  label: '节点值'
}, {
  value: 'request',
  label: '请求参数'
}]

</script>

<style lang="scss" scoped></style>