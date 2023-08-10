<template>
    <div>
      <div class="title" style="margin-bottom: 16px">
        <div style="margin-left: 8px">
          上传记录
        </div>
        <a-input-search v-model:value="searchValue" :placeholder="$t('search',{msg:$t('fileName')+','+$t('creator')})" style="width: 200px" />
      </div>
      <a-table :columns="columns" :data-source="data" size="small" />
    </div>
</template>
<script setup>
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { storeToRefs } from "pinia";

import { useLibraryStore } from "@/store/modules/library";

const libraryStore = useLibraryStore();
const { libraryList } = storeToRefs(libraryStore);
// 模糊搜索
const columns = [
  {
    title: "chain名称",
    dataIndex: "chainName",
    sorter: (a, b) => a.chainName.length - b.chainName.length,
  },
  {
    title: "版本号",
    dataIndex: "version",
    sorter: (a, b) => a.version.length - b.version.length,
  },
  {
    title: "审批状态",
    dataIndex: "approveStatus",
  },
];
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
