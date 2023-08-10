<template>
  <div class="dialog-render-container" :class="'theme-' + themeStoreX">
    <DialogItem :dialog="dialogHead" />
  </div>
</template>

<script setup>
import { ref, computed, provide } from "vue";
import { storeToRefs } from "pinia";
import { useDialogStore } from "@/store/modules/dialog";
import DialogItem from "./DialogItem.vue";
import { themeStore } from "/src/store/modules/theme.js";

const themeStoreX = themeStore();
const dialogStore = useDialogStore();

const { dialogTree } = storeToRefs(dialogStore);
const dialogHead = computed(() => {
  const headId = "ROOT";
  // const headId = "fe93b306-dbb8-430b-ba36-f7080043e825";
  // console.log(dialogTree.value, "dialogTree");
  return dialogTree.value[headId];
});
const emits = defineEmits(["reQuestion"]);
const reQuestion = (question) => {
  console.log(question, "question");
  emits("reQuestion", question);
};
provide("reQuestion", reQuestion);
</script>

<style lang="scss" scoped>
.dialog-render-container {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
}
</style>
