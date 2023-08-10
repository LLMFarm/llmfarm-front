<template>
  <div class="request-container" @click="show">
    <span style="font-weight: 500;">
      条件配置
    </span>

    <a-modal v-model:visible="visible" title="条件配置" width="880px" :showCount="true">
      <div class="content">

        <a-button type="primary" style="font-size: 12px; width: 100px" @click="append">新增条件</a-button>

        <div class="section" v-for="(condition, index) in conditions" :key="index">
          <ValueConfig v-model:value="condition.left" style="flex-basis:320px" />
          <a-select v-model:value="condition.operator" :options="operatorOptions" style="flex-basis: 120px;">
          </a-select>
          <ValueConfig v-model:value="condition.right" style="flex-basis:320px" />

          <img :src="removeIcon" class="remove" @click="remove(index)" />
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
import { ref, computed } from "vue";
import { Modal as AModal, Select as ASelect, Button as AButton, Input as AInput } from "ant-design-vue"
import ValueConfig from "./ValueConfig.vue";
import removeIcon from "@/assets/icons/remove.svg"

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

const conditions = computed({
  get() {
    return props.option.conditions || [];
  },
  set(value) {
    emit('update:value', value);
  }
});

const append = () => {
  const condition = {
    left: {
      type: 'string',
      value: '',
    },
    operator: 'eq',
    right: {
      type: 'string',
      value: '',
    }
  }
  conditions.value.push(condition);
  console.log("conditions", conditions.value);
  emit('update:value', conditions.value);
}

const handleOk = (e) => {
  visible.value = false;
}

const show = () => {
  visible.value = true;
}

const operatorOptions = computed(() => {
  return [
    { 'value': 'eq', 'label': '等于' },
    { 'value': 'startsWith', 'label': '以...开始' }
  ]
});

const remove = index => {
  conditions.value.splice(index, 1);
  emit('update:value', conditions.value);
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

.remove {
  width: 32px;
  height: 32px;
  position: absolute;
  right: 16px;
  cursor: pointer;
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