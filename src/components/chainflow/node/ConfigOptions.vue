<template>
  <div class="request-container" @click="show">
    <span style="font-weight: 500;">
      参数配置
    </span>

    <a-modal v-model:visible="visible" title="参数配置" width="800px" :showCount="true">
      <div class="content">

        <a-button type="primary" style="font-size: 12px; width: 100px" @click="append">新增参数</a-button>

        <div class="section" v-for="(option, index) in list" :key="index">
          <a-input v-model:value="option.key" placeholder="参数名" style="flex-basis: 120px" />
          <a-input v-model:value="option.desc" placeholder="参数含义" style="flex-basis: 120px" />

          <ValueTypeSelector v-model:value="option.type" style="flex-basis: 100px;" />
          <NodeSelector v-model:value="option.nodeId" :options="nodeOptions" style="flex-basis: 200px;" />
          <a-input v-model:value="option.value" style="flex-basis: 150px;" />
        </div>

        <div class="footer">
          <p>说明: 配置接口请求参数</p>
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
import ValueTypeSelector from './ValueTypeSelector.vue';
import NodeSelector from './NodeSelector.vue';
import { useServiceStore } from '@/store/modules/service'
import useNodeOptions from "@/components/chainflow/hooks/useNodeOptions.js";
import ValueConfig from "./ValueConfig.vue";
const { nodeOptions } = useNodeOptions();
const serviceStore = useServiceStore();
const flowNode = inject('flowNode');

// import
const visible = ref(false);

const emit = defineEmits('update:value');

const props = defineProps({
  option: {
    type: Object,
    default: () => ({}),
  },
  value: {
    type: [String, Number, Array, Object],
    required: true,
    default: () => [],
  },
})

const list = computed({
  get() {
    return props.value;
  },
  set(value) {
    emit('update:value', value);
  }
})

const append = () => {
  list.value.push({
    key: '',
    desc: '',
    type: 'string',
    nodeId: '',
    value: '',
  })
}

const handleOk = (e) => {
  visible.value = false;
}

const show = () => {
  visible.value = true;
}

</script>

<style lang="scss" scoped>
.request-container {
  background-color: rgb(235, 245, 255);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;

  span {
    color: #1c64f2
  }

}

.content {
  gap: 8px;
  display: flex;
  flex-direction: column;

  .section {
    display: flex;
    align-items: center;
    gap: 8px;

    .label {
      flex-basis: 80px;
      text-align: left;
      margin-right: 16px;
    }
  }

  .footer {
    p {
      color: #6b7280;
      padding: 4px 0;
      margin: 0;
    }
  }
}
</style>