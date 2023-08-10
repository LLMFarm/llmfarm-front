<template>
    <div class="chain-market">
      <a-empty v-if="list.length == 0" />
      <template v-else>
        <div class="chains">
          <div v-for="item in list" class="chain-item">
            <div class="chain-scene-container">
              <div v-for="(scene, index) in item.scene" :key="index" class="chain-scene">
                {{ scene.sceneName }}
              </div>
            </div>
            <div class="chain-icon">
              <img v-if="item.icon" :src="item.icon" />
              <img v-else :src="llmFarmIcon" />
              <!-- <div v-else class="chain-default-icon">
                  {{ item.chainTemplateName }}
                </div> -->
            </div>
            <div class="chain-body">
              <div class="chain-title break-word-text" v-html="hightLightText(item.chainTemplateName)"></div>
              <div
                class="chain-desc break-word-text"
                style="-webkit-line-clamp: 2; min-height: 40px"
                v-html="hightLightText(item.desc)"
              ></div>
              <div class="info-box">
                <img class="item-icon" :src="uploaderIcon" />
                <span class="item-text">{{ item.userInfo.name }}</span>
                <img class="item-icon version" :src="versionIcon" />
                <span class="item-text version">{{ item.version }}</span>
                <img class="item-icon" :src="downloadIcon" />
                <span class="item-text">{{ item.downloadCount }}</span>
              </div>
            </div>
            <div class="operate">
              <a-button @click="tryChain(item)">{{$t('home.trial')}}</a-button>
              <a-button v-if="!item.isDownload" type="primary" @click="downloadChainTemplate(item)">{{$t('download')}}</a-button>
              <div v-else class="popover-button">
                <a-popover style="width: 500px" trigger="hover" :visible="hovered" @visibleChange="handleHoverChange">
                  <template #content>
                    <div class="vertical-buttons">
                      <a-button
                        class="rounded-button"
                        style="margin-bottom: 10px"
                        type="primary"
                        @click="coverChainTemplate(item)"
                        >{{$t('home.overwrite')}}</a-button
                      >
                      <a-button class="rounded-button" type="primary" @click="downloadChainTemplate(item)"
                        >{{$t('home.reDownload')}}</a-button
                      >
                    </div>
                  </template>
                  <a-button class="rounded-button" type="primary">{{$t('download')}}</a-button>
                </a-popover>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <loading-outlined v-if="loading && haveMore" />
          {{ moreText }}
          <!-- <a-pagination v-model:current="marketCurrent" v-model:pageSize="marketPageSize" show-size-changer
              :total="marketTotal" @change="onShowSizeChange" @showSizeChange="onShowSizeChange" /> -->
        </div>
      </template>
    </div>
</template>

<script setup>
import { computed, ref, inject } from "vue";
import { useMarketStore } from "@/store/modules/market.js";
import { useChainStore } from "@/store/modules/chain.js";
import { useRouter, useRoute } from "vue-router";
import services from "@/services/index";
import { storeToRefs } from "pinia";
import { ymPoint } from "@/utils/point.js";
import { message } from "ant-design-vue";
import { LoadingOutlined } from "@ant-design/icons-vue";
import { useModelStore } from "@/store/modules/model.js";

const t = inject("$i18nT");
import versionIcon from "@/assets/版本.svg";
import downloadIcon from "@/assets/下载.svg";
import uploaderIcon from "@/assets/上传人.svg";
import llmFarmIcon from "@/assets/LLMFarm占位图.svg";
const modelStore = useModelStore();

const marketStore = useMarketStore();
const { userSearch, chainMarketList, loading, haveMore } =
  storeToRefs(marketStore);

const moreText = computed(() => {
  if (haveMore.value) {
    return t('pullUpLoadMore');
  } else {
    return t('noMore');
  }
});
const chainStore = useChainStore();
//const { SelectMenu } = storeToRefs(chainStore);

const router = useRouter();
const route = useRoute();

const list = computed(() => {
  return chainMarketList.value;
});


const hightLightText = (text) => {
  if (text) {
    const reg = new RegExp(userSearch.value, "gi"); // 动态正则表达式
    return text.replace(reg, `<span class="active">${userSearch.value}</span>`); // 使用replace替换
  }
};
const openTryChain = inject("openTryChain");

const emits = defineEmits(["tryChain"]);
const tryChain = (item) => {
  openTryChain(item);
};

