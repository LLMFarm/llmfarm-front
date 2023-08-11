import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import i18n from '@/locals/index'

const { t } = i18n.global;

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [], // 对话列表
    selectedConversation: {}, // 当前选中的会话
    userDailyUsage: {},//已用token
    userDailyUsageList: [],
    openContext: false,
    dialogOptions: [
      { id: "单", name: "单轮对话", round: t('chat.singleRound') },
      { id: "连", name: "连续对话", round: t('chat.multiRound') },
    ],
    defaultDialog: { id: "单", name: "单轮对话" }
  }),
  actions: {
    updateOpenContext(open) {
      this.openContext = open;
    },
    // 添加一条对话
    addConversation(conversation) {
      if (!conversation.itemShow) {
        conversation.itemShow = 'normal';
      }
      this.conversations.unshift(conversation)
    },
    // 更新剩余用量
    updateUserDailyUsage(info) {
      this.userDailyUsage = info
    },
    // 更新剩余用量
    updateUserDailyUsageList(list) {
      this.userDailyUsageList = list;
      let conversation = this.conversations.find(item => item.id === this.selectedConversation.id) || {};
      console.log(conversation, 'updateUserDailyUsageList');
      if (conversation.contextType) return;
      // list?.forEach(item => {
      //   // if (item.modelName === "gpt-3.5-turbo") {
      //   if (item.dailyTokens >= 100000) {
      //     this.defaultDialog = { id: "连", name: "连续对话" }
      //   } else {
      //     this.defaultDialog = { id: "单", name: "单轮对话" }
      //   }
      //   // }
      // })
    },
    //更新defaultDialog
    updateDefaultDialog(dialog) {
      this.defaultDialog = dialog
    },
    // 删除一条对话
    deleteConversation(index) {
      this.conversations.splice(index, 1)
      if (this.conversations.length) {
        this.selectConversation([]);
      } else {
        this.selectConversation({})
      }
    },
    // 更新一条对话
    updateConversation({ id, conversation }) {
      // const index = this.conversations.findIndex(item => item.id === id)
      // this.conversations.splice(index, 1, conversation)
      this.conversations.forEach(item => {
        if (item.id === id) {
          item = conversation;
        }
      })
    },
    // 修改对话列表
    setConversations(list) {
      this.conversations = list || [];
      return this.conversations
    },
    // 清空对话列表
    clearConversations() {
      this.conversations = [];
      this.selectConversation({})
    },
    // 获取对话列表
    getConversations() {
      return this.conversations
    },
    getConversationByID(id) {
      return this.conversations.find(item => item.id === parseInt(id)) || {}
    },
    // 更新选中的会话
    selectConversation(conversation) {
      console.log("更换conversation", conversation);
      this.selectedConversation = conversation
    },
    saveConversation() {
      this.conversations = this.conversations.map(item => {
        if (item.uuid === this.selectedConversation.uuid) {
          item.messages = this.selectedConversation.messages || [];
          console.log("更新消息条数", item.messages.length);
        }
        return item;
      });
    },
    appendMessage(type, content) {
      const message = { uuid: uuidv4(), type, content };
      const sc = this.selectedConversation;
      sc.messages.push(message);
      return message;
    },
    updateMessage(message, content) {
      // message.content += content;
      // console.log("update message", message.content)
      const sc = this.selectedConversation;
      sc.messages = sc.messages.map(item => {
        if (item.uuid === message.uuid) {
          item.content += content;
        }
        return item;
      });
    },
    clearChat() {
      this.conversations = [];
      this.selectedConversation = {};
    }
  },
  persist: false,
  // plugins: [createPersistedState()]
})
