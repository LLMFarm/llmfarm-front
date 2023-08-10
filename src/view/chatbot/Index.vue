<template>
  <div class="container">
    <div class="side-container" :style="{ width: `calc(70px + ${showMenu ? '256px' : '0px'})` }">
      <div class="mask" @click="closeMenu"></div>
      <div class="close-menu" @click="closeMenu">
        <CloseOutlined class="icon" />
      </div>
      <Chain @select="closeMenu" />
    </div>

    <div
      class="chat-container"
      :class="'theme-' + themeStoreX.theme"
      :style="{ width: `calc(100vw - 70px - ${showMenu ? '256px' : '0px'})` }"
    >
      <div class="title" v-if="routerName == 'chat'">
        <div class="icon-body">
          <MenuUnfoldOutlined class="icon" @click="openMenu" />
        </div>
        <div class="chat-name">{{ titleName }}</div>
        <div class="icon-body">
          <PlusOutlined class="icon" @click="newChat" v-if="routerName == 'chat'" />
        </div>
      </div>
      <template v-if="routerName == 'chat'">
        <DialogList />
      </template>
      <template v-else-if="routerName == 'chainDetail'">
        <ChainMarketDetails></ChainMarketDetails>
      </template>
      <template v-else-if="routerName == 'bot'">
        <BotDetails> </BotDetails>
      </template>
      <template v-else-if="routerName == 'chain'">
        <ChainDetails> </ChainDetails>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, inject } from "vue";
import Chain from "./Chain.vue";
import { useChatStore } from "@/store/modules/chat.js";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import DialogList from "./dialog/DialogList.vue";
import { themeStore } from "/src/store/modules/theme.js";
import { CloseOutlined, MenuUnfoldOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { useDialogStore } from "@/store/modules/dialog";
import { ymPoint } from "@/utils/point.js";
import { useRoute, useRouter } from "vue-router";
import warterMark from "@/utils/warterMark.js";
import { useLoginStore } from "@/store/modules/user.js";
import { useModelStore } from "@/store/modules/model.js";
import { storeToRefs } from "pinia";
import BotDetails from "./bot/BotDetails.vue";
import ChainDetails from "./chain/ChainDetails.vue";
import ChainMarketDetails from "@/components/chain/ChainMarketDetails.vue";

const t = inject("$i18nT");

const themeStoreX = themeStore();
const chatStore = useChatStore();
const dialogStore = useDialogStore();
const router = useRouter();
const route = useRoute();
const loginStore = useLoginStore();
const modelStore = useModelStore();
const {} = storeToRefs(chatStore);
console.log(themeStoreX.theme, "当前主题");
const question = ref(null);

const titleName = computed(() => {
  if (routerName.value === "home") {
    return "首页";
  }
  if (routerName.value === "upgradation") {
    return "会员中心";
  }
  return currentConversation.value.name || "新会话";
});

const routerName = computed(() => {
  return route.name;
});
// 获取当前选中的会话
const currentConversation = computed(() => {
  console.log(chatStore.selectedConversation);
  return chatStore.selectedConversation;
});

const closeMenu = () => {
  let menu = document.querySelector(".side-container");
  let mask = menu.querySelector(".mask");
  let close = document.querySelector(".close-menu");
  close.style.left = "-100%";

  menu.style.left = "-100%";
  mask.className = "mask unshow";
};

const openMenu = () => {
  let menu = document.querySelector(".side-container");
  let mask = menu.querySelector(".mask");
  let close = document.querySelector(".close-menu");
  menu.style.left = "0";
  close.style.left = "335px";
  mask.className = "mask";
  mask.style.display = "flex";
};

const newChat = () => {
  // const conversation = { 'id': new Date().getTime(), 'itemShow': 'normal' }
  // chatStore.addConversation(conversation)
  dialogStore.setLastDialogId("ROOT");
  try {
    ymPoint("chat_click_list_add", "会话列表点击新增");
  } catch (error) {
    console.log("埋点", error);
  }
  chatStore.selectConversation({});
  router.replace({
    name: "chat",
    params: {
      chatId: "",
    },
  });
};

const showMenu = computed(() => {
  const list = ["chat", "bot", "chain"];
  return list.includes(routerName.value);
});

const ask = () => {
  let pending = false;
  let messageAI = {};
  chatStore.appendMessage("user", question.value);
  fetchEventSource("/api/chatgpt/ask", {
    method: "POST",
    body: JSON.stringify({
      question: question.value,
      uuid: currentConversation.value.uuid,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    onmessage(ev) {
      const content = ev.data;
      if (!pending) {
        pending = true;
        messageAI = chatStore.appendMessage("AI", content);
      } else {
        chatStore.updateMessage(messageAI, content);
      }
    },
  })
    .then((response) => {
      console.log("response", response);
      chatStore.saveConversation();
    })
    .catch((error) => {
      console.log(error);
    });
};
onMounted(() => {
  let user = loginStore.userInfo?.encryptionPhone;
  warterMark.set(user, t("markText"));
});

onBeforeUnmount(() => {
  warterMark.remove();
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

.side-container {
  width: 326px;
  background-color: rgba(32, 33, 35, 1);
  color: #fff;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 10px;
  height: 100vh;
  overflow-y: hidden;
  flex-shrink: 0;
  z-index: 23;
  .mask {
    display: none;
  }
  .close-menu {
    position: fixed;
    top: 0px;
    left: -100%;
    z-index: 1111;
    padding: 10px;
    margin-top: 10px;
    transition: 0.5s;
    .icon {
      font-size: 16px;
    }
  }
  .unshow {
    display: none !important;
  }
}

.chat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: calc(100vw - 326px);
  /* background: #f5f5f5; */
  .title {
    width: 100%;
    height: 43px;
    flex-shrink: 0;
    background-color: rgba(52, 53, 65, 1);
    color: rgba(217, 217, 227, 1);
    display: none;
    justify-content: space-between;
    align-items: center;
    padding: 0px 12px;
    font-size: 16px;
    z-index: 22;
    .chat-name {
      max-width: 70%;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      word-wrap: break-word;
    }
    .icon-body {
      .icon {
        font-size: 18px;
      }
    }
  }

  .top {
    padding-top: 20px;
    width: 750px;
  }

  .chat-content {
    height: 100px;
    width: 100%;
    display: flex;
    position: absolute;
    bottom: 0;
    padding: 30px;
    background-color: #fff;
    justify-content: center;

    .chat-box {
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0.1) 0px 0px 10px 0px;
    }
  }
}

.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>
<style lang="scss">
@media screen and (max-width: 767px) {
  .side-container {
    position: fixed;
    z-index: 111;
    left: -100%;
    transition: 0.5s;
    .mask {
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      position: fixed;
      z-index: 111;
      background-color: rgba(86, 88, 105, 0.75);
    }
    .navbar {
      z-index: 112;
    }
    .close-menu {
      left: -100%;
    }
  }
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
