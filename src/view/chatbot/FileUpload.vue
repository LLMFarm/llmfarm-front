<template>
  <el-upload class="upload" ref="upload" drag action="/api/chatgpt/upload" multiple :show-file-list="true"
    :on-success="onUploadSuccess" :data="{ uuid: cc.uuid }">
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      拖拽文件到这里 / <em>点击上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        files with a size less than 1M (当前支持 PDF 文件)
      </div>
    </template>
  </el-upload>
</template>

<script setup>
import { computed, ref ,inject} from "vue";
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useChatStore } from "@/store/modules/chat.js"
const chatStore = useChatStore();

const t = inject("$i18nT");
// 获取当前选中的会话
const cc = computed(() => {
  return chatStore.selectedConversation;
});

const onUploadSuccess = (res) => {
  if (res.code == 0) {
    console.log("cc.value.uuid", cc.value.uuid);
    if (cc.value.uuid) {
      chatStore.$patch((state) => {
        state.selectedConversation.uuid = res.data.uuid;
        state.selectedConversation.name = res.data.name;
        state.selectedConversation.messages = [];
        console.log('state.selectedConversation', state.selectedConversation);
      })
    } else {
      const conversation = {
        uuid: res.data.uuid,
        name: res.data.name,
        messages: []
      }
      console.log('conversation', conversation);
      chatStore.addConversation(conversation)
      chatStore.selectConversation(conversation)
    }
  }
  ElMessage({ type: "success", message: t("success", { msg: t("library.upload") }), });
}

</script>

<style lang="scss" scoped>
.upload {
  width: 100%;
}
</style>