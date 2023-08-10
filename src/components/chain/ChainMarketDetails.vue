<template>
  <div class="chain-market-details">
    <div class="title"><left-outlined style="margin-right: 10px" @click="back" />{{ chain.chainTemplateName }}</div>
    <div class="content">
      <div class="collapse-list">
        <a-collapse v-model:activeKey="activeKey" ghost>
          <template v-for="(item, index) in list">
            <a-collapse-panel v-if="item.chainTemplateStatus !== '下架'" :key="index" :header="`版本${item.version}`">
              <div class="collapse-body">
                <div class="collapse-item">
                  <div class="collapse-title">版本号</div>
                  <div class="collapse-desc">{{ item.version }}</div>
                </div>
                <div class="collapse-item">
                  <div class="collapse-title">{{ $t("uploader") }}</div>
                  <div class="collapse-desc">
                    <span v-html="hightLightText(uploaderName)"></span>
                  </div>
                </div>
                <div class="collapse-item">
                  <div class="collapse-title">{{ $t("uploadTime") }}</div>
                  <div class="collapse-desc">{{ item.createTime }}</div>
                </div>
                <div class="collapse-item">
                  <div class="collapse-title">{{ $t("desc") }}</div>
                  <div class="collapse-desc">{{ item.desc }}</div>
                </div>
                <div class="collapse-item">
                  <div class="collapse-title">版本描述</div>
                  <div class="collapse-desc">{{ item.versionDesc }}</div>
                </div>
                <!-- <div class="collapse-item">
                    <div class="collapse-title">场景</div>
                    <div class="collapse-desc">
                      <div class="tag-item" v-for="tag in item.tags">
                        {{ tag }}
                      </div>
                    </div>
                  </div> -->
                <div class="collapse-item">
                  <div class="collapse-title">操作</div>
                  <div class="collapse-desc">
                    <a-button style="margin-right: 10px" size="small" @click="openTryChain(item)">试用</a-button>
                    <a-button type="primary" size="small" @click="downloadChainTemplate(item)">下载</a-button>
                  </div>
                </div>
              </div>
            </a-collapse-panel>
          </template>
        </a-collapse>
      </div>
      <div class="pagination">
        <!-- <a-pagination
            v-model:current="current"
            v-model:pageSize="pageSize"
            show-size-changer
            :total="total"
            @showSizeChange="onShowSizeChange"
          /> -->
      </div>
    </div>
  </div>
  <a-drawer height="90%" placement="bottom" v-model:visible="visible" @close="onClose" @afterVisibleChange="onChange">
    <template #title>
      <div class="title">
        <div class="name">{{ tryChain.chainTemplateName }}</div>
        <div class="desc">{{ tryChain.desc }}</div>
      </div>
    </template>
    <div class="tryChain">
      <DialogList ref="dialogList" :probation="true" :tryChain="tryChain"></DialogList>
    </div>
  </a-drawer>
</template>

<script setup>
import { inject, onMounted, onBeforeUnmount, ref } from "vue";
import { useChatStore } from "@/store/modules/chat.js";
import { useDialogStore } from "@/store/modules/dialog";
import { useChainStore } from "@/store/modules/chain.js";
import { useRouter, useRoute } from "vue-router";
import services from "@/services/index";
import { storeToRefs } from "pinia";
import { ymPoint } from "@/utils/point.js";
import { message } from "ant-design-vue";
import { LeftOutlined } from "@ant-design/icons-vue";
import DialogList from "@/view/chatbot/dialog/DialogList.vue";
import waterMark from "@/utils/warterMark.js";

import { useLoginStore } from "@/store/modules/user.js";

const loginStore = useLoginStore();

const t = inject("$i18nT");
const chatStore = useChatStore();
const dialogStore = useDialogStore();

const chainStore = useChainStore();
//const { SelectMenu } = storeToRefs(chainStore);

const dialogList = ref();

const router = useRouter();
const route = useRoute();

const { uploaderName } = route.params;

const chain = ref({});
const visible = ref(false);

const list = ref([]);

const current = ref(1);
const pageSize = ref(10);
const total = ref(10);

const activeKey = ref([0]);

const back = () => {
  router.back();
};

const clearDialog = () => {
  chatStore.selectConversation({});
  dialogStore.clearDialogTree();

  // dialogList.value.question = "";
};

const openTryChain = (item) => {
  clearDialog();
  visible.value = true;
  console.log("=============", item);
  tryChain.value = item;
};

const onChange = (visible) => {
  if (visible) {
    let user = loginStore.userInfo?.encryptionPhone;
    waterMark.setTryChain(user, t('markText'), "ant-drawer-body");
  }
};

const onClose = () => {
  const res = services.messages.stopAnswer("temporary");
  if (res.code == 0) {
    // message.success("停止成功");
  } else {
    // message.error("停止失败");
  }
};

const tryChain = ref({});

const getChainTemplateVersionList = async (fatherId) => {
  const res = await services.chain.chainTemplateVersionList(fatherId);
  if (res.code === 0) {
    list.value = res.data;
  }
};

const init = async () => {
  const { chainTemplateId } = route.params;
  const res = await services.chain.getChainTemplate(chainTemplateId);
  if (res.code === 0) {
    chain.value = res.data;
    getChainTemplateVersionList(res.data.fatherId);
  }
};
init();

const downloadChainTemplate = async (item) => {
  const { templateInfoId } = route.params;
  const res = await services.chain.downloadChainTemplate(templateInfoId, item.id);
  if (res.code === 0) {
    message.success(t("success", { msg: t("download") }));
    chainStore.setSelectMenu("chat");
    //localStorage.setItem("defaultModel", item.botId);
    router.push({
      name: "chat",
    });
    modelStore.selectById(res.data.id);
  } else {
    message.error(res.message);
  }
};

const searchValue = ref("");
const hightLightText = (text) => {
  if (text) {
    const reg = new RegExp(searchValue.value, "gi"); // 动态正则表达式
    return text.replace(reg, `<span class="active">${searchValue.value}</span>`); // 使用replace替换
  }
};

onMounted(() => {});

onBeforeUnmount(() => {
  //waterMark.remove();
});
</script>

<style lang="scss" scoped>
.chain-market-details {
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 22;

  .title {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0px 14px;
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    background-color: #fff;
    position: relative;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  }
  .content {
    width: 100%;
    height: calc(100% - 60px);
    padding: 24px;
    .collapse-list {
      width: 100%;
      height: calc(100% - 42px);
      overflow: auto;
      .collapse-body {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .collapse-item {
          width: 100%;
          height: 60px;
          display: flex;
          align-items: center;
          padding: 0px 14px;
          border-bottom: 1px solid #f0f0f0;
          .collapse-title {
            width: 100px;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
          }
          .collapse-desc {
            width: calc(100% - 100px);
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.65);
            .tag-item {
              height: 24px;
              line-height: 24px;
              padding: 0px 8px;
              margin-right: 8px;
              border-radius: 2px;
              background-color: #f0f0f0;
              font-size: 12px;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.65);
            }
          }
        }
      }
    }
    .pagination {
      margin-top: 10px;
      display: flex;
      justify-content: end;
    }
  }
  :deep(span.active) {
    color: #1989fa;
  }
}
</style>
<style lang="scss">
.tryChain .dialog-list {
  height: calc(90vh - 82px - 48px - 200px) !important;
  padding-bottom: 0 !important;
}
.ant-drawer {
  .title {
    .name {
      font-size: 20px;
      font-weight: 500;
      text-align: center;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 5px;
    }
    .desc {
      font-size: 14px;
      font-weight: 400;
      text-align: center;
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>
