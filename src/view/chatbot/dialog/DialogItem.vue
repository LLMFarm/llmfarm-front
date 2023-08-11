<template>
  <div
    class="dialog-item"
    :class="dialogRole == 'user' ? 'dialog-item-user' : 'dialog-item-bot'"
    v-if="dialog.id !== 'ROOT'"
  >
    <div class="dialog">
      <div class="head no-select">
        <div class="switch" v-if="dialogLength > 1">
          <el-icon class="switch-icon" :class="{ 'icon-disable': currentDialog == 1 }" @click="switchDialog('PRV')">
            <ArrowLeft />
          </el-icon>
          <span class="switch-text number-now">{{ currentDialog }}</span>
          <span class="switch-text separate">/</span>
          <span class="switch-text number-total">{{ dialogLength }}</span>
          <el-icon
            class="switch-icon"
            :class="{ 'icon-disable': currentDialog == dialogLength }"
            @click="switchDialog('NEXT')"
          >
            <ArrowRight />
          </el-icon>
        </div>
        <a-checkbox v-model:checked="dialog.context" v-if="openContext" style="margin-right: 10px"> </a-checkbox>
        <img class="head-icon" src="@/assets/avatar.svg" v-if="dialogRole == 'user'" />
        <img class="head-icon" :src="botIcon" v-if="dialogRole == 'assistant' && botIcon" />
        <img class="head-icon" :src="llmFarmIcon" v-if="dialogRole == 'assistant' && !botIcon" />
      </div>
      <div class="body">
        <div class="title" v-if="dialogRole == 'assistant'">{{ tryChain.chainTemplateName || dialog.botName }}</div>
        <div class="text" :class="[`theme-${themeStoreX.theme}-dialog-${dialogRole == 'user' ? 'user' : 'bot'}`]">
          <MarkdownRender
            v-if="!reAnswerShow"
            :markdown="dialog.message.content.parts[0]"
            :class="{
              'result-streaming': streamingClass,
              'result-streaming-wait': streamingClass && dialog.message.content.parts[0] == '',
            }"
          />
          <template v-if="reAnswerShow">
            <el-input
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 50 }"
              v-model="reAnswerContent"
              ref="reAnswerInput"
              class="text-input"
              size="large"
            />
            <div class="text-op">
              <el-button type="success" color="#12A37F" @click="reAnswer"> {{ $t("chat.reAsk") }}</el-button>
              <el-button @click="reAnswerCancel"> {{ $t("cancel") }}</el-button>
            </div>
          </template>
        </div>
        <div class="operate operate-user" v-if="dialogRole == 'user'">
          <div v-if="!reAnswerShow" class="icon-container" @click="showReAnswer">
            <FormOutlined class="icon" />
          </div>
        </div>
        <div class="operate flex" v-if="dialogRole == 'assistant'">
          <div class="icon-container">
            <a-tooltip>
              <template #title>{{ $t("copy") }}</template>
              <CopyOutlined class="icon" v-if="!copyStatus" @click="contentCopy" />
              <CheckOutlined class="icon" v-else />
            </a-tooltip>
          </div>
          <div class="icon-container" v-if="false && dialog.realId && !tryChain.id">
            <a-tooltip>
              <template #title>{{ $t("chat.log") }}</template>
              <ContainerOutlined @click="openLog" />
            </a-tooltip>
          </div>
          <div class="icon-container" v-if="false">
            <LikeOutlined class="icon" />
          </div>
          <div class="icon-container" v-if="false">
            <LikeOutlined class="icon" :rotate="180" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <DialogItem v-if="dialogChildLength" :dialog="next" @switchNextDialog="switchNextDialog" />
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, inject } from "vue";
import { storeToRefs } from "pinia";
import { LikeOutlined, FormOutlined, CopyOutlined, CheckOutlined, ContainerOutlined } from "@ant-design/icons-vue";
import { useDialogStore } from "@/store/modules/dialog";
import { useChatStore } from "@/store/modules/chat.js";
import MarkdownRender from "@/components/markdown/Index.vue";
import { themeStore } from "/src/store/modules/theme.js";
import { message } from "ant-design-vue";
import llmFarmIcon from "@/assets/LLMFarm占位图.svg";

const themeStoreX = themeStore();
const t = inject("$i18nT");
const emit = defineEmits(["switchNextDialog"]);
const props = defineProps({
  dialog: {
    type: Object,
    default: {},
  },
});
const inMobil = window.matchMedia("(max-width: 767px)").matches;

const dialogStore = useDialogStore();
const chatStore = useChatStore();
const { dialogTree, lastDialogId, genStatus } = storeToRefs(dialogStore);
const { openContext } = storeToRefs(chatStore);

const currentDialog = computed(() => {
  const parentId = props.dialog.parent;
  return dialogTree.value[parentId].children.indexOf(props.dialog.id) + 1;
});

const nextCurrentDialog = ref(0);

watch(
  () => Object.keys(dialogTree.value),
  (newVal, oldVal) => {
    // console.log("???", props.dialog.children, newVal, oldVal);
    props.dialog.children.forEach((item, index) => {
      if (dialogTree.value[item]?.active == 1) {
        nextCurrentDialog.value = index;
      }
    });
  }
);
const next = computed(() => {
  const nextId = props.dialog.children[nextCurrentDialog.value];
  return dialogTree.value[nextId];
});

const dialogRole = computed(() => {
  return props.dialog.message.author.role;
});
const dialogChildLength = computed(() => {
  return props.dialog.children.length;
});

const dialogLength = computed(() => {
  const parentId = props.dialog.parent;
  return dialogTree.value[parentId].children.length;
});

