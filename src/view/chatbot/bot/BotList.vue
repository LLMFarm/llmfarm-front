<template>
  <nav class="navbar">
    <div class="toolbar">
      <div class="addBtn" @click="addBot">
        <div class="itemLeft">
          <img class="itemIcon" :src="addIcon" />
        </div>
        <div class="itemRight">{{ $t("bot.newBot") }}</div>
      </div>
      <div class="search">
        <a-input v-model:value="searchValue" :placeholder="$t('bot.searchPlaceholder')"></a-input>
      </div>
    </div>
    <div class="list">
      <ul>
        <li
          :class="{ active: bot.id === currentBot.id }"
          v-for="(bot, index) in data"
          :key="index"
          @click="selectBot(bot)"
        >
          <div class="title" v-if="bot.itemShow == 'normal'">
            <div class="itemLeft">
              <img class="itemIcon" :src="botIcon" />
            </div>
            <div class="itemRight">
              {{ bot.botName }}
              <div class="chainName">
                {{ bot.chainName }}
              </div>
              <!-- <div class="chainName">
                {{ bot.shareType }}
              </div> -->
            </div>
          </div>
          <div class="title" v-if="bot.itemShow == 'deleteShow'">
            <div class="itemLeft">
              <img class="itemIcon" :src="deleteIcon" />
            </div>
            <div class="itemRight">{{ $t("confirmDelete") }}"{{ bot.botName || $t("bot.newBot") }}"</div>
          </div>
          <div class="title" v-if="bot.itemShow == 'editShow'">
            <div class="itemLeft">
              <img class="itemIcon" :src="botIcon" />
            </div>
            <div class="itemRight">
              <input class="editInput" id="edit-input" type="text" v-model="bot.botName" placeholder="" />
            </div>
          </div>
          <div class="op" v-if="bot.userType == 'user' && bot.id === currentBot.id">
            <div class="itemLeft" v-if="bot.itemShow == 'normal'">
              <template v-if="bot.userPermission == 'creator'">
                <div class="icon" @click.stop="editClick(bot.itemShow, index, 'open')">
                  <!-- <img class="updateIcon" :src="updateIcon" /> -->
                  <a-tooltip>
                    <template #title>{{ $t("bot.modifyName") }}</template>
                    <edit-outlined style="font-size: 16px" />
                  </a-tooltip>
                </div>
                <div class="icon" @click.stop="deleteClick(bot.itemShow, index)">
                  <!-- <img class="deleteIcon" :src="deleteIcon" /> -->
                  <a-tooltip>
                    <template #title>{{ $t("delete") }}</template>
                    <delete-outlined style="font-size: 16px" />
                  </a-tooltip>
                </div>
              </template>
              <template v-else>
                <div class="icon" @click.stop="showExitConfirm(bot)">
                  <a-tooltip>
                    <template #title>退出</template>
                    <export-outlined style="font-size: 16px" />
                  </a-tooltip>
                </div>
              </template>
            </div>
            <div class="itemLeft" v-if="bot.itemShow == 'deleteShow'">
              <div class="icon" @click.stop="deleteBot(index)">
                <a-tooltip>
                  <template #title>{{ $t("confirmDelete") }}</template>
                  <check-outlined style="font-size: 14px" />
                </a-tooltip>
              </div>
              <div class="icon" @click.stop="deleteClick(bot.itemShow, index)">
                <a-tooltip>
                  <template #title>{{ $t("cancel") }}</template>
                  <close-outlined style="font-size: 14px" />
                </a-tooltip>
              </div>
            </div>
            <div class="itemLeft" v-if="bot.itemShow == 'editShow'">
              <div class="icon" @click.stop="editClick(bot.itemShow, index, 'ok')">
                <a-tooltip>
                  <template #title>{{ $t("bot.confirmModify") }}</template>
                  <check-outlined style="font-size: 14px" />
                </a-tooltip>
              </div>
              <div class="icon" @click.stop="editClick(bot.itemShow, index, 'close')">
                <a-tooltip>
                  <template #title>{{ $t("cancel") }}</template>
                  <close-outlined style="font-size: 14px" />
                </a-tooltip>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <!-- <div class="moreDiv" v-if="bots.length > 0 && pageIndex < totalPage && totalPage != 0">
        <div class="moreBtn" @click="moreClick">加载更多</div>
      </div> -->
    </div>
    <pop></pop>
  </nav>
  <a-modal :title="newBotTitle" v-model:visible="visible">
    <template #footer>
      <a-button key="cancel" @click="handleCancel">{{ $t("cancel") }}</a-button>
      <a-button key="submit" type="primary" :confirm-loading="confirmLoading" @click="handleOk">{{
        $t("create")
      }}</a-button>
    </template>
    <a-form ref="formRef" :model="form">
      <a-form-item
        :label="$t('bot.botName')"
        :colon="false"
        :rules="rules['botName']"
        :label-col="{ span: 6, offset: 0 }"
        :wrapper-col="{ offset: 0, span: 18 }"
        name="botName"
        label-align="left"
      >
        <a-input v-model:value="form.botName" :placeholder="`${$t('pleaseEnter')} ${$t('bot.botName')}`" />
      </a-form-item>
      <a-form-item
        label="Prompt Chain"
        :colon="false"
        :rules="rules['prompt']"
        :label-col="{ span: 6, offset: 0 }"
        :wrapper-col="{ offset: 0, span: 18 }"
        name="prompt"
        label-align="left"
      >
        <a-select
          v-model:value="form.prompt"
          :filter-option="filterOption"
          :options="prompts"
          show-search
          :placeholder="`${$t('pleaseSelect')} Prompt Chain`"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { computed, ref, nextTick, reactive, createVNode ,inject} from "vue";
