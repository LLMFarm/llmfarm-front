<template>
  <div v-html="renderHTML"></div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

// API 文档: https://markdown-it.github.io/markdown-it
import markdownIt from "markdown-it";

// https://github.com/arve0/markdown-it-attrs
import markdownItAttrs from "markdown-it-attrs";
// https://www.npmjs.com/package/markdown-it-graphviz
import markdownItGraphviz from "markdown-it-graphviz";
// import markdownItCodeCopy from 'markdown-it-code-copy';
import markdownItMermaid from "./markdown-it-mermaid";
import markdownItPrism from "./markdown-it-prism";
// https://github.com/jGleitz/markdown-it-prism#options
// 代码高亮

// 脑图渲染
// import markdownItMarkmap from './markdown-it-markmap';

// import markdownItHighlight from 'markdown-it-highlightjs'
// import hljs from 'highlight.js/lib/core';
// import 'highlight.js/styles/github.css';

const md = markdownIt({
  html: true,
  breaks: true,
  langPrefix: "language-",
  quotes: "“”‘’",
})
  .use(markdownItAttrs)
  .use(markdownItMermaid, { theme: "forest" });

md.use(markdownItGraphviz);
// md.use(markdownItCodeCopy);
md.use(markdownItPrism);
// md.use(markdownItMarkmap);

// md.use(markdownItHighlight, { hljs });

const props = defineProps({
  markdown: {
    type: String,
    default: "",
  },
});

const renderHTML = ref("");

watch(
  () => props.markdown,
  (val) => {
    renderHTML.value = md.render(val);
  }
);

// console.log("props", props.markdown);
onMounted(() => {
  renderHTML.value = md.render(props.markdown || "");
});
</script>

<style lang="scss">
.dialog-item {

  /* 代码不换行 */
  pre {
    box-sizing: border-box;
  }

  pre>code[class*="language-"] {
    box-sizing: border-box !important;
    white-space: pre-wrap;
    font-size: 14px;
  }
}
</style>
