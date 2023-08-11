<template>
  <div class="content">
    <div class="chatgpt-container">
      <div class="search-box">
        <el-input class="question" v-model="question" placeholder="请输入想要了解的数据信息, 按回车进行搜索" :input-style="{
          padding: '14px 14px',
        }" @keyup.enter="askQuestion" />
      </div>
      <div class="container" v-if="step">
        <CodeRender language="md" :code="step" />
      </div>
      <div class="container sql-contianer" v-if="sql">
        <sql-render :sql="sql"></sql-render>
      </div>

      <div class="container chart-container">
        <visualRender :value="value" :renderOptions="renderOptions" />
      </div>
    </div>

    <sidebar @quickQuestion="quickQuestion" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import CodeRender from "../../components/visual-render/CodeRender.vue";
import sqlRender from "./SqlRender.vue";
import sidebar from "./Sidebar.vue";
import visualRender from "@/components/visual-render/Index.vue";
import chatgpt from "@/services/chatgpt.js";

let question = ref("");
let sql = ref(``);
let value = reactive({});
let renderOptions = ref({ type: "" });
let step = ref(``);

const clear = () => {
  step.value = "";
  sql.value = "";
  renderOptions.value = {};
  value = {};
};

const askQuestion = async () => {
  clear();
  console.log(`question is ${question.value}`);
  console.log("chatgpt", chatgpt);
  const result = await chatgpt.question(question.value);
  console.log(result);
  sql.value = result.sql;
  step.value = result.step.toString();
  value = result.sqlResult;
  renderOptions.value = result.renderOptions;
};

// 快速提问
const quickQuestion = async (item) => {
  console.log("quickQuestion", item);
  question.value = item.question;
  await askQuestion();
};

onMounted(() => {
  // console.log('mounted');
  // const source = new EventSource('/api/sse');
  // console.log('source', source);
  // source.onopen = () => {
  //   console.log("connected", arguments);
  // }
  // source.onmessage = (msg) => {
  //   console.log("msg", msg)
  // }
})
</script>

<style lang="scss" scoped>
.content {
  display: flex;
}

.chatgpt-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: calc(1200px + var(--chatgpt-layout-side-width, 0px));

  .search-box {
    margin: 0;
    width: 100%;
    display: flex;

    .question {
      width: 100%;
      color: #3c3c3c;
      border-radius: 6px;
      font-size: 20px;
      line-height: 1.5;
      height: 80px;
    }
  }

  .container {
    padding: 14px;
  }
}
</style>