import { useBotStore } from "@/store/modules/bot.js";
import { useChainStore } from "@/store/modules/chain.js";
import { useLoginStore } from "@/store/modules/user.js";

import addIcon from "@/assets/add.png";
import botIcon from "@/assets/chain/bot.png";
import deleteIcon from "@/assets/deleteIcon.png";
import { useRouter, useRoute } from "vue-router";
import services from "@/services/index";
import { storeToRefs } from "pinia";
import pop from "../Pop.vue";
import { ymPoint } from "@/utils/point.js";
import { message } from "ant-design-vue";
import { Modal } from "ant-design-vue";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";

const t = inject("$i18nT");
const botStore = useBotStore();
const chainStore = useChainStore();
const loginStore = useLoginStore();

const { bots } = storeToRefs(botStore);
const { chainList } = storeToRefs(chainStore);
const { userInfo } = storeToRefs(loginStore);

const router = useRouter();
const route = useRoute();
const { botId } = route.params;
let oldName = ""; //当前选中bot名称
// let count;
let allData = [];
// let pageData;
// let pageIndex = 1;
// let totalPage = 1;
// const pageSize = 20;

const visible = ref(false);
const confirmLoading = ref(false);
const formRef = ref();
const searchValue = ref("");

const newBotTitle = computed(() => {
  return t("bot.newBot");
});

// 模糊搜索
const inputMatch = (text = "") => {
  console.log("text", text);
  let a = searchValue.value || "";
  let str = ["", ...a, ""].join(".*"); //转化成正则格式的字符串
  let reg = new RegExp(str); //正则
  return reg.test(text || ""); //去匹配待查询的字符串
};

const data = computed(() => {
  return bots.value
    .map((item) => {
      item.key = item.id;
      return item;
    })
    .filter((item) => inputMatch(item.botName) || inputMatch(item.chainName));
});

const prompts = computed(() => {
  return chainList.value.map((item) => {
    return {
      label: item.chainName,
      value: item.id,
    };
  });
});

const form = reactive({
  botName: "",
  prompt: null,
});
const rules = reactive({
  botName: [{ required: true, message: "请输入Bot名称" }],
  prompt: [{ required: true, message: "请选择Prompt Chain" }],
});

