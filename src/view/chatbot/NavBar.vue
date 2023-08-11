<template>
  <nav class="navbar">
    <div class="toolbar">
      <el-button @click="addConversation" plain>+ New Chat</el-button>
    </div>
    <ul>
      <li :class="{ active: conversation.uuid === currentConversation.uuid }"
        v-for="(conversation, index) in conversations" :key="index" @click="selectConversation(conversation)">
        <div class="title">
          <el-icon style="margin-right: 10px;">
            <ChatLineRound />
          </el-icon>
          {{ conversation.name || 'conversation' }}
        </div>

        <div class="op">
          <el-icon @click.stop="deleteConversation(index)">
            <Delete />
          </el-icon>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from "vue";
import { useChatStore } from "@/store/modules/chat.js"
const chatStore = useChatStore()

// 获取所有会话
const conversations = chatStore.getConversations()

// 获取当前选中的会话
const currentConversation = computed(() => {
  return chatStore.selectedConversation;
});

// 切换选中的会话
const selectConversation = conversation => {
  chatStore.selectConversation(conversation)
}

// 添加会话
const addConversation = () => {
  const conversation = { 'uuid': uuidv4() }
  chatStore.addConversation(conversation)
  chatStore.selectConversation(conversation)
}

const deleteConversation = (index) => {
  chatStore.deleteConversation(index)
}

</script>

<style lang="scss" scoped>
li div.active {
  background-color: #eee;
}

ul,
li {
  list-style: none;
  padding: 0;
}

li {
  width: 100%;
  padding: 12px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-radius: 5px;

  .title {
    display: flex;
    align-items: center;
    flex-basis: 200px;
  }

  .op {
    width: fit-content;
    display: flex;
    align-items: center;
  }

  i {
    cursor: pointer;
  }
}

li.active {
  background-color: rgba(52, 53, 65, 0.9);
}
</style>