<!-- 后续抽离左侧列表组件 -->
<template>
  <nav class="navbar">
    <div class="toolbar">
      <div class="addBtn" @click="addConversation">
        <div class="itemLeft">
          <img class="itemIcon" :src="addIcon" />
        </div>
        <div class="itemRight">新会话</div>
      </div>
    </div>
    <div class="list">
      <ul>
        <li
          :class="{ active: conversation.id === currentConversation.id }"
          v-for="(conversation, index) in conversations"
          :key="index"
          @click="selectConversation(conversation)"
        >
          <div class="title" v-if="conversation.itemShow == 'normal'">
            <div class="itemLeft">
              <img class="itemIcon" :src="chainIcon" />
            </div>
            <div class="itemRight">
              {{ conversation.name }}
            </div>
          </div>
          <div class="title" v-if="conversation.itemShow == 'deleteShow'">
            <div class="itemLeft">
              <img class="itemIcon" :src="deleteIcon" />
            </div>
            <div class="itemRight">确认删除"{{ conversation.name || "新会话" }}"</div>
          </div>
          <div class="title" v-if="conversation.itemShow == 'editShow'">
            <div class="itemLeft">
              <img class="itemIcon" :src="chainIcon" />
            </div>
            <div class="itemRight">
              <input class="editInput" id="edit-input" type="text" v-model="conversation.name" placeholder="" />
            </div>
          </div>
          <div class="op" v-if="conversation.id === currentConversation.id">
            <div class="itemLeft" v-if="conversation.itemShow == 'normal'">
              <div class="icon" @click.stop="editClick(conversation.itemShow, index, 'open')">
                <!-- <img class="updateIcon" :src="updateIcon" /> -->
                <edit-outlined style="font-size: 16px" />
              </div>
              <div class="icon" @click.stop="deleteClick(conversation.itemShow, index)">
                <!-- <img class="deleteIcon" :src="deleteIcon" /> -->
                <delete-outlined style="font-size: 16px" />
              </div>
            </div>
            <div class="itemLeft" v-if="conversation.itemShow == 'deleteShow'">
              <div class="icon" @click.stop="deleteConversation(index)">
                <!-- <img class="updateIcon" :src="okIcon" /> -->
                <check-outlined style="font-size: 14px" />
              </div>
              <div class="icon" @click.stop="deleteClick(conversation.itemShow, index)">
                <!-- <img class="deleteIcon2" :src="notIcon" /> -->
                <close-outlined style="font-size: 14px" />
              </div>
            </div>
            <div class="itemLeft" v-if="conversation.itemShow == 'editShow'">
              <div class="icon" @click.stop="editClick(conversation.itemShow, index, 'ok')">
                <!-- <img class="updateIcon" :src="okIcon" /> -->
                <check-outlined style="font-size: 14px" />
              </div>
              <div class="icon" @click.stop="editClick(conversation.itemShow, index, 'close')">
                <!-- <img class="deleteIcon2" :src="notIcon" /> -->
                <close-outlined style="font-size: 14px" />
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="moreDiv" v-if="conversations.length > 0 && pageIndex < totalPage && totalPage != 0">
        <div class="moreBtn" @click="moreClick">加载更多</div>
      </div>
    </div>
    <pop></pop>
  </nav>
</template>

<script setup>
import { computed, ref, nextTick, inject } from "vue";
import { useChatStore } from "@/store/modules/chat.js";
import { useDialogStore } from "@/store/modules/dialog";
import addIcon from "@/assets/add.png";
import chainIcon from "@/assets/chain/chain.png";
import updateIcon from "@/assets/updateIcon.png";
import deleteIcon from "@/assets/deleteIcon.png";
import okIcon from "@/assets/正确.svg";
import notIcon from "@/assets/错误.svg";
import { useRouter, useRoute } from "vue-router";
import services from "@/services/index";
import { storeToRefs } from "pinia";
import pop from "./Pop.vue";
import { ymPoint } from "@/utils/point.js";
import { message } from "ant-design-vue";
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons-vue";
const t = inject("$i18nT");
const chatStore = useChatStore();
const dialogStore = useDialogStore();
const { conversations } = storeToRefs(chatStore);
const router = useRouter();
const route = useRoute();
const { chatId } = route.params;
let oldName = ""; //当前选中会话名称
let count;
let allData;
let pageData;
let pageIndex = 1;
let totalPage = 1;
const pageSize = 20;
// 查询会话列表
const chatListInit = async () => {
  try {
    const res = await services.chat.chatList("", "");
    if (res.code === 0) {
      if (res.data) {
        res.data.map((item) => {
          item.itemShow = "normal";
        });
        allData = res.data;
        pageData = res.data.slice(0, 20);
        chatStore.setConversations(pageData);
        count = res.data.length;
        totalPage = Math.ceil(count / pageSize);
        chatStore.selectConversation(chatStore.getConversationByID(chatId));
        console.log(
          "chatId",
          chatId,
          chatStore.getConversationByID(chatId),
          "aaaa",
          chatStore.selectConversation(chatStore.getConversationByID(chatId))
        );
        return res.data;
      } else {
        chatStore.setConversations([]);
        return [];
      }
    } else {
      console.log("rs", res);
      message.warning(res.message ? res.message : "查询会话列表接口请求失败");
    }
  } catch (error) {
    console.log(error);
    message.warning("查询会话列表接口调用失败");
  }
};
//初始化调用查询列表
chatListInit();

