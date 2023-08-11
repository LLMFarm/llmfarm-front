<!-- SelectModel -->
<template>
  <div class="select">
    <div class="select-model">
      <a-dropdown :trigger="['click']" v-model:visible="showModel" placement="top">
        <template #overlay>
          <a-menu class="select-chat-model">
            <a-menu-item v-for="model in options" :key="model.id" @click="selectModel(model)">
              <UserOutlined />
              <div :class="['menu-item', model.id == defaultModel.id ? 'select' : '']">
                {{ model.botName }}
                <CheckOutlined v-if="model.id == defaultModel.id" />
              </div>
            </a-menu-item>
          </a-menu>
        </template>
        <div class="select-input">
          <div class="model">Bot</div>
          <div class="select-model-name">{{ defaultModel.botName }}</div>
          <div class="select-icon">
            <DownOutlined :style="{ transition: '0.4s', transform: `rotate(${showModel ? 180 : 0}deg)` }" />
          </div>
        </div>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup>
// 引入问题引导组件
import { storeToRefs } from "pinia";
import { ref, computed } from "vue";
import { DownOutlined, CheckOutlined } from "@ant-design/icons-vue";
import { useModelStore } from "@/store/modules/model.js";
import services from "@/services/index";

const modelStore = useModelStore();

const { modelList, defaultModel } = storeToRefs(modelStore);

const showModel = ref(false);
const getModelList = async () => {
  let res = await services.bot.botList();
  if (res.code !== 0) return;
  modelStore.setModelList(res.data);
  let defaultModel = localStorage.getItem("defaultModel");
  console.log(defaultModel, "defaultModel");
  if (!defaultModel || defaultModel === "") {
    modelStore.selectModel(res.data[0]);
  } else {
    console.log("modeId========",res.data.find((item) => item.id == defaultModel) || res.data[0] || {});
    modelStore.setDefaultModel(res.data.find((item) => item.id == defaultModel) || res.data[0] || {});
  }
};
getModelList();

const options = computed(() => {
  return modelList.value;
});

const selectModel = (item) => {
  showModel.value = false;
  modelStore.selectModel(item);
};
</script>

<style lang="scss" scoped>
:deep(.menu-item) {
  width: 100%;
  height: fit-content;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #343541;
  line-height: 17px;
  padding: 7px 0;
  display: flex;
  justify-content: space-between;
}

:deep(.menu-item.select) {
  font-weight: 600 !important;
  color: #000000 !important;
}

:deep(.ant-dropdown-menu) {
  border-radius: 6px !important;
  border: 1px solid #ececec !important;
}

.select-model {
  // position: absolute;
  // top: 30px;
  // left: calc(50% - 146px);
  margin-right: 20px;

  .select-input {
    width: 180px;
    height: 50px;
    background-color: #fff;
    padding: 6px 12px 6px 14px;
    position: relative;
    border-radius: 6px;
    border: 1px solid #ececec;
    cursor: pointer;

    .model {
      width: 24px;
      height: 17px;
      font-size: 12px;
      font-weight: 400;
      color: #40414f;
      line-height: 17px;
    }

    .select-model-name {
      width: 131px;
      height: 20px;
      font-size: 14px;
      font-weight: 600;
      color: #000000;
      line-height: 20px;
    }

    .select-icon {
      position: absolute;
      right: 12px;
      top: calc(50% - 11px);
    }
  }
}
</style>
<style lang="scss">
.select-chat-model {
  border-radius: 6px;
  border: 1px solid #ececec;
  padding: 0;
  max-height: 300px;
  overflow: auto;

  .ant-dropdown-menu-item {
    border-top-style: solid;
    border-width: 1px;
    border-color: rgba(231, 231, 231, 1);
  }
}
</style>
