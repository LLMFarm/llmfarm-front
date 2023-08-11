<template>
  <div class="home-market">
    <div class="search-title">
      <span>{{ `Chain ${$t("home.market")}` }}</span>
      <div class="search">
        <a-input-search
          v-model:value="searchValue"
          :placeholder="$t('home.chainSearchPlaceholder')"
          style="width: 300px"
          enter-button
          @search="search"
        />
      </div>
    </div>
    <div class="filter-container">
      <div class="filter-item" v-for="(item, index) in filters">
        <div class="prompt-filter-title">{{ item.name }}</div>
        <div class="filter-list">
          <a-radio-group
            class="filter-group"
            v-model:value="selectOption[item.key]"
            size="small"
            @change="selectFilter(item)"
          >
            <a-radio-button
              class="filter-button"
              v-for="(optionItem, optionIndex) in item.option"
              :value="optionItem.id"
              >{{ optionItem.name }}</a-radio-button
            >
          </a-radio-group>
        </div>
      </div>
    </div>
    <div class="sort">
      <div class="sort-title">{{ $t("sort") }}</div>
      <div
        class="slot-item"
        v-for="(item, index) in slotsConfig"
        @click="changeSlot(item)"
        :style="{ color: item.type == 'default' && selectSlots[item.key] == 'desc' ? '#1890ff' : 'inherit' }"
      >
        {{ item.name }}
        <div class="slot-icon" v-if="item.type !== 'default'">
          <UpOutlined :style="{ color: selectSlots[item.key] == 'asc' ? '#1890ff' : 'inherit' }" />
          <DownOutlined :style="{ color: selectSlots[item.key] == 'desc' ? '#1890ff' : 'inherit' }" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import services from "@/services/index";

import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMarketStore } from "@/store/modules/market.js";
import ChainMarket from "@/components/chain/ChainMarket.vue";
import { DownOutlined, UpOutlined } from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
// import screenConfig from "@/components/chain/screenConfig/screen";
const route = useRoute();
const router = useRouter();

const marketStore = useMarketStore();
const { screenConfig, selectOption, slotsConfig, selectSlots } = storeToRefs(marketStore);
const filters = computed(() => screenConfig.value);

// const slots = ref([t('createTime')]);
//const selectSlots = ref([1]);

const changeSlot = ({ key, type }) => {
  let newSlot = "";
  if (type == "default") {
    switch (selectSlots.value[key]) {
      case "":
        newSlot = "desc";
        break;
      default:
        newSlot = "desc";
        break;
    }
  } else {
    switch (selectSlots.value[key]) {
      case "":
        newSlot = "asc";
        break;
      case "asc":
        newSlot = "desc";
        break;
      case "desc":
        newSlot = "asc";
        break;
      default:
        newSlot = "asc";
        break;
    }
  }
  Object.keys(selectSlots.value).forEach((item) => {
    if (item != key) {
      selectSlots.value[item] = "";
    }
  });
  selectSlots.value[key] = newSlot;
  marketStore.getChainTemplateList();
};
const searchValue = ref("");
// 模糊搜索
const inputMatch = (text = "") => {
  let a = searchValue.value || "";
  let str = ["", ...a, ""].join(".*"); //转化成正则格式的字符串
  let reg = new RegExp(str); //正则
  return reg.test(text || ""); //去匹配待查询的字符串
};

const search = () => {
  marketStore.resetMarketCurrent();
  marketStore.setUserSearch(searchValue.value);
};

const selectFilter = async (item) => {
  marketStore.resetMarketCurrent();
  await marketStore.getChainTemplateList();
};

//生命周期
onMounted(() => {});
//生命周期
onBeforeUnmount(() => {
  marketStore.resetSelectOption();
});
</script>
<style lang="scss" scoped>
.home-market {
  width: 100%;
  height: fit-content;

  .search-title {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    color: #000;
    font-weight: 500;
    font-size: 18px;
    line-height: 32px;
    margin-bottom: 16px;

    .search {
      display: flex;
      justify-content: space-between;
      align-items: center;

      button {
        margin-left: 10px;
      }
    }
  }

  .filter-container {
    margin-bottom: 14px;
    .filter-item {
      display: flex;
      width: 100%;
      height: fit-content;
      align-items: start;
      // margin-bottom: 6px;
      border-bottom: 1px dotted #f1f2f3;
    }

    .prompt-filter-title {
      writing-mode: horizontal-tb;
      flex-basis: 100px;
      margin-right: 10px;
      margin-top: 8px;
      flex-shrink: 0;
    }

    .scene-filter-title {
      writing-mode: horizontal-tb;
      flex-basis: 100px;
      flex-grow: 1;
      margin-right: 10px;
    }

    .filter-list {
      display: flex;
      margin-left: 0px;

      .filter-group {
        display: flex;
        flex-wrap: wrap;

        .filter-button {
          // flex-basis: 120px;
          width: max-content;
          margin: 8px 8px 8px 0;
          border-radius: 23px;
          font-size: 14px;
          font-weight: 400;
          text-align: center;
          // line-height: 30px;
          border-width: 0px;
          // color: #8d8d91;
          box-shadow: none;
        }
      }

      :deep(.ant-radio-button-wrapper:not(:first-child)::before) {
        background-color: transparent;
        display: none;
      }
    }
  }
  .sort {
    display: flex;
    width: 100%;
    margin-bottom: 14px;
    user-select: none;
    cursor: pointer;
    .sort-title {    
      flex-basis: 100px;
      margin-right: 16px;
    }
    .slot-item {
      margin-right: 14px;
      display: flex;
      align-items: center;
      .slot-icon {
        margin-left: 5px;
        font-size: 8px;
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
