<template>
  <div class="details">
    <div class="menu">
      <div class="left">
        <img class="chain-icon" src="/src/assets/chain/botSelect.png" />
        <div class="title">{{ `${selectedBot.botName} / ${selectedBot.chainName}` }}</div>
        <span class="system" v-if="disabledBot">(当前bot仅可查看)</span>
      </div>
    </div>
    <a-spin :tip="$t('loading')" :spinning="botSpinning" :delay="500"> </a-spin>
  </div>
</template>
<script setup>
import { computed, ref, nextTick, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import services from "@/services/index";
import { useBotStore } from "@/store/modules/bot.js";
import { storeToRefs } from "pinia";
import { ymPoint } from "@/utils/point.js";
import { message } from "ant-design-vue";
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons-vue";

const router = useRouter();
const route = useRoute();
const botStore = useBotStore();
const { selectedBot, botSpinning } = storeToRefs(botStore);
const illustrate = computed(() => {
  if (!selectedBot.value.id) return "";
  return `${selectedBot.value.botName || "Bot"} / ${selectedBot.value.chainName || "关联Chain"}`;
});
const paramBotId = computed(() => {
  const { botId } = route.params;
  return botId;
});
const useKnowledge = computed(() => {
  return selectedBot.value.useKnowledge;
});
const disabledBot = computed(() => {
  return selectedBot.value.userPermission == "view";
});
</script>

<style lang="scss" scoped>
.details {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100%;
  width: 100%;

  .menu {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 14px;
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    background-color: #fff;
    position: relative;
    z-index: 22;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    .left {
      display: flex;
      align-items: center;
    }

    .chain-icon {
      width: 16px;
      height: 16px;
    }

    .title {
      padding: 0 14px;
    }

    .system {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
    }

    .menu-list {
      display: flex;
    }

    .menu-item {
      padding: 10px;
      margin: 0 10px;
      cursor: pointer;

      &.active {
        border-bottom: 1px solid #1890ff;
      }
    }
  }

  :deep(.ant-spin) {
    height: calc(100% - 60px);
    width: 100%;
    position: absolute;
    z-index: 222;
    top: 60px;
    left: 0px;
  }
}

.need-update {
  position: absolute;
  top: 23px;
  right: -40px;
}
</style>
