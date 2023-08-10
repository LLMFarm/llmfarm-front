<template>
  <div class="dialog-container">
    <div id="dialogList" class="dialog-list" :class="'theme-' + themeStoreX.theme + '-background'">
      <DialogRender v-if="hasDialog" @reQuestion="reQuestion" />
      <Guide
        v-else
        class="guide"
        :showContent="false"
        :guideObj="GuideData"
        :guideName="systemName"
        @guideSelect="guideSelect"
      />
    </div>
    <div class="fixed-bottom" :class="'theme-' + themeStoreX.theme">
      <div class="dialog-foot">
        <el-button :class="['dialog-foot-btn', !probation ? 'probation' : '']" v-if="genStatus" @click="stopAnswer">
          <el-icon class="reload-icon"> <div class="icon"></div> </el-icon>
          {{ $t("chat.stopAnswer") }}
        </el-button>

        <el-button class="dialog-foot-btn" v-else-if="hasDialog && !disabledInput" @click="reAnswer">
          <el-icon class="reload-icon"> <Refresh /> </el-icon>
          {{ $t("chat.reGenerateAnswer") }}
        </el-button>
        <div class="dialog-question">
          <SelectModel v-show="false"></SelectModel>
          <div class="bot"></div>

          <a-dropdown :trigger="['click']" v-model:visible="showModel" placement="top">
            <template #overlay>
              <a-menu class="select-chat-model">
                <a-menu-item v-for="dialog in dialogOptions" :key="dialog.id" @click="selectDialog(dialog)">
                  <UserOutlined />
                  <div :class="['menu-item', dialog.id == defaultDialog.id ? 'select' : '']">
                    {{ dialog.round }}
                    <CheckOutlined v-if="dialog.id == defaultDialog.id" />
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
            <div class="context-switch">
              <div class="dialog">{{ defaultDialog.id }}</div>
            </div>
          </a-dropdown>

          <div class="dialog-foot-input">
            <div class="question" v-if="!probation">
              <div class="title" @click="botIconClick">
                <img class="head-icon" v-if="botIcon" :src="botIcon" />
                <img class="head-icon" v-else :src="llmFarmIcon" />
                <div>
                  <span class="name">{{ defaultModel.botName }}</span>
                  <span class="desc">{{ defaultModel.desc }}</span>
                </div>
              </div>
            </div>
            <ChatInput
              v-model:value="question"
              ref="chatInput"
              :options="completionOptions"
              :disabledInput="disabledInput"
              :disabledPlaceholder="$t('chat.currentUsageExceeded')"
              @askQuestion="askQuestion"
              @select="selectBot"
              @upgrade="upgrade"
            />
          </div>
          <div class="send-icon-flex">
            <div class="send-icon-container" :class="{ 'send-icon-active': question }" @click="askQuestion">
              <a-config-provider :autoInsertSpaceInButton="false">
                <a-button type="primary" :loading="genStatus" :disabled="question.trim() === ''">{{
                  $t("send")
                }}</a-button>
              </a-config-provider>
            </div>
          </div>
          <div class="prompt">{{ `${$t("chat.sendHintPlaceholder")}, ${$t("chat.enterToSwitchBot")}` }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, reactive, computed, onMounted, nextTick, watch, onBeforeUnmount, provide, h, inject } from "vue";
import DialogRender from "./DialogRender.vue";
import { useDialogStore } from "@/store/modules/dialog";
import { useChatStore } from "@/store/modules/chat";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import service from "@/services";
import Guide from "@/components/question-guide/Guide.vue";
import { themeStore } from "/src/store/modules/theme.js";
import { useRouter, useRoute } from "vue-router";
import { throttle } from "lodash";
import { MessageOutlined } from "@ant-design/icons-vue";
import { useModelStore } from "@/store/modules/model.js";
import exampleData from "./modelData/exampleData";
import { message } from "ant-design-vue";
import SelectModel from "@/components/question-guide/SelectModel.vue";
import { useLoginStore } from "@/store/modules/user.js";
import ChatInput from "@/components/chat/input.vue";
// 机器人列表
import { useBotStore } from "@/store/modules/bot";
import { useChainStore } from "@/store/modules/chain";
import llmFarmIcon from "@/assets/LLMFarm占位图.svg";

const t = inject("$i18nT");

const props = defineProps({
  probation: {
    type: Boolean,
    default: false,
  },
  tryChain: {
    type: Object,
    default: {},
  },
});
provide("probation", props.probation);
provide("tryChain", props.tryChain);

