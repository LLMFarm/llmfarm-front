<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane label="文件上传" name="pdf">
      <FileUpload />
    </el-tab-pane>
    <el-tab-pane label="数据分析" name="sql" disabled>
      <Connection />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { computed, ref } from "vue";
import FileUpload from "./FileUpload.vue";
import Connection from "./Connection.vue";

const activeTab = ref('pdf');

</script>

<style lang="scss" scoped></style>