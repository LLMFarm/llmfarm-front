<template>
  <div class="request-container" @click="show">
    <span style="font-weight: 500;">
      请求参数配置
    </span>

    <a-modal v-model:visible="visible" title="接口参数配置" width="700px" :showCount="true">
      <div class="content">

        <div class="section" v-for="(option, index) in options" :key="index">
          <div class="label">{{ option.desc }}</div>

          <ConfigValue v-model:value="modelValue[option.key]" :option="option" style="flex: 1;" />
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
import { useServiceStore } from '@/store/modules/service'
const serviceStore = useServiceStore();
import ConfigValue from "./ConfigValue.vue";

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

const modelValue = computed({
  get() {
    for (const option of options.value) {
      if (!props.value[option.key]) {
        props.value[option.key] = { type: 'node', value: '' }
      }
    }
    return props.value;
  },
  set(value) {
    emit('update:value', value);
  }
})

const handleOk = (e) => {
  visible.value = false;
}

const show = () => {
  visible.value = true;
}

const currentService = computed(() => {
  const service = serviceStore.plugins.find(item => item.unique == props.option.service);
  return service || {}
})

const options = computed(() => {
  const list = currentService.value.list || [];
  if (!list.length || !props.option.api) return [];
  const api = list.find(item => item.uri == props.option.api);
  if (api) {
    return api.request || [];
  }
  return []
})

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

  .section {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

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