const botStore = useBotStore();
const chainStore = useChainStore();

const chatInput = ref();
botStore.init();
const EDITION = import.meta.env.VITE_EDITION || "ENTERPRISE";
const isPersonal = computed(() => {
  return EDITION === "PERSONAL";
});
function getFirstEmoji(str) {
  if (!str) return "";
  const regex = /\p{Emoji}/u;
  const match = str.match(regex);

  if (match) {
    const emoji = match[0];
    const index = str.indexOf(emoji);
    const firstEmoji = str.substring(index, index + emoji.length);
    return firstEmoji;
  }

  return str[0]; // 如果字符串中没有表情符号，返回 null 或其他适当的值
}
const showPayList = ref(false);
const botIconClick = () => {
  if (disabledInput.value) {
    return;
  }
  question.value = "/";
  nextTick(() => {
    console.log("chatInput", chatInput.value.openAutoComplete);
    chatInput.value.autoCompleteInput.focus();
    chatInput.value.openAutoComplete = true;
    // document.getElementById("input-box")?.focus();
  });
};
const logVisible = ref(false);
const selectLogDialog = ref({});
const showLog = (dialog) => {
  logVisible.value = true;
  selectLogDialog.value = dialog;
};
provide("showLog", showLog);

const completionOptions = computed(() => {
  return botStore.completionOptions;
});

const selectBot = (botId) => {
  modelStore.selectById(botId);
};

const options = computed(() => {
  return modelStore.options;
});

const loginStore = useLoginStore();
const { systemName } = storeToRefs(loginStore);

const modelStore = useModelStore();
const { defaultModel, modelList } = storeToRefs(modelStore);

const router = useRouter();
const route = useRoute();

const themeStoreX = themeStore();
const messageService = service.messages;

const dialogStore = useDialogStore();
const chatStore = useChatStore();

const question = ref("");
const visibleBotConfig = ref(false);

console.log("exampleData", exampleData, defaultModel.value.id);
const GuideData = computed(() => {
  return exampleData[(defaultModel.value && defaultModel.value.id) || 1] || [];
});

const inputStyle = reactive({
  fontSize: "16px",
  color: "#000000",
});
const inMobil = window.matchMedia("(max-width: 767px)").matches;
// 当前选中的会话
const { selectedConversation, conversations, dialogOptions, defaultDialog, userDailyUsageList, openContext } =
  storeToRefs(chatStore);

const disabledInput = computed(() => {
  return false;
  if (!isPersonal.value) {
    return false;
  }
  if (!userDailyUsageList.value[0]) {
    return false;
  }
  let info = userDailyUsageList.value[0];
  return info.dailyTokens < info.usageToken;
});

const showModel = ref(false);

const botIcon = computed(() => {
  return defaultModel.value && defaultModel.value.icon;
});
const selectDialog = (item) => {
  // defaultDialog.value = item;
  chatStore.updateDefaultDialog(item);
  showModel.value = false;
  if (selectedConversation.value.contextType == item.name) return;
  if (selectedConversation.value.id) {
    selectedConversation.value.contextType = item.name;
    service.chat.updateChatContextType(selectedConversation.value.id, item.name).then((res) => {
      if (res.code === 0) {
        if (item.name === "连续对话") {
          message.success("修改成功，当前会话已切换为连续对话");
        } else {
          message.success("修改成功，当前会话已切换为单轮对话");
        }
      } else {
        message.error(res.msg);
      }
    });
    chatStore.updateConversation({ id: selectedConversation.value.id, conversation: selectedConversation });
  } else {
    if (item.name === "连续对话") {
      message.success("修改成功，当前会话已切换为连续对话");
    } else {
      message.success("修改成功，当前会话已切换为单轮对话");
    }
  }
};

const guideSelect = (val) => {
  question.value = val.name;
  //判断是否在移动端
  if (!inMobil) {
    document.getElementById("input-box")?.focus();
  }
};

const contextSwitch = () => {
  chatStore.updateOpenContext(!openContext.value);
  // if (openContext.value) {
  //   dialogStore.updateTreeContext(lastDialogId.value, true);
  //   dialogStore.updateTreeContext(dialogTree.value[lastDialogId.value].parent, true);
  // } else {
  let newDialogTree = JSON.parse(JSON.stringify(dialogTree.value));
  Object.keys(newDialogTree).forEach((key) => {
    newDialogTree[key].context = false;
  });
  dialogStore.initDialogTree(newDialogTree);
  // }
};

