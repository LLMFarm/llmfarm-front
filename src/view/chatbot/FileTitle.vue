<template>
  <div class="title">
    <el-icon style="margin-right: 20px;cursor: pointer;">
      <Grid @click.stop="viewVectorDB" />
    </el-icon>
    {{ currentConversation.name }}

    <el-drawer v-model="visible" direction="ttb" size="600px">
      <template #default>
        <div class="content" style="display: flex;justify-content: center;">
          <el-table-v2 :columns="columns" :data="list" :width="1200" :height="400" fixed>
          </el-table-v2>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useChatStore } from "@/store/modules/chat.js";
import chatgpt from "@/services/chatgpt.js";

const chatStore = useChatStore();

const visible = ref(false);

const columns = [{
  key: "id",
  dataKey: "id",
  title: "编号",
  width: 100,
  align: 'center',
}, {
  key: "document",
  dataKey: "document",
  title: "文档",
  width: 900,
}, {
  key: "metadata",
  dataKey: "metadata",
  title: "元数据",
  width: 200
}]
const list = ref([]);

// 获取当前选中的会话
const currentConversation = computed(() => {
  console.log(chatStore.selectedConversation)
  return chatStore.selectedConversation;
});

const viewVectorDB = async () => {
  const uuid = currentConversation.value.uuid;
  const res = await chatgpt.getVector(uuid);
  console.log("res", res);
  visible.value = true;
  list.value = res.list;
};
</script>

<style lang="scss" scoped>
.title {
  height: 50px;
  display: flex;
  align-items: center;
}
</style>