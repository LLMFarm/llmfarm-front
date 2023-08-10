<template>
  <el-form :model="form" label-position="left" label-width="120px">
    <el-form-item label="数据库描述">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="数据库类型">
      <el-radio-group v-model="form.type">
        <el-radio-button label="mysql">MySQL</el-radio-button>
        <el-radio-button label="postgresql">PostgreSQL</el-radio-button>
        <el-radio-button label="sqlite">SQLite</el-radio-button>
        <el-radio-button label="tidb">TiDB</el-radio-button>
        <el-radio-button label="mongodb">MongoDB</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="主机地址">
      <el-input v-model="form.host"></el-input>
    </el-form-item>
    <el-form-item label="端口号">
      <el-input v-model="form.port" type="number"></el-input>
    </el-form-item>
    <el-form-item label="用户名">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.password" show-password></el-input>
    </el-form-item>
    <el-form-item label="数据库名">
      <el-input v-model="form.database"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="testConnection">测试连接</el-button>
      <el-button type="primary" :disabled="!isConnected" @click="confirm">确认添加</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { useChatStore } from "@/store/modules/chat.js";
import db from "@/services/database.js";
const chatStore = useChatStore();
// 获取当前选中的会话
const cc = computed(() => {
  return chatStore.selectedConversation;
});

const form = reactive({
  name: "", // 数据库描述
  type: "", // mysql | postgresql | sqlite | tidb | mongodb
  host: "", // 主机名
  port: "", // 端口号
  username: "", // 用户名
  password: "", // 密码
  database: "", // 数据库名称
});

let isConnected = ref(false);

const testConnection = async () => {
  // Implement your database connection test logic here.
  // If the connection succeeds, set isConnected to true.
  console.log("form", form);
  const item = Object.assign({}, form, { uuid: cc.uuid });
  const result = await db.testConnection(item);
  if (result.ok) {
    isConnected.value = true;
  }
};

const confirm = async () => {
  // Implement your "confirm add" logic here.
  // This method should only be called when isConnected is true.
};
</script>

<style lang="scss" scoped></style>
