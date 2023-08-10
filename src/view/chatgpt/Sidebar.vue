<template>
  <div class="side">
    <div class="question-container">
      <div class="title">推荐问题</div>
      <div class="question-list">
        <div
          class="question-item"
          v-for="(item, index) in questionList"
          :key="index"
          @click="quickQuestion(item)"
        >
          <span>{{ item.question }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";

const emits = defineEmits(["quickQuestion"]);

const quickQuestion = (item) => {
  // console.log("quickQuestion");
  emits("quickQuestion", item);
};

let questionList = ref([]);

onMounted(() => {
  questionList.value = [
    {
      id: 1,
      question: "近3年的客户省份分布统计数据",
    },
    {
      id: 2,
      question: "在2021年内添加的所有客户创建时间的月份分布",
    },
    {
      id: 3,
      question: "在2021年内添加的所有客户所在省份分布数据",
    },
    {
      id: 4,
      question: "从21年开始到现在的客户的每月增长趋势",
    },
  ];
  // console.log('questionList',questionList)
});
</script>

<style lang="scss" scoped>
.side {
  padding: 14px;

  .question-container {
    width: 300px;
    background: #fff;
    border-radius: 2px;
    -webkit-box-shadow: 0 1px 3px hsl(0deg 0% 7% / 10%);
    box-shadow: 0 1px 3px hsl(0deg 0% 7% / 10%);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-bottom: 10px;
    overflow: hidden;

    .title {
      align-items: center;
      border-bottom: 1px solid #f6f6f6;
      box-sizing: border-box;
      display: flex;
      height: 50px;
      justify-content: space-between;
      padding: 0 20px;
    }

    .question-list {
      padding: 16px 20px;

      .question-item {
        cursor: pointer;
        color: #8590a6;
        font-size: 14px;
        line-height: 21px;
        margin-top: 10px;
      }
    }
  }
}
</style>
