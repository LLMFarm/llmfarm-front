<template>
  <div class="prompt-container" @click="show">
    <span style="font-weight: 500;">
      触发器 应用 / 动作配置
    </span>

    <a-modal v-model:visible="visible" title="服务/接口配置" width="500px" :showCount="true">
      <div class="content">

        <div class="section">
          <div class="label">选择服务</div>
          <a-select show-search v-model:value="option.service" placeholder="选择服务" :options="serviceOptions"
            :filter-option="filterOption" style="flex:1;" @change="changeService" allow-clear>

          </a-select>
        </div>

        <div class="section">
          <div class="label">选择接口</div>
          <a-select show-search v-model:value="modelValue" placeholder="选择服务" :options="apiOptions"
            :filter-option="filterOption" style="flex:1;" @change="changeAPI" allow-clear>

          </a-select>
        </div>

        <div class="footer">
          <p>说明: 配置调用的三方服务 & 接口</p>
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

const modelValue = computed({
  get() {
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

const changeService = (value) => {
  const service = serviceStore.plugins.find(item => item.unique == value);
  if (service) {
    flowNode.value.title = '触发器 ' + service.name || '触发器';
  } else {
    flowNode.value.title = '触发器';
  }
}

const changeAPI = (triggerValue) => {
  const triggers = currentService.value.triggers || [];
  const trigger = triggers.find(item => item.value == triggerValue);
  flowNode.value.desc = trigger ? trigger.name : 'API';
}

const currentService = computed(() => {
  const service = serviceStore.plugins.find(item => item.unique == props.option.service);
  return service || {}
})

const serviceOptions = computed(() => {
  return serviceStore.plugins.map(item => {
    return {
      value: item.unique,
      label: item.name
    }
  })
})

const apiOptions = computed(() => {
  const list = currentService.value.triggers || [];
  return list.map(item => {
    return {
      value: item.value,
      label: item.name
    }
  })
});

const filterOption = (input, option) => {

}

</script>

<style lang="scss" scoped>
.prompt-container {
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