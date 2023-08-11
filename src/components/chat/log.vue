<template>
  <a-drawer
    :width="drawerWidth"
    class="chat-log"
    :title="question"
    :placement="placement"
    v-model:visible="logVisible"
    @close="onClose"
  >
    <template #extra>
      <div @click="changeScreen">
        <arrows-alt-outlined style="font-size: 18px" v-if="!screen" />
        <shrink-outlined style="font-size: 18px" v-else />
      </div>
    </template>
    <a-spin :tip="$t('Loading')" :spinning="spinning">
      <div class="body" v-if="logData.id">
        <div
          class="pdf-preview"
          :style="{ transform: `rotate(${showPdfPreview ? 0 : 180}deg)` }"
          v-if="selectFile.userFile"
          @click="updateShowPdfPreview"
        >
          <double-right-outlined style="font-size: 16px" />
        </div>
        <template v-if="selectFile.userFile && showPdfPreview">
          <div v-if="selectFile.userFile && selectFile.userFile.fileType == 'pdf'" style="width: 100%">
            <!-- <FilePreview :pdfUrl="selectFile.userFile.fileUrl" :search="selectFile.document"  :targetPage="selectFile.pageNumber" /> -->
            <PdfluxPdf
              :pdfUrl="selectFile.userFile.fileUrl"
              :search="selectFile.document"
              :targetPage="selectFile.pageNumber"
            />
          </div>
          <div v-else-if="selectFile.userFile && selectFile.userFile.fileType != 'pdf'" style="width: 100%">
            <PdfPreview
              :pdfUrl="selectFile.userFile.fileUrl"
              :search="selectFile.document"
              :targetPage="selectFile.pageNumber"
            />
          </div>
        </template>
        <div class="log-body">
          <div class="header">
            <div class="use bot">
              <div class="title">{{$t('qna',{msg:$t('bot.name')})}}:</div>
              <div>
                <span class="name">{{ logData.botName }}</span>
                <span class="operate" @click="jump('bot', logData.botId)">{{$t('goToCheck')}}</span>
              </div>
            </div>
            <div class="use chain">
              <div class="title">{{$t('qna',{msg:$t('chain.name')})}}:</div>
              <div>
                <span class="name">{{ logData.chainName }}</span>
                <span class="operate" @click="jump('chain', logData.chainId)">{{$t('goToCheck')}}</span>
              </div>
            </div>
          </div>
          <div class="log-list">
            <LogItem v-for="item in logList" :item="item" />
          </div>
        </div>
      </div>
      <a-empty description="当前回答暂无日志，请重新提问" v-else />
    </a-spin>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, provide, inject, computed, watch } from "vue";
import { ArrowsAltOutlined, ShrinkOutlined, DoubleRightOutlined } from "@ant-design/icons-vue";
import PdfPreview from "@/components/bot/PdfPreview.vue";
import FilePreview from "@/components/bot/FilePreview.vue";
import PdfluxPdf from "@/components/pdflux-pdf/index.vue";

import services from "@/services/index";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useDialogStore } from "@/store/modules/dialog";
import LogItem from "./LogItem.vue";

const dialogStore = useDialogStore();
const { dialogTree } = storeToRefs(dialogStore);
const router = useRouter();

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  selectAnswer: {
    type: Object,
    default: { title: "报价单如何盖章若显示不全，那么就在最后的时候，报价单如何盖章若显示不全，那么就在最后的时候，" },
  },
});
const emit = defineEmits(["update:show"]);
const selectFile = ref({});

const openFile = (item) => {
  console.log("打开文件", item);
  showPdfPreview.value = true;
  selectFile.value = item;
};
provide("openFile", openFile);

const logVisible = computed({
  get: () => props.show,
  set: (val) => emit("update:show", val),
});
const logList = ref([]);
const logData = ref({});
const spinning = ref(false);
const showPdfPreview = ref(false);
const screen = ref(false);

const updateShowPdfPreview = () => {
  showPdfPreview.value = !showPdfPreview.value;
};

const onClose = () => {
  selectFile.value = {};
  showPdfPreview.value = false;
};

const drawerWidth = computed(() => {
  if (screen.value) return "100%";
  return "1000";
  // return "auto";
});

const changeScreen = () => {
  screen.value = !screen.value;
};

const question = computed(() => {
  if (!dialogTree.value[props.selectAnswer.parent]) return "";
  return dialogTree.value[props.selectAnswer.parent].message.content?.parts[0] || "";
});

const title = computed(() => {
  if (!props.selectAnswer.message) return "";
  return props.selectAnswer.message.content?.parts[0] || "";
});

const jump = (key, id) => {
  let info = { name: key };
  info.params = {};
  info.params[`${key}Id`] = id;
  const href = router.resolve(info);
  console.log(info, href.href);
  window.open(href.href, "_blank");
};
const getMessageLog = async () => {
  if (!props.selectAnswer.realId) return;
  spinning.value = true;
  try {
    const res = await services.messages.getMessageLog(props.selectAnswer.realId);
    if (res.code === 0) {
      if (!res.data.id) return;
      logData.value = res.data;
      logList.value = res.data.results?.map((item) => {
        //时间戳转日期
        item.time = new Date(item.time).toLocaleString();
        return item;
      });
    }
    spinning.value = false;
  } catch (error) {
    console.error(error);
    spinning.value = false;
  }
};

watch(
  () => props.show,
  (val) => {
    if (val) {
      getMessageLog();
    } else {
      logList.value = [];
      logData.value = {};
    }
  }
);

defineExpose({});
</script>

<style lang="scss" scoped>
.body {
  height: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  .pdf-preview {
    width: 30px;
    height: 30px;
    position: fixed;
    right: 485px;
    top: 55px;
    z-index: 11111;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
  }
  .log-body {
    min-width: 500px;
    width: 100%;
    display: flex;
    flex-direction: column;
    .header {
      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        background-color: rgba(247, 247, 248, 1);
        border: 1px solid rgba(231, 231, 231, 1);

        .title {
          color: rgba(79, 86, 99, 1);
          font-size: 16px;
          width: 100px;
        }

        .name {
          color: rgba(118, 119, 126, 1);
          font-size: 14px;
          margin-right: 10px;
        }

        .operate {
          color: rgba(57, 105, 214, 1);
          font-size: 14px;
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
  }
  .log-list {
    height: 100%;
    overflow: auto;
    padding: 18px;

    .item {
      height: fit-content;
      margin-bottom: 10px;

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        .name {
          color: rgba(70, 78, 92, 1);
          font-weight: 500;
          font-size: 18px;
          max-width: 70%;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          word-wrap: break-word;
        }

        .time {
          color: rgba(118, 119, 126, 1);
          font-size: 14px;
        }
      }

      .content {
        background-color: rgba(247, 247, 248, 1);
        border-radius: 10px;
        padding: 16px;
      }
    }
  }
}
</style>
<style lang="scss">
.ant-drawer-content-wrapper {
  min-width: 500px;
}
.chat-log {
  .ant-drawer-title {
    width: 100%;
    height: 22px;
    //超出显示。。。
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    word-wrap: break-word;
  }

  .ant-drawer-body {
    padding: 0px;

    .ant-empty {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      .ant-empty-image {
        height: fit-content;
      }
    }
  }
}
</style>