const ignored = new Set(["Logic", "API"]);

const getChainConfig = async (botId) => {
  return new Promise((resolve, reject) => {
    service.bot
      .botNoSetting(botId)
      .then((res) => {
        if (res.data.length > 0) {
          console.log(
            "ignored",
            res.data.every((item) => ignored.has(item))
          );
          if (res.data.every((item) => ignored.has(item))) {
            resolve(false);
          }
        }

        if (res.data.length > 0) {
          let botInfo = botStore.getBotByID(botId);
          botStore.selectBot(botInfo);
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// dialogStore.initDialogTree(dialogData);
const { lastDialogId, genStatus } = storeToRefs(dialogStore);
const askQuestion = async (event) => {
  if (!question.value || genStatus.value) {
    return;
  }
  // Enter 发送  , Shift + Enter 换行

  console.log("event", event);
  // if (event.isComposing) {
  if (event.type == "click") {
  } else if (event.shiftKey && event.key === "Enter") {
    console.log("shiftKey", question.value.trim());
    // event.preventDefault();
    // question.value += "\n";
    return;
  } else if (event.key === "Enter" && !event.isComposing && question.value.trim() !== "") {
    console.log("Enter");
    event.preventDefault();
    // question.value = `${question.value}\n`;
  } else {
    return;
  }
  // }

  let getChainConfigRes = await getChainConfig(props.probation ? props.tryChain.botId : defaultModel.value.id);
  if (getChainConfigRes && !props.probation) {
    //打开配置弹窗
    visibleBotConfig.value = true;
    return;
  }

  let pending = false;
  let messageAI = {};
  let questionAI = {};
  let answerId = "";
  let questionId = "";
  let answerChatId = "";

  const chatId = selectedConversation.value.id;
  // const parentId = dialogTree.value ? (dialogTree.value[lastDialogId].parent || ""):"";
  // dialogStore.genDialog(question.value, "user");
  const parentNode = dialogTree.value[lastDialogId.value];
  const parentId = parentNode.realId || parentNode.id || "";
  // console.log(chatId, parentId, "发送消息");
  questionAI = dialogStore.genDialog(question.value, "user");
  if (!pending) {
    pending = true;
    nextTick(() => {
      messageAI = dialogStore.genDialog("", "assistant", null, defaultModel.value.botName, defaultModel.value.icon);
    });
  }
  dialogScrollToBottom(true);

  nextTick(() => {
    throttledScrollToBottom();
  });
  let { chatId: paramChatId } = route.params;
  if (!paramChatId || paramChatId == "") {
    let conversation = {
      id: "temporary",
      chatName: t("chat.newChat"),
      itemShow: "normal",
    };
    conversation.contextType = defaultDialog.value.name;
    chatStore.addConversation(conversation);
    chatStore.selectConversation(conversation);
  }
  dialogStore.setGenStatus(true);
  let selectModelId = 0;
  if (paramChatId && paramChatId !== "") {
    selectModelId = selectedConversation.value.modelId;
  } else {
    selectModelId = defaultModel.value.id;
  }

  let contentParams = [];
  //判断是否开启上下文
  if (openContext.value) {
    Object.keys(dialogTree.value).forEach((item) => {
      if (dialogTree.value[item].context) {
        contentParams.push({
          role: dialogTree.value[item].message.author.role,
          content: dialogTree.value[item].message.content.parts[0],
        });
      }
    });
    // 关闭上下文
    contextSwitch();
  }
  console.log("contentParams", contentParams);
  console.log("selectModelId", selectModelId);
  console.log("props.tryChain", props.tryChain);
  const abortController = new AbortController();
  // return;
  fetchEventSource("/api/message", {
    method: "POST",
    body: JSON.stringify({
      chatId: chatId,
      parentId: parentId,
      content: question.value,
      botId: props.probation ? props.tryChain.botId : defaultModel.value.id,
      contextType: defaultDialog.value.name,
      contextParams: contentParams,
      isTemp: props.probation ? 1 : 0,
    }),
    signal: abortController.signal,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    onopen(response) {
      if (response.ok) {
        return; // everything's good
      } else if (response.status == 500) {
        // client-side errors are usually non-retriable:
        message.warning(
          `很抱歉给您带来不便，由于当前访问量过大，我们的系统无法满足所有用户的请求，建议您稍后重新提问。`
        );
        return;
      } else {
        message.warning(
          `很抱歉给您带来不便，由于当前访问量过大，我们的系统无法满足所有用户的请求，建议您稍后重新提问。`
        );
        return;
      }
    },
    onmessage(ev) {
      if (ev.data.includes("__47b6a0a0ebd4__")) {
        try {
          let str = ev.data.replace("__47b6a0a0ebd4__", "");
          const content = JSON.parse(str);
          if (content.answerId === null) {
            message.warning(`${messageAI.message.content.parts[0]}`);
            console.log("走这里了1=====");
            chatStore.selectConversation({});
            dialogStore.clearDialogTree();
            return;
          }
          answerId = content.answerId;
          questionId = content.questionId;
          answerChatId = content.chatId;
          let conversation = {
            id: answerChatId,
            chatName: "",
            itemShow: "normal",
            modelId: selectModelId,
          };
          conversation.contextType = defaultDialog.value.name;
          console.log("onmessageend");
          dialogStore.setGenStatus(false);
          //chatStore.selectConversation(conversation);
        } catch (err) {
          message.warning(`chat解析异常：${err}`);
          console.error(err);
        }
        abortController.abort();
      } else {
        console.log("=======pending=====", pending);
        if (pending) {
          const content = ev.data;
          dialogStore.genAnswer(messageAI, decodeBase64(ev.data));
        }
        nextTick(() => {
          throttledScrollToBottom();
        });
      }
    },
    onerror(err) {
      message.warning(`接口异常：${err}`);
      throw new Error(`Method not implemented.${err}`);
    },
  })
    .then((response) => {
      nextTick(() => {
        dialogStore.saveDialog(messageAI, answerId);
        dialogStore.saveDialog(questionAI, questionId);

        const { chatId: paramChatId } = route.params;
        if (!paramChatId || paramChatId == "") {
          let chatName = dialogTree.value[dialogTree.value.ROOT.children[0]].message.content.parts[0];
          console.log("chatName", chatName);
          const conversation = {
            id: answerChatId,
            chatName: chatName,
            itemShow: "normal",
            modelId: selectModelId,
          };
          let newConversations = conversations.value.map((item) => {
            if (item.id == "temporary") {
              item.id = conversation.id;
              item.chatName = conversation.chatName;
              item.modelId = selectModelId;
            }
            return item;
          });

          console.log("conversation", newConversations);
          chatStore.setConversations(newConversations);
          selectedConversation.value.id = answerChatId;
          conversation.contextType = defaultDialog.value.name;
          console.log("走这里了3=====");
          chatStore.selectConversation(conversation);
          if (!props.probation) {
            router.replace({
              name: "chat",
              params: {
                chatId: conversation.id,
              },
            });
          }
        }
      });
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log("finally", genStatus.value);
      dialogStore.setGenStatus(false);
      updateUserDailyUsage();
    });
  question.value = "";
};

const reQuestion = async (info) => {
  // Enter 发送  , Shift + Enter 换行

  // }
  let pending = false;
  let messageAI = {};
  let questionAI = {};
  let answerId = "";
  let questionId = "";
  let answerChatId = "";

  const chatId = selectedConversation.value.id;
  // const parentId = dialogTree.value ? (dialogTree.value[lastDialogId].parent || ""):"";
  // dialogStore.genDialog(question.value, "user");
  const parentNode = dialogTree.value[lastDialogId.value];
  const parentId = parentNode.realId || parentNode.id || "";
  console.log(chatId, parentId, info, "发送消息");
  questionAI = dialogStore.genDialog(info.content, "user", info.parentId);
  if (!pending) {
    pending = true;
    nextTick(() => {
      messageAI = dialogStore.genDialog(
        "",
        "assistant",
        questionAI.id,
        defaultModel.value.botName,
        defaultModel.value.icon
      );
    });
  }
  dialogScrollToBottom(true);

  nextTick(() => {
    throttledScrollToBottom();
  });
  dialogStore.setGenStatus(true);
  let { chatId: paramChatId } = route.params;

  let selectModelId = 0;
  if (paramChatId && paramChatId !== "") {
    selectModelId = selectedConversation.value.modelId;
  } else {
    selectModelId = defaultModel.value.id;
  }
  let contentParams = [];
  //判断是否开启上下文
  if (openContext.value) {
    Object.keys(dialogTree.value).forEach((item) => {
      if (dialogTree.value[item].context) {
        contentParams.push({
          role: dialogTree.value[item].message.author.role,
          content: dialogTree.value[item].message.content.parts[0],
        });
      }
    });
    // 关闭上下文
    contextSwitch();
  }
  console.log("contentParams", contentParams);
  console.log("selectModelId", selectModelId);
  const abortController = new AbortController();
  // return;
  fetchEventSource("/api/message", {
    method: "POST",
    body: JSON.stringify({
      chatId: chatId,
      parentId: info.parentId,
      content: info.content,
      botId: props.probation ? props.tryChain.botId : defaultModel.value.id,
      contextType: defaultDialog.value.name,
      contextParams: contentParams,
    }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    signal: abortController.signal,
    onopen(response) {
      if (response.ok) {
        return; // everything's good
      } else if (response.status == 500) {
        // client-side errors are usually non-retriable:
        message.warning(
          `很抱歉给您带来不便，由于当前访问量过大，我们的系统无法满足所有用户的请求，建议您稍后重新提问。`
        );
        return;
      } else {
        message.warning(
          `很抱歉给您带来不便，由于当前访问量过大，我们的系统无法满足所有用户的请求，建议您稍后重新提问。`
        );
        return;
      }
    },
    onmessage(ev) {
      if (ev.data.includes("__47b6a0a0ebd4__")) {
        try {
          let str = ev.data.replace("__47b6a0a0ebd4__", "");
          const content = JSON.parse(str);
          if (content.answerId === null) {
            message.warning(`${messageAI.message.content.parts[0]}`);
            console.log("走这里了4=====");
            chatStore.selectConversation({});
            dialogStore.clearDialogTree();
            return;
          }
          answerId = content.answerId;
          questionId = content.questionId;
          answerChatId = content.chatId;
          let conversation = {
            id: answerChatId,
            chainName: "",
            itemShow: "normal",
            modelId: selectModelId,
          };
          console.log("onmessageend");
          conversation.contextType = defaultDialog.value.name;
          console.log("走这里了5=====");
          chatStore.selectConversation(conversation);
          dialogStore.setGenStatus(false);
        } catch (err) {
          message.warning(`chat解析异常：${err}`);
          console.error(err);
        }
        abortController.abort();
      } else {
        if (pending) {
          const content = ev.data;
          dialogStore.genAnswer(messageAI, decodeBase64(ev.data));
        }
        nextTick(() => {
          throttledScrollToBottom();
        });
      }
    },
    onerror(err) {
      message.warning(`接口异常：${err}`);
      throw new Error(`Method not implemented.${err}`);
    },
  })
    .then((response) => {
      nextTick(() => {
        dialogStore.saveDialog(messageAI, answerId);
        dialogStore.saveDialog(questionAI, questionId);
      });
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log("finally", genStatus.value);
      dialogStore.setGenStatus(false);
      updateUserDailyUsage();
    });
  question.value = "";
};

const reAnswer = async () => {
  const chatId = selectedConversation.value.id;
  let pending = false;

  let answerId = "";
  let questionId = "";
  let messageAI = {};

  const parentNode = dialogTree.value[lastDialogId.value];
  const parentId = parentNode.parent || "";
  const parentRealId = dialogTree.value[parentId].realId || "";
  console.log(parentNode, "发送消息");

  dialogTree.value[parentId].children.forEach((item, index) => {
    dialogTree.value[item].active = 0;
  });

  messageAI = dialogStore.genDialog("", "assistant", parentId, defaultModel.value.botName, defaultModel.value.icon);
  let contentParams = [];
  //判断是否开启上下文
  if (openContext.value) {
    Object.keys(dialogTree.value).forEach((item) => {
      if (dialogTree.value[item].context) {
        contentParams.push({
          role: dialogTree.value[item].message.author.role,
          content: dialogTree.value[item].message.content.parts[0],
        });
      }
    });
    // 关闭上下文
    contextSwitch();
  }
  console.log("contentParams", contentParams);
  if (!pending) {
    pending = true;
  }
  dialogStore.setGenStatus(true);
  const abortController = new AbortController();
  fetchEventSource("/api/message/reAnswer", {
    method: "POST",
    body: JSON.stringify({
      chatId: chatId,
      parentId: parentRealId,
      botId: props.probation ? props.tryChain.botId : defaultModel.value.id,
      contextType: defaultDialog.value.name,
      contextParams: contentParams,
    }),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    signal: abortController.signal,

    onopen(response) {
      if (response.ok) {
        return; // everything's good
      } else if (response.status == 500) {
        // client-side errors are usually non-retriable:
        message.warning(
          `很抱歉给您带来不便，由于当前访问量过大，我们的系统无法满足所有用户的请求，建议您稍后重新提问。`
        );
        return;
      } else {
        message.warning(
          `很抱歉给您带来不便，由于当前访问量过大，我们的系统无法满足所有用户的请求，建议您稍后重新提问。`
        );
        return;
      }
    },
    onmessage(ev) {
      if (ev.data.includes("__47b6a0a0ebd4__")) {
        try {
          let str = ev.data.replace("__47b6a0a0ebd4__", "");
          const content = JSON.parse(str);
          if (content.answerId === null) {
            message.warning(`${messageAI.message.content.parts[0]},回答ID${t("notEmpty")}`);
            console.log("走这里了6=====");
            chatStore.selectConversation({});
            dialogStore.clearDialogTree();
            return;
          }
          answerId = content.answerId;
          dialogStore.setGenStatus(false);
          // answerChatId = content.chatId;
          // let conversation = {
          //   id: answerChatId,
          //   name: "",
          //   itemShow: "normal",
          //   modelId: selectModelId,
          // };
          // console.log("onmessageend");
          // chatStore.selectConversation(conversation);
        } catch (err) {
          message.warning(`chat解析异常：${err}`);
          console.error(err);
        }
        abortController.abort();
      } else {
        if (pending) {
          const content = ev.data;
          // console.log("onmessage", content);
          dialogStore.genAnswer(messageAI, decodeBase64(ev.data));
        }
        nextTick(() => {
          throttledScrollToBottom();
        });
      }
    },
    onerror(err) {
      message.warning(`接口异常：${err}`);
      throw new Error(`Method not implemented.${err}`);
    },
  })
    .then((response) => {
      nextTick(() => {
        dialogStore.saveDialog(messageAI, answerId);
        // dialogStore.saveDialog(questionAI, questionId);
      });
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log("finally", genStatus.value);
      dialogStore.setGenStatus(false);
      updateUserDailyUsage();
    });
};

const stopAnswer = async () => {
  const res = await service.messages.stopAnswer(selectedConversation.value.id);
  if (res.code == 0) {
    // message.success("停止成功");
  } else {
    // message.error("停止失败");
  }
};

const decodeBase64 = (encodedString) => {
  const decodedString = decodeURIComponent(
    atob(encodedString)
      .split("")
      .map(function (char) {
        return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return decodedString;
};

const throttledScrollToBottom = throttle(() => dialogScrollToBottom(true), 300);

const upgrade = () => {
  showPayList.value = true;
};
const exceedMessage = () => {
  return false;
  if (!isPersonal.value) {
    return false;
  }
  message.warning({
    content: h("span", null, [
      h("span", null, t("chat.currentUsageExceeded")),
      h("i", { style: "color: teal;cursor: pointer;text-decoration: underline;", onclick: upgrade }, t("upgrade")),
    ]),
  });
};

const updateUserDailyUsage = async () => {
  // const res = await service.messages.getUserDailyUsage();
  const res = await service.messages.getTokenUsageLimit();
  chatStore.updateUserDailyUsageList(res.data);
  if (!res.data[0]) {
    return;
  }
  let info = res.data[0];
  if (info.dailyTokens < info.usageToken) {
    exceedMessage();
  }
};

const init = () => {
  updateUserDailyUsage();
};

onMounted(() => {
  updateUserDailyUsage();
  handleMessage(selectedConversation.value.id);
  dialogScrollToBottom();
});
onBeforeUnmount(() => {
  chatStore.selectConversation({});
  dialogStore.clearDialogTree();
});

const { dialogTree } = storeToRefs(dialogStore);

const hasDialog = computed(() => {
  const root = dialogTree.value["ROOT"];
  return root && root.children.length;
});
const guideShow = computed(() => {
  const root = dialogTree.value["ROOT"];
  const { chatId } = route.params;
  console.log("guideShow", root, !chatId, root && root.children.length == 0 && !chatId);
  return root && root.children.length == 0 && !chatId;
});

const handleMessage = async (messageId) => {
  console.log("handleMessage");
  if (messageId) {
    try {
      const res = await messageService.getMessage(messageId);
      const dialogTree = genDialogTree(res.data);
      console.log(dialogTree, "dialogTree");
      dialogStore.initDialogTree(dialogTree);
      //设置botId
      if (res.data.length > 0) {
        let botId = res.data[res.data.length - 1].botId;
        console.log("defaultModel", defaultModel.value);
        console.log("modelList", modelList.value);
        let model = modelList.value.find((item) => item.id == botId);
        if (model) {
          defaultModel.value = model;
          localStorage.setItem("defaultModel", defaultModel.value.id);
        }
        //更新defaultModel
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    let modeId = localStorage.getItem("defaultModel");

    defaultModel.value = modelList.value.find((item) => item.id == modeId);
    modelStore.setDefaultModel(modelList.value.find((item) => item.id == modeId));
    const dialogTree = genDialogTree();
    console.log(dialogTree, "dialogTree1");
    dialogStore.initDialogTree(dialogTree);
  }
  return;
};

// 监听会话ID切换消息
watch(
  () => selectedConversation.value.id,
  async (val, oldval) => {
    if (!selectedConversation.value.contextType) {
      chatStore.updateUserDailyUsageList(userDailyUsageList.value);
    } else {
      let dialog =
        dialogOptions.value.find((item) => item.name == selectedConversation.value.contextType) ||
        dialogOptions.value[0];
      chatStore.updateDefaultDialog(dialog);
    }
    await nextTick();
    //判断是否在移动端
    if (!inMobil) {
      document.getElementById("input-box")?.focus();
    }
    question.value = "";
    if (val != "temporary") {
      // 停止上一个会话
      console.log("停止上一个会话", oldval);
      if (oldval) {
        await service.messages.stopAnswer(oldval);
      }
      await handleMessage(val);
    }
    //停止会话
    // const res = await service.messages.stopAnswer(selectedConversation.value.id);
    if (hasDialog.value) {
      dialogScrollToBottom();
    }
  }
);

const genDialogTree = (message) => {
  // 生成头节点
  const dialogTree = {
    ROOT: {
      id: "ROOT",
      children: [],
    },
  };
  if (message) {
    // 建立ID索引,创建数据结构
    message.forEach((item) => {
      dialogTree[item.id] = {
        id: item.id,
        botName: item.botName,
        icon: item.icon,
        message: {
          id: item.id,
          author: {
            role: item.type == "USER" ? "user" : "assistant",
          },
          createTime: item.createTime,
          content: {
            contentType: item.contentType,
            parts: [item.content],
          },
        },
        parent: item.parentId ? item.parentId : "ROOT",
        children: [],
      };
    });
    // 生成Child
    Object.keys(dialogTree).forEach((key) => {
      const value = dialogTree[key];
      if (value.parent) {
        // console.log("dialogTree",dialogTree[value.parent]);
        // console.log("value.parent",value.parent);
        dialogTree[value.parent].children.push(value.id);
      }
    });
  }
  console.log(dialogTree, "genDialogTree");
  return dialogTree;
};

const dialogScrollToBottom = (animation = false) => {
  nextTick(() => {
    let element = document.getElementById("dialogList");
    let scrollTop = element.scrollHeight - element.clientHeight;
    if (animation) {
      element.scrollTo({ top: scrollTop, behavior: "smooth" });
    } else {
      element.scrollTop = scrollTop;
    }
  });
};

defineExpose({
  question,
});
</script>
<style lang="scss">
.botSetting {
  height: calc(100vh - 200px);

  .ant-modal-footer {
    display: none;
  }

  .ant-modal-content {
    height: 100%;
  }

  .ant-modal-body {
    height: calc(100% - 100px);
    max-height: 100%;
    overflow: auto;
  }

  .setting {
    display: flex;
    height: 100% !important;

    .menu {
      position: unset !important;
      height: 100% !important;
    }

    .body {
      position: unset !important;
      margin-left: 0px !important;
      height: 100% !important;

      .content {
        min-height: 100% !important;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.dialog-container {
  width: 100%;
  height: 100%;

  .dialog-list {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    padding-bottom: 220px;

    .guide {
      margin-top: -75px;
    }
  }

  .fixed-bottom {
    width: 100%;
    height: 150px;
    position: absolute;
    bottom: 0;
    z-index: 21;

    .dialog-foot {
      width: 100%;
      height: 150px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      background-color: transparent;

      .dialog-foot-btn.probation {
        top: -54px !important;
      }

      .dialog-foot-btn {
        height: 40px;
        margin-bottom: 10px;
        position: absolute;
        // top: -20px;
        top: -54px;
        width: fit-content;

        .reload-icon {
          width: 15px;
          height: 15px;
          margin-right: 10px;

          .icon {
            height: 10px;
            width: 10px;
            border-radius: 2px;
            border: 1px solid rgba(64, 65, 78, 1);
          }
        }

        &:hover,
        &:focus {
          color: #40414f;
          border-color: #dddfe7;
          background-color: #ececf1;
        }

        &:focus {
          color: #40414f;
          border-color: #dddfe7;
          background-color: #ececf1;
        }
      }

      .dialog-question {
        position: absolute;
        bottom: 67px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        width: 90%;
        height: fit-content;
        pointer-events: auto;

        .context-switch {
          height: 50px;
          display: flex;
          align-items: center;
          margin-right: 20px;
          cursor: pointer;

          .dialog {
            width: 26px;
            height: 26px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #dddfe7;
            border-radius: 45px;
            font-weight: 500;

            &:hover {
              background-color: #eff0f0;
            }
          }
        }

        .dialog-foot-input {
          min-height: 50px;
          width: 100%;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: start;
          background-color: #fff;

          .question {
            .title {
              display: flex;

              & > div {
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                word-wrap: break-word;
                height: 20px;
              }

              .name {
                font-size: 14px;
                font-weight: 500;
                margin-right: 8px;
              }

              .desc {
                font-size: 12px;
                color: #999;
                height: 20px;
              }

              .head-icon {
                width: 24px;
                height: 24px;
                margin-right: 10px;
                margin-bottom: 10px;
              }
            }

            :deep(.ant-select) {
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            }
          }
        }

        .send-icon-flex {
          height: 46px;
          width: fit-content;
          display: flex;
          align-items: flex-end;
          margin-left: 20px;
          padding-bottom: 2px;

          .send-icon-container {
            display: flex;
            height: 46px;
            width: fit-content;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            background-color: #fff;

            :deep(.ant-btn) {
              border-radius: 4px;
              height: 46px;
              border: none;
              box-shadow: none;
              padding: 0 20px;
              font-size: 16px;
            }

            .send-icon {
              width: 20px;
              height: 20px;
              color: #d2d2da;
            }

            .loading-icon {
              width: 20px;
              height: 20px;
              color: #8e8fa0;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }

          .send-icon-active {
            cursor: pointer;

            .send-icon {
              color: #8e8fa0 !important;
            }

            &:hover {
              background-color: #ececf1;
            }
          }
        }

        .prompt {
          margin-top: 5px;
          position: absolute;
          left: 50px;
          bottom: -27px;
          color: #9a9b9d;
          font-size: 12px;
        }
      }
    }
  }
}

// :deep(.el-input__wrapper.is-focus) {
//   box-shadow: none;
// }
:deep(.el-textarea__inner) {
  box-shadow: none;
  padding: 5px 20px;
}

:deep(.menu-item.select) {
  font-weight: 600 !important;
  color: #000000 !important;
}
</style>
<style lang="scss">
@media screen and (max-width: 767px) {
  .chat-container {
    width: 100% !important;

    & > .title {
      display: flex !important;
    }

    .dialog-item {
      padding: 16px;
      padding-right: 21px;

      .dialog {
        width: 100%;

        .body {
          width: calc(100% - 55px);

          .text {
            width: 100%;
          }

          .operate {
            width: 100%;
            justify-content: end;
            position: revert;
          }
        }
      }
    }

    .send-icon-container {
      width: 30px;
      height: 30px;
    }

    .select {
      position: fixed;
      top: 40px;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px 0;
      width: 100%;
      background: #fff;
      z-index: 21;
    }

    .select-model {
      position: relative !important;
      top: 0px !important;
      left: 0px !important;
    }

    .chat-title {
      margin-bottom: 40px !important;
      margin-top: 200px !important;
    }

    .content {
      width: 100%;

      & > div {
        width: 100%;
        margin-left: 0px !important;

        .guide-item {
          width: 100%;
          max-width: 100%;
        }
      }
    }

    .dialog-foot,
    .fixed-bottom {
      height: 120px !important;
    }

    .dialog-question {
      width: calc(100% - 16px) !important;

      bottom: 43px !important;
    }

    .prompt {
      display: none;
    }
  }
}
</style>
