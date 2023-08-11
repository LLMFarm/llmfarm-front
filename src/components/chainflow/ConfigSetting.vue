<template>
  <div class="setting-container" v-if="services.length">
    <a-button type="primary" @click="visible = true">{{ $t("setting") }}</a-button>
    <a-modal v-model:visible="visible" title="设置" @ok="handleOK">
      <a-radio-group v-model:value="selectedService" size="small">
        <a-radio-button :value="service" v-for="service in services" :key="service">{{ service }}</a-radio-button>
      </a-radio-group>
      <div class="content">
        <div class="setting-item" v-for="config in configs">
          <span class="label">{{ config.label }}</span>
          <a-input
            v-model:value="settingValue[config.key]"
            class="input"
            :placeholder="`${$t('pleaseEnter')}${config.label}`"
          />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import settingService from "@/services/setting.js";
import { useServiceStore } from "@/store/modules/service.js";
import { useSettingStore } from "@/store/modules/setting";
import { message } from "ant-design-vue";
import { ConsoleSqlOutlined } from "@ant-design/icons-vue";
const serviceStore = useServiceStore();
const settingStore = useSettingStore();
const visible = ref(false);
const selectedService = ref("");
const settingValue = ref({});

const props = defineProps({
  flow: {
    type: Object,
    default: () => {},
  },
});

const settings = computed(() => {
  return settingStore.list;
});

watch(settings, () => {
  const list = settingStore.list;
  if (list.length) {
    selectedService.value = list[0].serviceType;
  } else {
    selectedService.value = "";
  }
});

watch(selectedService, async (value) => {
  const list = settingStore.list;
  const match = list.find((item) => {
    return item.serviceType === value && item.chainId === props.flow.id;
  });

  if (match) {
    setting.value = match;
    settingValue.value = match.value;
  }
});

const setting = ref({});

const configs = computed(() => {
  if (selectedService.value) {
    return serviceStore.getService(selectedService.value).configs;
  }
  return [];
});

const services = computed(() => {
  const nodes = props.flow.nodes || [];
  const set = new Set();
  for (const node of nodes) {
    if (node.data.service) {
      set.add(node.data.service);
    }
  }
  return Array.from(set);
});

const handleOK = async () => {
  if (configs.value.length == 0) {
    message.error("当前服务无配置项");
    return;
  }
  console.log("handleOK", settingValue.value);
  const info = setting.value;

  if (info.id) {
    info.value = settingValue.value;
    await settingService.put(info);
  } else {
    info.serviceType = selectedService.value;
    info.chainId = props.flow.id;
    info.value = settingValue.value;
    await settingService.post(info);
  }
  visible.value = false;
};

onMounted(() => {
  selectedService.value = services.value[0];
});
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-height: 300px;
  overflow-y: scroll;

  .setting-item {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;

    .label {
      height: 32px;
      line-height: 32px;
      width: 100px;
      text-align: right;
      margin-right: 30px;
    }

    .input {
      width: 200px;
    }
  }
}
</style>