const downloadChainTemplate = async (item) => {
  const res = await services.chain.downloadChainTemplate(item.id, item.templateId);
  if (res.code === 0) {
    message.success(t("success", { msg: t("download") }));
    chainStore.setSelectMenu("chat");
    router.replace({
      name: "chat",
    });
    localStorage.setItem("defaultModel", res.data.id);
    //modelStore.selectById(res.data.id);
  } else {
    message.error(res.message);
  }
};

const coverChainTemplate = async (item) => {
  const res = await services.chain.coverChainTemplate(item.id, item.templateId);
  if (res.code === 0) {
    message.success("覆盖下载成功");
    chainStore.setSelectMenu("chat");
    router.push({
      name: "chat",
    });
    const resBot = await services.chain.chainBotList(res.data[0]);
    modelStore.selectById(resBot.data[0].id);
  } else {
    message.error(res.message);
  }
};

</script>

<style lang="scss" scoped>
.break-word-text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  word-wrap: break-word;
}

.chain-market {
  position: relative;
  z-index: 21;
  width: calc(100% + 10px);
  height: fit-content;

  .chains {
    display: flex;
    flex-wrap: wrap;
    border-top: 1px solid #e7e8e8;
    border-left: 1px solid #e7e8e8;

    .chain-item {
      width: 25%;
      border-right: 1px solid #e7e8e8;
      border-bottom: 1px solid #e7e8e8;
      box-sizing: border-box;
      padding: 48px 28px 32px;
      position: relative;

      .chain-scene-container {
        top: 12px;
        left: 12px;
        position: absolute;
        display: flex;
        flex-direction: row;

        .chain-scene {
          height: 18px;
          background: #f4f5f9;
          border-radius: 4px;
          font-size: 12px;
          color: #a3a2a5;
          line-height: 18px;
          font-style: normal;
          padding: 0 4px;
          margin-right: 8px;
        }
      }

      .chain-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 10px;
        text-align: center;

        & > img {
          display: block;
          width: 70px;
          height: 70px;
          border-radius: 16px;
          margin: 0 auto 12px;
        }

        .chain-default-icon {
          display: block;
          width: 70px;
          height: 70px;
          border-radius: 16px;
          padding-left: 10px;
          padding-right: 10px;
          text-align: center;
          line-height: 70px;
          font-size: 32px;
          background-color: #ecd265;
          color: white;
          border-radius: 8px;
          // white-space: nowrap;           /* 文本不换行 */
          word-wrap: break-word;
          overflow: hidden;
          text-overflow: clip;
        }
      }

      .chain-body {
        padding: 10px;

        & > div {
          margin-bottom: 5px;
        }

        .chain-title {
          word-break: break-all;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-style: normal;
          max-width: 100%;
          font-size: 16px;
          font-family: SourceHanSansSC-Medium, SourceHanSansSC;
          font-weight: 500;
          color: #1b1b1b;
          line-height: 24px;
          text-align: center;
          padding: 0 12px;
          margin-bottom: 6px;
        }

        .chain-desc {
          height: 40px;
          font-size: 14px;
          color: #666;
          line-height: 20px;
          text-align: center;
          margin-bottom: 20px;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          display: -moz-box;
          -moz-line-clamp: 2;
          overflow-wrap: break-word;
          word-break: break-all;
          white-space: normal;
          overflow: hidden;

          & > span {
            font-weight: 500;
            margin-right: 5px;
          }
        }

        .info-box {
          font-size: 12px;
          font-family: SourceHanSansSC-Normal, SourceHanSansSC;
          font-weight: 400;
          color: #aaa;
          line-height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;

          .item-icon {
            width: 12px;
            height: 12px;
            margin-right: 5px;
          }

          .item-text {
            word-break: break-all;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-style: normal;
            max-width: calc(100% - 16px);
            margin-right: 16px;
          }
        }
      }

      .operate {
        display: flex;
        justify-content: space-between;
        padding: 10px;

        & > button {
          border-radius: 4px;
        }

        .rounded-button {
          border-radius: 4px;
          /* 更改这个值来调整按钮的圆角程度 */
        }
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    & > span {
      margin-right: 10px;
    }
  }

  :deep(span.active) {
    color: #1989fa;
  }
}
</style>
<style lang="scss">
.ant-spin-nested-loading {
  width: 100%;
  height: 100%;
  & > div > .ant-spin {
    max-height: 100%;
  }
}
.ant-spin-blur {
  height: 100%;
}
.ant-spin-container {
  height: 100%;
}

.vertical-buttons {
  display: flex;
  flex-direction: column;
}
</style>
