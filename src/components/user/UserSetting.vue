<template>
  <div class="pop-up" v-if="popShow" ref="userMenuPopover">
    <nav class="nav-index">
      <template v-if="conversations.length > 0 && route.name === 'chat'">
        <a
          v-if="false"
          href="https://blog.friai.com/"
          target="_blank"
          class="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white hover:bg-gray-700 text-sm"
        >
          <img :src="help" />帮助 &amp; FAQ</a
        >
        <div class="h-px"></div>
        <a
          v-if="clearChatShow === false"
          @click="clearChat"
          @click.stop
          ref="userMenuPopover"
          class="flex py-3 px-3 items-center gap-3 transition-colors hover:bg-gray-700 duration-200 text-white text-sm"
          ><img :src="clear" />清除对话</a
        >
      </template>
      <a
        v-if="clearChatShow === true"
        @click="clearUserChat"
        class="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white hover:bg-gray-700 text-sm"
        ><img :src="confirm" />确认清除
      </a>
      <a
        v-if="false"
        @click="jumpPrice"
        class="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white text-sm hover:bg-gray-700"
        ><img :src="user" />我的订阅</a
      >
      <a
        v-if="false"
        @click="dialogTableVisible = true"
        class="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white text-sm hover:bg-gray-700"
        ><img :src="setting" />设置</a
      >
      <div class="h-px"></div>
      <a
        @click="logOut"
        class="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white text-sm hover:bg-gray-700"
      >
        <img :src="logout" />
        {{ $t("login.logout") }}
      </a>
    </nav>
  </div>
  <!-- 以下是主题设置弹窗 -->
  <el-dialog :class="'theme-' + themeStoreX.theme" v-model="dialogTableVisible" title="设置">
    <div>
      <div>选择主题</div>
      <el-select v-model="themeStoreX.theme" @change="changeTheme" class="m-2" placeholder="Select" size="large">
        <el-option v-for="item in themeOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </el-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, watch, h, onMounted, onBeforeUnmount, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { themeStore } from "@/store/modules/theme.js";
import services from "@/services/index";
import { ElNotification } from "element-plus";
import { ymPoint } from "@/utils/point.js";
import user from "@/assets/user.svg";
import confirm from "@/assets/confirm.svg";
import setting from "@/assets/setting.svg";
import logout from "@/assets/logout.svg";
import help from "@/assets/help.svg";
import clear from "@/assets/clear.svg";
import { useChatStore } from "@/store/modules/chat";
import { useDialogStore } from "@/store/modules/dialog";
import { useLoginStore } from "@/store/modules/user.js";
import { useModelStore } from "@/store/modules/model.js";
import warterMark from "@/utils/warterMark.js";

const t = inject("$i18nT");
const route = useRoute();

const modelStore = useModelStore();

const loginStore = useLoginStore();
const chatStore = useChatStore();
const dialogStore = useDialogStore();
const router = useRouter();
const dialogTableVisible = ref(false); //设置弹窗
const themeValue = ref(""); //主题
let clearChatShow = ref(false); //确认删除对话框
let userName = ref("--"); //用户信息
let popShow = ref(false); //弹窗开启状态
let bottomButton = ref("transparent"); //底部按钮颜色
const themeStoreX = themeStore(); //全局主题变量
const userMenuPopover = ref(null); //弹窗生命周期
const { conversations, selectedConversation, userDailyUsageList } = storeToRefs(chatStore);
const { defaultModel } = storeToRefs(modelStore);

