<template>
  <div class="chain-menu">
    <div class="menus">
      <div class="list">
        <div
          :class="['item', item.key === selectMenu ? 'select-item' : '']"
          v-for="item in menuList"
          @click="changeMenu(item.key)"
        >
          <img class="item-icon" :src="item.key === selectMenu ? item.selectIcon : item.icon" />
          <div>{{ item.name }}</div>
        </div>
      </div>
      <div class="setting">
        <UserSetting :pop_show="popShow"></UserSetting>

        <a-tooltip placement="right">
          <template #title>
            <span>{{ $t("helpDoc") }}</span>
          </template>
          <question-circle-outlined style="font-size: 18px; margin-bottom: 20px" @click="toHelp" />
        </a-tooltip>
        <template v-if="userInfo.is_admin === 1">
          <a-tooltip placement="right">
            <template #title>
              <span>{{ $t("admin") }}</span>
            </template>
            <img
              :src="manage"
              style="height: 18px; width: 18px; font-size: 18px; margin-bottom: 20px"
              @click="toBackManagement"
            />
          </a-tooltip>
        </template>
        <!-- <SettingOutlined style="font-size: 18px; margin-bottom: 20px" @click="popShow = !popShow" /> -->
        <!-- <div class="user-setting">
          <a-tooltip placement="right">
            <template #title>
              <span>{{ userName }}</span>
            </template>
            <img class="avatar-img" :src="avatar" />
          </a-tooltip>
        </div> -->
      </div>
    </div>
    <ChatList @selectChat="select" v-if="routerName == 'chat'" />
    <BotList @selectChat="select" v-else-if="routerName == 'bot'" />
    <ChainList @selectChat="select" v-else-if="routerName == 'chain'" />
    <template v-else></template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import { useChainStore } from "@/store/modules/chain.js";
import { useLoginStore } from "@/store/modules/user.js";
import avatar from "@/assets/avatar.svg";
import ChatList from "./ChatList.vue";
import BotList from "./bot/BotList.vue";
import ChainList from "./chain/ChainList.vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import UserSetting from "@/components/user/UserSetting.vue";
import { SettingOutlined, ReadOutlined, UserOutlined, QuestionCircleOutlined } from "@ant-design/icons-vue";
import services from "@/services/index";
import manage from "@/assets/manage.svg";

// import { loadEnv } from "vite";
// const env = loadEnv("development", process.cwd());

const route = useRoute();
const router = useRouter();

const t = inject("$i18nT");
const chatStore = useChainStore();
const loginStore = useLoginStore();
let popShow = ref(true); //弹窗开启状态

const { selectMenu } = storeToRefs(chatStore);
const { userInfo } = storeToRefs(loginStore);
// const getAssetsImages = (url) => {
//   return new URL(`${url}`, import.meta.url).href; //本地文件路径
// };
const EDITION = import.meta.env.VITE_EDITION || "ENTERPRISE";
const isPersonal = computed(() => {
  return EDITION === "PERSONAL";
});

const menuList = computed(() => {
  let list = [
    {
      icon: new URL("/src/assets/chain/chat.png", import.meta.url).href,
      selectIcon: new URL("/src/assets/chain/chatSelect.png", import.meta.url).href,
      name: t("chat.name"),
      key: "chat",
    },
    {
      icon: new URL("/src/assets/chain/bot.png", import.meta.url).href,
      selectIcon: new URL("/src/assets/chain/botSelect.png", import.meta.url).href,
      name: t("bot.name"),
      key: "bot",
    },
    {
      icon: new URL("/src/assets/chain/chain.png", import.meta.url).href,
      selectIcon: new URL("/src/assets/chain/chainSelect.png", import.meta.url).href,
      name: t("chain.name"),
      key: "chain",
    },
  ];
  return list;
});
const select = () => {
  emit("select");
};

const toBackManagement = () => {
  window.open(import.meta.env.VITE_MANAGEMENT_URL);
};

const toHelp = () => {
  //帮助文档
  const url = "https://wudaima.yuque.com/wudaima/gc0yib?#";
  window.open(url);
};
const userName = ref("--");
//获取用户信息
const getUserInfo = async () => {
  try {
    const res = await services.user.getUserInfo();
    if (res.code === 0) {
      // 手机号码脱敏
      var pho = /(\d{3})\d*(\d{4})/;
      var str = "";
      if (res.data.phone) {
        str = res.data.phone.replace(pho, "$1****$2");
      } else if (res.data.email) {
        str = res.data.email;
      }
      userName.value = str;
      //openMessage("登录成功", "当前登录用户"+userName.value+",欢迎使用Chatbot")
    }
  } catch (error) {}
};
getUserInfo();
const emit = defineEmits(["select"]);
const routerName = computed(() => {
  return route.name;
});
const changeMenu = (key) => {
  chatStore.setSelectMenu(key);
  switch (key) {
    case "home":
      emit("select");
      router.replace({ name: key });
      break;
    case "bot":
      router.replace({ name: key });
      break;
    case "chain":
      router.replace({ name: key });
      break;
    case "chat":
      router.replace({ name: key });
      break;
    case "library":
      router.replace({ name: key });
      break;
    case "upgradation":
      emit("select");
      router.replace({ name: key });
      break;
  }
};
onMounted(() => {
  chatStore.setSelectMenu(routerName.value);
});
</script>

<style lang="scss" scoped>
.chain-menu {
  display: flex;
  width: 100%;
  background: rgba(32, 33, 35);
  position: relative;
  z-index: 112;
  height: 100%;
  .menus {
    width: 70px;
    border-right: 1px solid #979797;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .list {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 9px;
      .item {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        margin-bottom: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: rgba(255, 255, 255, 1);
        &:hover {
          background: rgb(42, 43, 50);
        }
        .item-icon {
          width: 15px;
          height: 14px;
        }
      }
      .select-item {
        background-color: #fff !important;
        color: rgba(32, 33, 35, 1);
      }
    }
    .setting {
      display: flex;
      flex-direction: column;
      align-items: center;
      .library {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        margin-bottom: 20px;
        color: #fff;
        &:hover {
          background: rgb(42, 43, 50);
        }
      }
      :deep(.pop-up) {
        z-index: 11111;
      }
      .select-library {
        background-color: #fff !important;
        color: rgb(32, 33, 35);
      }
      .user-setting {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        background-color: #fff;
        margin-bottom: 15px;
        position: relative;
        .avatar-img {
          width: 35px;
          height: 35px;
        }
      }
    }
  }
}
</style>