// 获取当前选中的会话
const currentConversation = computed(() => {
  return chatStore.selectedConversation
    ? chatStore.selectedConversation
    : conversations.filter((item) => item.id == chatId)[0];
});

// 切换选中的会话
const selectConversation = (conversation) => {
  chatStore.selectConversation(conversation);
  router.replace({
    name: "chatbot",
    params: {
      chatId: conversation.id,
    },
  });
  emit("selectChat");
};
const emit = defineEmits(["selectChat"]);

// 添加会话
const addConversation = () => {
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
    name: "chatbot",
    params: {
      chatId: "",
    },
  });
  emit("selectChat");
};

//删除方法
const deleteConversation = async (index) => {
  try {
    ymPoint("chat_click_delete", "确认删除会话");
  } catch (error) {
    console.log("埋点", error);
  }
  try {
    const res = await services.chat.deleteChat(conversations.value[index].id);
    if (res.code === 0) {
      console.log("res", res);
      chatStore.deleteConversation(index);
      router.replace({
        name: "chatbot",
        params: {
          chatId: "",
        },
      });
      return res.data;
    } else {
      message.warning(res.message ? res.message : t("fail", { msg: t("delete") }));
    }
  } catch (error) {
    console.log(error);
    message.warning(t("fail", { msg: t("delete") }));
  }
};

//确认删除开关
const deleteClick = (itemShow, index) => {
  if (itemShow == "normal" || itemShow == undefined) {
    try {
      ymPoint("chat_click_confirm_delete", "提示删除会话");
    } catch (error) {
      console.log("埋点", error);
    }
    conversations.value.map((item) => {
      item.itemShow = "normal";
    });
    conversations.value[index].itemShow = "deleteShow";
  } else {
    try {
      ymPoint("chat_click_close_confirm_delete", "关闭提示删除会话");
    } catch (error) {
      console.log("埋点", error);
    }
    conversations.value[index].itemShow = "normal";
  }
};

//修改事件
const editClick = (itemShow, index, status) => {
  if (itemShow == "normal" || itemShow == undefined) {
    try {
      ymPoint("chat_click_confirm_update", "提示修改会话");
    } catch (error) {
      console.log("埋点", error);
    }
    conversations.value.map((item) => {
      item.itemShow = "normal";
    });
    conversations.value[index].itemShow = "editShow";
    nextTick(() => {
      document.getElementById("edit-input")?.focus();
    });
  } else {
    try {
      ymPoint("chat_click_close_confirm_update", "关闭提示修改会话");
    } catch (error) {
      console.log("埋点", error);
    }
    conversations.value[index].itemShow = "normal";
  }

  if (status == "close") {
    conversations.value[index].name = oldName;
  } else if (status == "open") {
    oldName = conversations.value[index].name;
  } else if (status == "ok") {
    if (conversations.value[index].name && conversations.value[index].name != "") {
      const updateChat = async () => {
        try {
          ymPoint("chat_click_update", "修改会话名称");
        } catch (error) {
          console.log("埋点", error);
        }
        try {
          const res = await services.chat.updateChat(conversations.value[index].name, conversations.value[index].id);
          if (res.code === 0) {
            oldName = "";
            return res.data;
          } else {
            conversations.value[index].name = oldName;
            message.warning(res.message ? res.message : "修改会话接口请求失败");
          }
        } catch (error) {
          message.warning("修改会话接口调用失败");
        }
      };
      updateChat();
    } else {
      // conversations.value[index].name = oldName;
      conversations.value[index].itemShow = "editShow";
      message.warning("会话名称不可为空");
    }
  } else {
    oldName = "";
  }
};

//点击加载更多
const moreClick = () => {
  try {
    ymPoint("chat_click_more_chatlist", "点击加载更多会话");
  } catch (error) {
    console.log("埋点", error);
  }
  pageIndex++;
  pageData = allData.slice(0, pageIndex * pageSize);
  chatStore.setConversations(pageData);
};
</script>

<style lang="scss" scoped>
.navbar {
  width: calc(100% - 70px);
  padding: 8px;
  height: 100vh;
  position: relative;
  .list {
    margin-top: 58px;
    height: calc(100% - 120px);
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
  height: 50px;
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
  height: 100%;
  position: relative;
  cursor: pointer;
}

.addBtn:hover {
  background: hsla(240, 9%, 59%, 0.1);
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