const props = defineProps({
  pop_show: {
    type: Boolean,
    default: () => false,
  },
});
watch(
  () => props.pop_show,
  (val) => {
    popShow.value = val;
    showPop();
  }
);
//主题数组
const themeOptions = [
  {
    value: "light",
    label: "默认白",
  },
  {
    value: "dark",
    label: "酷炫黑",
  },
  // {
  //   value: "lightblue",
  //   label: "天际蓝",
  // },
  // {
  //   value: "star",
  //   label: "星空",
  // },
];
const changeTheme = (val) => {
  themeStoreX.changeTheme(val);
  let user = loginStore.userInfo?.encryptionPhone;
  warterMark.set(user, t("markText"));
};
//埋点
const point = (code, msg) => {
  try {
    ymPoint(code, msg);
  } catch (error) {
    console.log(error);
  }
};
//弹窗提示
const openMessage = (title, value) => {
  ElNotification({
    title: title,
    message: h("i", { style: "color: #343541" }, value),
  });
};
const getUserTokens = async () => {
  const res = await services.messages.getTokenUsageLimit();
  chatStore.updateUserDailyUsageList(res.data);
};
//获取用户信息
const getUserInfo = async () => {
  try {
    const res = await services.user.getUserInfo();
    if (res.code === 0) {
      // 手机号码脱敏
      var pho = /(\d{3})\d*(\d{4})/;
      var str = res.data.phone.replace(pho, "$1****$2");
      userName.value = str;
      // res.data.phone == "" ? loginInvalid() : "";
      //openMessage("登录成功", "当前登录用户"+userName.value+",欢迎使用Chatbot")
    } else {
      openMessage(t("fail"), res.message);
    }
  } catch (error) {
    openMessage(t("fail"), error.message);
    loginInvalid();
  }
};
getUserInfo();
//登录失效
const loginInvalid = () => {
  jumpLogin();
  openMessage(t("fail", { mag: t("login.login") }), t('loginInvalid'));
};
//底部弹窗开启关闭
const showPop = () => {
  popShow.value = !popShow.value;
  clearChatShow.value = false; //关闭确认清除对话框
  popShow.value == false //动态改变底部按钮颜色
    ? (bottomButton.value = "transparent")
    : (bottomButton.value = "rgb(52,53,65)");
  point("pop_click_button_bottom", "点击底部弹窗");
};
//打开主题设置弹窗
const clearChat = () => {
  clearChatShow.value = true;
  point("pop_click_button_clear", "点击清除对话");
};
//退出登录
const logOut = async () => {
  const SUCCESS_MESSAGE = t("success", { msg: t("exit") });
  const ERROR_MESSAGE = t('apiError');
  const FAILURE_MESSAGE = t('fail');
  const LOGIN_FAILURE_MESSAGE = t('apiError');;
  const LOGIN_SUCCESS_ACTION = "您已退出登录";

  try {
    const res = await services.user.logOut();
    const { code } = res;

    if (code === 0) {
      openMessage(SUCCESS_MESSAGE, LOGIN_SUCCESS_ACTION);
      loginStore.setUserId("");
      jumpLogin();
    } else {
      openMessage(ERROR_MESSAGE, `${LOGIN_FAILURE_MESSAGE}: ${res.message}`);
    }
  } catch (error) {
    console.log(error, "error");
    openMessage(FAILURE_MESSAGE, LOGIN_FAILURE_MESSAGE);
  }
};

//清除用户聊天记录
const clearUserChat = async () => {
  try {
    const res = await services.chat.clear();
    if (res.code === 0) {
      openMessage("清除成功", "您已清除所有对话");
      clearChatShow.value = false;
      chatStore.clearConversations(); //清除聊天记录
      dialogStore.clearDialogTree(); //清除对话树
      router.replace({
        name: "chat",
        params: {
          chatId: "",
        },
      });
      point("pop_click_button_confirm_clear", "确认清除对话");
      showPop();
    } else {
      openMessage("清除失败", "清除接口请求失败", +res.message);
    }
  } catch (error) {
    openMessage("清除失败", "清除接口请求失败");
  }
};
//跳转付费中心
const jumpPrice = () => {
  point("pop_click_button", "点击我的订阅");
  router.push({
    name: "price",
  });
};
//跳转登录
const jumpLogin = () => {
  dialogStore.clearDialogTree();
  chatStore.clearChat();
  router.push({
    name: "login",
  });
};
//点击外部关闭事件
const handleClickOutside = (event) => {
  if (!userMenuPopover.value.contains(event.target)) {
    popShow.value = false;
    popShow.value == false //动态改变底部按钮颜色
      ? (bottomButton.value = "transparent")
      : (bottomButton.value = "rgb(52,53,65)");
  }
};
//生命周期
onMounted(() => {
  // document.addEventListener("click", handleClickOutside);
  getUserTokens();
});
//生命周期
onBeforeUnmount(() => {
  // document.removeEventListener("click", handleClickOutside);
});
</script>
<style lang="scss" scoped>
.nav-index {
  z-index: 11;
}

.h-px {
  height: 1px;
  background-color: hsla(0, 0%, 100%, 0.2);
}

.bg-white\/20 {
  background-color: hsla(0, 0%, 100%, 0.2);
}

.my-1\.5 {
  margin-bottom: 0.375rem;
  margin-top: 0.375rem;
}

.text-white {
  color: rgb(255, 255, 255);
  user-select: none;
}

.flex {
  display: flex;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.py-3 {
  padding-bottom: 0.75rem;
  padding-top: 0.75rem;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.gap-3 {
  gap: 0.75rem;
}

.duration-200 {
  transition-duration: 0.2s;
}

.transition-colors {
  transition-duration: 0.15s;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.pop-up {
  border-radius: 6px;
  z-index: 20;
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  background-color: #050509;
  margin-bottom: 0.5rem;
  animation: intercom-lightweight-app-launcher 0.5s;
  position: fixed;
  left: 74px;
  bottom: 0;
  width: 246px;
}

.items-center {
  align-items: center;
}

.hover\:bg-gray-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(64, 65, 79, var(--tw-bg-opacity));
}

.duration-200 {
  transition-duration: 0.2s;
}

.hover\:bg-gray-800:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(52, 53, 65, var(--tw-bg-opacity));
}

.gap-2\.5 {
  gap: 0.625rem;
}

.grow {
  flex-grow: 1;
}

.text-left {
  text-align: left;
}

.text-gray-500 {
  color: rgb(142, 142, 160);
}

@keyframes intercom-lightweight-app-launcher {
  0% {
    opacity: 0;
  }

  40% {
    opacity: 0.75;
  }

  100% {
    opacity: 1;
  }
}
</style>
