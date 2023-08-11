<template>
  <div class="config-container" @click="visible = true">
    <span>配置</span>

    <a-modal v-model:visible="visible">
      <div class="content">
        <div class="item-section">
          <h4>类型选择</h4>
          <ValueTypeSelector v-model:value="modelValue.type" style="width: 100%;" />
        </div>

        <div class="item-section" v-if="modelValue.type === 'node'">
          <h4>节点选择</h4>
          <NodeSelector v-model:value="modelValue.nodeId" :options="nodeOptions" style="width: 100%;" />
        </div>

        <div class="item-section">
          <h4>值设置</h4>
          <a-input v-model:value="modelValue.value" />
        </div>
      </div>

      <template #footer>
        <a-button type="primary" @click="handleOk">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { Modal as AModal, Select as ASelect, Button as AButton, Input as AInput } from "ant-design-vue"
import ValueSelector from './ValueSelector.vue'
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

const visible = ref(false);
const emit = defineEmits('update:value');

const handleOk = () => {
  visible.value = false;
}

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
.config-container {
  background-color: rgb(235, 245, 255);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;

  span {
    color: #1c64f2
  }
}

.content {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>