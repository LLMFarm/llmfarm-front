<template>
  <a-config-provider :locale="locale">
    <router-view></router-view>
  </a-config-provider>
</template>

<script setup>
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";
import { computed } from "vue";

const locale = computed(() => {
  const language = (navigator.language || "en").toLocaleLowerCase(); // 这是获取浏览器的语言
  let useLocale = localStorage.getItem("lang") || language.split("-")[0] || "en";
  // return enUS;
  return useLocale === "zh" ? zhCN : enUS;
});
</script>

<style>
body {
  overflow: hidden;
}
</style>
