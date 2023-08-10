<template>
  <pre :class="`language-${language}`" style="width: 100%;">
    <code :class="`language-${language}`" v-html="Prism.highlight(code, Prism.languages[language], language)"></code>
  </pre>
</template>

<script setup>
import { computed, defineProps } from "vue";
import Prism from "prismjs";

const props = defineProps({
  code: {
    type: String,
    defualt: "sql",
  },
  language: {
    type: String,
    defualt: "",
  },
});

</script>

<style lang="scss" scoped>
/* 代码不换行 */
pre {
  box-sizing: border-box;
}

pre>code[class*="language-"] {
  box-sizing: border-box !important;
  white-space: pre-wrap;
}
</style>


