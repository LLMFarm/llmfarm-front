<template>
  <div class="config">
    <a-input v-model:value="modelValue" :placeholder="`请输入${label}`"
      v-if="!control.type && (type === 'string' || type == 'number')" />

    <template v-if="control.type == 'select'">

      <!-- a-select options from control.options -->
      <a-select v-model:value="modelValue" placeholder="请选择" v-if="control.type == 'select'" style="width: 70%;">
        <a-select-option v-for="item in control.options" :key="item.value" :value="item.value">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </template>

    <template v-if="type == 'PromptTemplate'">
      <ConfigTemplate v-model:value="modelValue" :label="label" />
    </template>

    <template v-if="type == 'StructuredConfig'">
      <ConfigStructure v-model:value="modelValue" :label="label" />
    </template>

    <template v-if="type == 'ConfigAPI'">
      <ConfigAPI v-model:value="modelValue" :label="label" :option="option" />
    </template>

    <template v-if="type === 'trigger-config'">
      <TriggerConfig v-model:value="modelValue" :label="label" :option="option" />
    </template>

    <template v-if="type == 'ConfigRequest'">
      <ConfigRequest v-model:value="modelValue" :label="label" :option="option" />
    </template>

    <template v-if="type == 'ConfigCondition'">
      <ConfigCondition v-model:value="modelValue" :label="label" :option="option" />
    </template>

    <!-- 节点值选择 && 配置 -->
    <template v-if="type == 'NodeValue'">
      <NodeValueConfig v-model:value="modelValue" :label="label" :option="option" />
    </template>

    <!-- Switch 配置 -->
    <template v-if="type == 'ConfigSwitch'">
      <ConfigSwitch v-model:value="modelValue" :label="label" :option="option" />
    </template>

    <!-- 自定义代码配置 -->
    <template v-if="type == 'ConfigCode'">
      <ConfigCode v-model:value="modelValue" :label="label" :option="option" />
    </template>

    <template v-if="type == 'ConfigOptions'">
      <ConfigOptions v-model:value="modelValue" :label="label" :option="option" />
    </template>

    <!-- 参数配置 -->
  </div>
</template>

<script setup>
import ConfigTemplate from "./ConfigTemplate.vue";
import ConfigStructure from "./ConfigStructure.vue";
import ConfigAPI from "./ConfigAPI.vue";
import TriggerConfig from "./TriggerConfig.vue";
import ConfigRequest from "./ConfigRequest.vue";
import ConfigCondition from "./ConfigCondition.vue";
import NodeValueConfig from "./NodeValueConfig.vue";
import ConfigSwitch from "./ConfigSwitch.vue";
import ConfigCode from "./ConfigCode.vue";
import ConfigOptions from "./ConfigOptions.vue";
import { Input as AInput, Select as ASelect, SelectOption as ASelectOption } from "ant-design-vue"
import { computed } from 'vue'
const props = defineProps({
  value: {
    type: [String, Number, Array, Object],
    required: true,
    default: ''
  },
  option: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  control: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:value'])

const modelValue = computed({
  get() {
    return props.value
  },
  set(val) {
    console.log('set val', val);
    emit('update:value', val)
  }
})

</script>

<style lang="scss" scoped></style>