const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const handleOk = () => {
  confirmLoading.value = true;
  formRef.value.validateFields().then((res) => {
    console.log(formRef.value, form, res);
    services.bot.addBot(form.botName, form.prompt).then((addRes) => {
      if (addRes.code === 0) {
        message.success(t("success", { msg: t("add") }));
        let data = addRes.data;
        data.itemShow = "normal";
        data.shareOpen = false;
        data.userPermission = "creator";
        data.chainName = (chainList.value.find((item) => item.id === data.chainId) || {}).chainName;
        // allData.unshift(data);
        // botStore.setBots(allData);
        botStore.addBot(data);
        selectBot(botStore.getBotByID(data.id));
      } else {
        message.error("添加失败");
      }
      visible.value = false;
    });
    confirmLoading.value = false;
    if (res) {
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};
const handleCancel = () => {
  visible.value = false;
  confirmLoading.value = false;
};

// 查询bot列表
const initBotList = async () => {
  try {
    const res = await services.bot.botList();
    if (res.code === 0) {
      if (res.data) {
        res.data.map((item) => {
          item.itemShow = "normal";
        });
        allData = res.data;
        // pageData = res.data.slice(0, 20);
        botStore.setBots(allData);
        // count = res.data.length;
        // totalPage = Math.ceil(count / pageSize);
        if (!botId && allData.length > 0) {
          botStore.selectBot(botStore.getBotByID(allData[0].id));
          router.push({ botName: "bot", params: { botId: allData[0].id } });
        } else {
          botStore.selectBot(botStore.getBotByID(botId));
        }
        return res.data;
      } else {
        botStore.setBots([]);
        return [];
      }
    } else {
      console.log("rs", res);
      message.warning(res.message ? res.message : "查询bot列表接口请求失败");
    }
  } catch (error) {
    console.log(error);
    message.warning("查询bot列表接口调用失败");
  }
};
// 查询chain列表
const initChainList = async () => {
  try {
    const res = await services.chain.chainList();
    if (res.code === 0) {
      if (res.data) {
        chainStore.setChainList(res.data);
        return res.data;
      } else {
        botStore.setBots([]);
        return [];
      }
    } else {
      console.log("rs", res);
      message.warning(res.message ? res.message : "查询chain列表接口请求失败");
    }
  } catch (error) {
    console.log(error);
    message.warning("查询chain列表接口调用失败");
  }
};
//初始化调用查询列表
initBotList();
initChainList();
// 获取当前选中的bot
const currentBot = computed(() => {
  return botStore.selectedBot ? botStore.selectedBot : bots.filter((item) => item.id == botId)[0];
});

// 切换选中的bot
const selectBot = (bot) => {
  botStore.selectBot(bot);
  router.replace({
    name: "bot",
    params: {
      botId: bot.id,
    },
  });
  emit("selectChat");
};
const emit = defineEmits(["selectChat"]);

// 添加bot
const addBot = () => {
  // const bot = { 'id': new Date().getTime(), 'itemShow': 'normal' }
  // botStore.addBot(bot)
  form.botName = "";
  form.prompt = null;
  try {
    ymPoint("bot_click_list_add", "bot点击新增");
  } catch (error) {
    console.log("埋点", error);
  }
  // botStore.selectBot({});
  // router.replace({
  //   name: "bot",
  //   params: {
  //     botId: "",
  //   },
  // });
  visible.value = true;

  emit("selectBot");
};

//删除方法
const deleteBot = async (index) => {
  try {
    ymPoint("chat_click_delete", "确认删除bot");
  } catch (error) {
    console.log("埋点", error);
  }
  try {
    const res = await services.bot.deleteBot(data.value[index].id);
    if (res.code === 0) {
      console.log("res", res);
      let botIndex = bots.value.findIndex((item) => item.id == data.value[index].id);
      botStore.deleteBot(botIndex);
      message.success(t("success", { msg: t("delete") }));
      router.replace({
        name: "bot",
        params: {
          botId: "",
        },
      });
      return res.data;
    } else {
      message.warning(res.message ? res.message : "删除bot接口请求失败");
    }
  } catch (error) {
    console.log(error);
    message.warning("删除bot接口调用失败");
  }
};

//确认删除开关
const deleteClick = (itemShow, index) => {
  if (itemShow == "normal" || itemShow == undefined) {
    try {
      ymPoint("chat_click_confirm_delete", "提示删除bot");
    } catch (error) {
      console.log("埋点", error);
    }
    bots.value.map((item) => {
      item.itemShow = "normal";
    });
    data.value[index].itemShow = "deleteShow";
  } else {
    try {
      ymPoint("chat_click_close_confirm_delete", "关闭提示删除bot");
    } catch (error) {
      console.log("埋点", error);
    }
    data.value[index].itemShow = "normal";
  }
};

//修改事件
const editClick = (itemShow, index, status) => {
  console.log("itemShow", itemShow);
  if (itemShow == "normal" || itemShow == undefined) {
    try {
      ymPoint("bot_click_confirm_update", "提示修改bot");
    } catch (error) {
      console.log("埋点", error);
    }
    bots.value.map((item) => {
      item.itemShow = "normal";
    });
    //bots.value[index].itemShow = "editShow";
    data.value[index].itemShow = "editShow";
    nextTick(() => {
      document.getElementById("edit-input")?.focus();
    });
  } else {
    try {
      ymPoint("chat_click_close_confirm_update", "关闭提示修改bot");
    } catch (error) {
      console.log("埋点", error);
    }
    //bots.value[index].itemShow = "normal";
    data.value[index].itemShow = "normal";
  }

  if (status == "close") {
    //bots.value[index].botName = oldName;
    data.value[index].botName = oldName;
  } else if (status == "open") {
    //oldName = bots.value[index].botName;
    oldName = data.value[index].botName;
  } else if (status == "ok") {
    if (data.value[index].botName && data.value[index].botName != "") {
      const updateBot = async () => {
        try {
          ymPoint("bot_click_update", "修改bot名称");
        } catch (error) {
          console.log("埋点", error);
        }
        try {
          const res = await services.bot.updateBot(data.value[index].id, data.value[index].botName);
          if (res.code === 0) {
            message.success(t("success", { msg: t("modify") }));
            oldName = "";
            return res.data;
          } else {
            data.value[index].botName = oldName;
            message.warning(res.message ? res.message : "修改bot接口请求失败");
          }
        } catch (error) {
          message.warning("修改bot接口调用失败");
        }
      };
      updateBot();
    } else {
      // bots.value[index].botName = oldName;
      bots.value[index].itemShow = "editShow";
      message.warning("bot名称不可为空");
    }
  } else {
    oldName = "";
  }
};

const showExitConfirm = (bot) => {
  console.log("chain", bot);
  Modal.confirm({
    title: `确认退出bot"${bot.botName}"?`,
    icon: createVNode(ExclamationCircleOutlined),
    content: "退出后需要创建人重新邀请才能查看该bot",
    okText: "确认",
    okType: "danger",
    cancelText: "取消",
    onOk() {
      outClick(bot);
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

const outClick = async (bot) => {
  let res = await services.share.deleteChainBotUserRelation(bot.id, "bot", userInfo.value.id);
  if (res.code === 0) {
    message.success(t("success", { msg: t("exit") }));
    initBotList();
  } else {
    message.warning(res.message || "退出失败");
  }
};

//点击加载更多
const moreClick = () => {
  try {
    ymPoint("chat_click_more_chatlist", "点击加载更多bot");
  } catch (error) {
    console.log("埋点", error);
  }
  pageIndex++;
  pageData = allData.slice(0, pageIndex * pageSize);
  botStore.setBots(pageData);
};
</script>

<style lang="scss" scoped>
.navbar {
  width: calc(100% - 70px);
  padding: 8px;
  height: 100vh;
  position: relative;

  .list {
    margin-top: 108px;
    height: calc(100% - 170px);
    overflow: auto;
    padding-bottom: 30px;

    //滚动条样式处理
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.2);
    }

    &::-webkit-scrollbar-track {
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}

.moreBtn {
  width: auto;
  height: auto;
  padding: 4px 8px;
  background-color: rgba(52, 53, 65, 1);
  color: rgba(255, 255, 255);
  border-radius: 4px;
  font-size: 0.875rem;
  border: 1px solid rgba(86, 88, 105);
}

.moreDiv {
  width: 100%;
  height: 50px;
  align-items: center;
  display: flex;
  position: relative;
  justify-content: center;
}

.moreBtn:hover {
  background-color: rgba(64, 65, 79);
}

.editInput {
  color: #fff;
  background-color: rgba(32, 33, 35);
  border: 1px #2d3b75 solid;
  height: 22px;
  width: 100%;

  &:focus-visible {
    outline: none !important;
  }
}

.toolbar {
  position: absolute;
  background: rgba(32, 33, 35);
  top: 0px;
  padding-top: 8px;
  z-index: 2;
  width: calc(100% - 16px);
  height: 100px;
}

.addBtn {
  width: 100%;
  background: rgba(32, 33, 35);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 6px;
  padding: 12px;
  align-items: center;
  display: flex;
  height: 42px;
  position: relative;
  cursor: pointer;
}

.addBtn:hover {
  background: hsla(240, 9%, 59%, 0.1);
}

.search {
  margin-top: 10px;
  height: 40px;

  input {
    background-color: rgba(42, 43, 50);
    color: #fff;
    border-radius: 4px;
  }
}

li:hover {
  background: rgba(42, 43, 50);
}

.itemLeft {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  position: relative;
  width: auto;
  margin-right: 8px;

  .icon {
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.7);

    &:hover {
      color: rgba(255, 255, 255, 1);
    }
  }
}

.itemRight {
  width: auto;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  .chainName {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
  }
}

.itemIcon,
.updateIcon,
.deleteIcon {
  width: 16px;
  height: 16px;
}

.deleteIcon2 {
  width: 14px;
  height: 14px;
}

.updateIcon {
  margin-right: 8px;
}

li div.active {
  background-color: rgba(52, 53, 65, 1);
}

ul,
li {
  list-style: none;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
}

li {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-radius: 5px;
  position: relative;

  .title {
    width: 80%;
    color: #fff;
    display: flex;
    padding: 12px;
    align-items: center;
    display: flex;
    height: 100%;
    position: relative;
  }

  .op {
    width: fit-content;
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    z-index: 11;
  }

  i {
    cursor: pointer;
  }
}

li.active {
  background-color: rgba(52, 53, 65, 1);
}
</style>