const reAnswerShow = ref(false);
const reAnswerContent = ref("");
const reAnswerInput = ref(null);
const showReAnswer = () => {
  reAnswerShow.value = true;
  reAnswerContent.value = props.dialog.message.content.parts[0];
  nextTick(() => {
    //判断是否在移动端
    if (!inMobil) {
      reAnswerInput.value.focus();
    }
  });
};
const reAnswerCancel = () => {
  reAnswerContent.value = "";
  reAnswerShow.value = false;
};

const streamingClass = computed(() => {
  // return true;
  return genStatus.value && lastDialogId.value == props.dialog.id;
});
const reQuestion = inject("reQuestion");
const tryChain = inject("tryChain");
const showLog = inject("showLog");

const botIcon = computed(() => {
  return tryChain.icon || props.dialog.icon;
});

const reAnswer = () => {
  console.log("reAnswer", reAnswerContent.value);
  if (!reAnswerContent.value) {
    return;
  }
  reQuestion({
    content: reAnswerContent.value,
    parentId: props.dialog.parent,
    realId: props.dialog.realId,
  });
  reAnswerCancel();
};

const openLog = () => {
  showLog(props.dialog);
};

const switchDialog = (target) => {
  if (!target) {
    return;
  }
  nextCurrentDialog.value = 0;
  if (target == "NEXT" && currentDialog.value != dialogLength.value) {
    emit("switchNextDialog", "NEXT");
  }
  if (target == "PRV" && currentDialog.value != 1) {
    emit("switchNextDialog", "PRV");
  }
};

const switchNextDialog = (target) => {
  if (target == "NEXT") {
    nextCurrentDialog.value++;
  }
  if (target == "PRV") {
    nextCurrentDialog.value--;
  }

  // 重新设置active
  const childIds = props.dialog.children;
  childIds.forEach((child) => {
    dialogTree.value[child].active = 0;
  });
  dialogTree.value[childIds[nextCurrentDialog.value]].active = 1;
};

const copyStatus = ref(false);
const copyToClipboard = (text) => {
  const input = document.createElement("textarea");
  input.style.position = "fixed";
  input.style.opacity = 0;
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand("Copy");
  document.body.removeChild(input);
};
const contentCopy = () => {
  const content = props.dialog.message.content.parts[0];
  copyToClipboard(content);
  copyStatus.value = true;
  message.success(t("success", { msg: t("copy") }));
  setTimeout(() => {
    copyStatus.value = false;
  }, 3000);
};

// 更新当前最后的会话ID
watch(
  () => props.dialog.id,
  (val) => {
    dialogStore.setLastDialogId(val);
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.dialog-item-user {
  background-color: #fff;

  .operate-user {
    display: none;
  }

  &:hover .operate-user {
    display: flex;
  }
}

.dialog-item-bot {
  background-color: #f7f7f8;
}

.flex {
  display: flex;
}

.dialog-item {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  .dialog {
    width: 70%;
    display: flex;
    z-index: 20;
    position: relative;

    .head {
      margin-right: 25px;
      position: relative;

      .switch {
        position: absolute;
        left: -65px;
        height: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .switch-icon {
          width: 10px;
          height: 10px;
          cursor: pointer;
        }

        .icon-disable {
          cursor: default;
          color: #dbdbe3;
        }

        .switch-text {
          font-size: 10px;
        }

        .number-now {
          margin-left: 3px;
        }

        .number-total {
          margin-right: 3px;
        }

        .separate {
          margin: 0 2px;
        }
      }

      .head-icon {
        width: 30px;
        height: 30px;
        border-radius: 4px;
      }

      :deep(.ant-checkbox-checked .ant-checkbox-inner) {
        background-color: rgb(87, 188, 117);
        border-color: rgb(87, 188, 117);
      }

      :deep(
          .ant-checkbox-wrapper:hover .ant-checkbox-inner,
          .ant-checkbox:hover .ant-checkbox-inner,
          .ant-checkbox-input:focus + .ant-checkbox-inner
        ) {
        border-color: rgb(87, 188, 117);
      }
    }

    .body {
      width: calc(100% - 142px);
      position: relative;

      .title {
        font-size: 13px;
        color: rgb(52 53 65 / 50%);
        font-weight: 500;
        margin-bottom: 10px;
      }

      .text {
        font-size: 16px;
        color: #343541;
        width: 100%;
        overflow-x: auto;
        .text-input {
          margin-top: -6px;
          font-size: 16px;
        }

        .text-op {
          margin-top: 10px;
          width: 100%;
          height: fit-content;
          text-align: center;
        }
      }

      .operate {
        width: 82px;
        margin-left: 5px;
        position: absolute;
        right: -87px;
        top: 0px;
        z-index: 11;

        .icon-container {
          width: 24px;
          height: 24px;
          cursor: pointer;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #acadbf;

          &:hover {
            background-color: #ececf1;
            color: #40414f;
          }

          &:not(:first-child) {
            margin-left: 5px;
          }
        }
        .icon {
          font-size: 16px;
        }
      }
    }
  }
}

.no-select {
  -webkit-user-select: none;
  /* Chrome/Safari */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* IE10+ */
  user-select: none;
  /* Standard syntax */
}

:deep(.el-input__wrapper) {
  box-shadow: none;
  padding: 0;
}

:deep(.el-input__inner) {
  color: #343541;
}

.result-streaming-wait:after,
.result-streaming > :not(ol):not(ul):not(pre):last-child:after,
.result-streaming > ol:last-child li:last-child:after,
.result-streaming > pre:last-child code:after,
.result-streaming > ul:last-child li:last-child:after {
  animation: blink 1s steps(5, end) infinite;
  content: "▋";
  vertical-align: baseline;
  margin-left: 0.25rem;
}

@keyframes blink {
  0% {
    opacity: 0.3;
  }

  100% {
    opacity: 1;
  }
}
</style>
