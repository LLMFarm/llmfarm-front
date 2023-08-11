<template>
  <div class="message-list-container">
    <div class="message-list" ref="messageList">
      <template v-for="(message, index) in messages" :key="index">
        <MessageUser v-if="message.type == 'user'" :message="message" />
        <MessageAI v-else :message="message" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useChatStore } from '@/store/modules/chat.js'
import MessageUser from '@/components/message/MessageUser.vue';
import MessageAI from '../../components/message/MessageAI.vue';

const chatStore = useChatStore()

// 获取当前会话的消息
const cc = computed(() => {
  return chatStore.selectedConversation;
});
const messages = computed(() => {
  return chatStore.selectedConversation.messages || [];
})
console.log("messages", messages);

</script>

<style scoped>
.message-list-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.message-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  overflow-y: scroll;
  height: calc(100vh - 200px);
}
</style>
