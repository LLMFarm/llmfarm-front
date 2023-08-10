<template>
  <div>
    <a-dropdown placement="top">
      <template #overlay>
      </template>
      <div class="dosage">
        <div class="explanation">
          <span> {{ `${userDailyUsage.title || "总用量"}` }} </span>
          <span>{{ `${userDailyUsage.usageToken || 0}/${userDailyUsage.dailyTokens || 0}` }}</span>
        </div>
        <div class="progress">
          <a-progress :percent="(userDailyUsage.usageToken / userDailyUsage.dailyTokens) * 100" :show-info="false" />
        </div>
      </div>
    </a-dropdown>
    <div class="left-bottom-div" ref="userMenuPopover" v-if="false">
      <div class="relative-div">
        <div
          @click="showPop"
          class="bottom-button flex w-full items-center py-3 px-3 text-sm transition-colors duration-20 hover:bg-gray-700"
        >
          <div>
            <div class="flex">
              <span>
                <span class="avatar">
                  <img class="avatar-img" :src="avatar" />
                </span>
              </span>
            </div>
          </div>
          <div class="grow text-left text-white">{{ userName }}</div>
          <img src="/src/assets/more.svg" class="h-4 w-4 flex-shrink-0 text-gray-500" />
        </div>
        <div class="pop-up" v-if="popShow === true" ref="userMenuPopover">
          <nav class="nav-index">
            <template v-if="conversations.length > 0">
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
              退出登录
            </a>
          </nav>
        </div>
      </div>
    </div>
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
import { ref, inject, watch, computed, h, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { themeStore } from "/src/store/modules/theme.js";
import services from "@/services/index";
import { ElNotification } from "element-plus";
import { ymPoint } from "@/utils/point.js";
import avatar from "@/assets/avatar.svg";
import user from "@/assets/user.svg";
import confirm from "@/assets/confirm.svg";
import setting from "@/assets/setting.svg";
import logout from "@/assets/logout.svg";
import help from "@/assets/help.svg";
import clear from "@/assets/clear.svg";
import { useChatStore } from "@/store/modules/chat";
import { useDialogStore } from "@/store/modules/dialog";
import warterMark from "@/utils/warterMark.js";
import { useLoginStore } from "@/store/modules/user.js";
import { useModelStore } from "@/store/modules/model.js";
const route = useRoute();

const modelStore = useModelStore();

const t = inject("$i18nT");

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

// const props = defineProps({
//   pop_show: {
//     type: Boolean,
//     default: () => false,
//   },
// });
// watch(
//   () => props.pop_show,
//   (val) => {
//     popShow.value = val;
//     showPop();
//   }
// );
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
// const ymPoint = ymPoint(); //埋点
//埋点
const point = (code, msg) => {
  try {
    ymPoint(code, msg);
  } catch (error) {
    console.log(error);
  }
};
// const userDailyUsage = computed(() => {
//   let list = userDailyUsageList.value || [];
//   let selectModelId = 0;
//   let { chatId } = route.params;

//   if (chatId && chatId !== "") {
//     selectModelId = selectedConversation.value.modelId;
//   } else {
//     selectModelId = defaultModel.value.id;
//   }
//   console.log("selectModelId", defaultModel.value, userDailyUsageList.value, selectModelId);
//   return list.find((item) => item.modelId == selectModelId) || {};
// });
const userDailyUsage = computed(() => {
  if (userDailyUsageList.value[0]) {
    return userDailyUsageList.value[0];
  } else {
    return {};
  }
});
//弹窗提示
const openMessage = (title, value) => {
  ElNotification({
    title: title,
    message: h("i", { style: "color: #343541" }, value),
  });
};
const updateUserDailyUsage = async () => {
  const res = await services.messages.getUserDailyUsage();
  chatStore.updateUserDailyUsage(res.data);
};
const getUserTokens = async () => {
  const res = await services.messages.getTokenUsageLimit();
  chatStore.updateUserDailyUsageList(res.data);
  // userDailyUsage.value = res.data[0] || {};
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
//修改全局主题设置
const changeTheme = (val) => {
  themeStoreX.changeTheme(val);
  let user = loginStore.userInfo?.encryptionPhone;
  warterMark.set(user, t("markText"));
};
//登录失效
const loginInvalid = () => {
  jumpLogin();
  openMessage(t("fail", { msg: t("login.login") }), t('loginInvalid'));
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
//最外块
.dosage {
  height: 60px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  padding: 0.5rem 0.75rem 0;
  border-top-style: solid;
  border-width: 1px;
  border-color: hsla(0, 0%, 100%, 0.2);
  .explanation {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }
}
.left-bottom-div {
  background-color: rgb(32, 33, 35);
  width: 100%;
  padding-top: 0.5rem;
  border-color: hsla(0, 0%, 100%, 0.2);
  border-top-style: solid;
  border-width: 1px;
  border-color: hsla(0, 0%, 100%, 0.2);
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
}

.el-dialog__header {
  border-radius: 6px 6px 0px 0px;
}

.nav-index {
  z-index: 11;
}

.avatar {
  box-sizing: border-box;
  display: block;
  width: initial;
  height: initial;
  background: #fff;
  opacity: 1;
  border: 0px;
  margin: 0px;
  padding: 0px;
  max-width: 100%;
  margin-right: 8px;
}

.avatar-img {
  height: 24px;
  width: 24px;
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

.relative-div {
  position: relative;
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
  position: absolute;
  border-radius: 6px;
  z-index: 20;
  bottom: 100%;
  left: 0;
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  background-color: #050509;
  margin-bottom: 0.5rem;
  width: 100%;
  animation: intercom-lightweight-app-launcher 0.5s;
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

.w-full {
  width: 100%;
}

.hover\:bg-gray-800:hover {
  --tw-bg-opacity: 1;
  background-color: rgba(52, 53, 65, var(--tw-bg-opacity));
}

.bottom-button {
  background: v-bind("bottomButton");
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
<style lang="scss">
.dosage-dropdown.ant-dropdown-menu {
  background-color: black;
  padding: 0;
  border-width: 1px;
  border-style: solid;
  border-color: hsla(0, 0%, 100%, 0.2);

  .ant-dropdown-menu {
  }
  .ant-dropdown-menu-item {
    border-top-style: solid;
    border-width: 1px;
    border-color: hsla(0, 0%, 100%, 0.2);
    &:hover {
      background-color: rgba(64, 65, 79, 1);
    }
  }
  .ant-dropdown-menu-title-content > .dosage {
    border: none;
  }
}
</style>
