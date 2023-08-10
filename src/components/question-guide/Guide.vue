<!-- QuestionGuide -->
<template>
  <div class="outer">
    <!-- <SelectModel> </SelectModel> -->
    <div class="chat-title">
      {{ propState.guideName }}
      <slot name="guide_name"></slot>
    </div>
    <div class="illustrate">{{ illustrateContent }}</div>
    <div class="content" v-if="propState.showContent">
      <!-- 问题例子 -->
      <div class="example">
        <div class="top">
          <svg
            class="icon-sun"
            stroke="currentColor"
            fill="none"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            height="1.8em"
            width="1.8em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <p class="content-title">例子</p>
        </div>

        <exampleList :guideData="exampleData" @listSelect="selectGuide" />
      </div>
      <!-- 中间能力 -->
      <div class="ability">
        <div class="top">
          <svg
            class="icon-sun"
            stroke="currentColor"
            fill="none"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            height="1.8em"
            width="1.8em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
            ></path>
          </svg>
          <p class="content-title">能力</p>
        </div>

        <exampleList :guideData="abilityData" />
      </div>
      <!-- 限制 -->
      <div class="limit">
        <div class="top">
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-6"
            height="1.8em"
            width="1.8em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <p class="content-title">限制</p>
        </div>

        <exampleList :guideData="limitData" />
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入问题引导组件
import { ref, computed, reactive } from "vue";

import exampleList from "@/components/question-guide/GuideList.vue";
import SelectModel from "@/components/question-guide/SelectModel.vue";

const props = defineProps({
  guideObj: {
    type: Boolean,
    default: true,
  },
  guideName: {
    type: String,
    default: "Hexdo",
  },
  showContent: {
    type: Boolean,
    default: true,
  },
  illustrate: {
    type: String,
    default: "",
  },
});
const propState = reactive({
  guideName: props.guideName,
  showContent: props.showContent,
});
const illustrateContent = computed(() => props.illustrate);
const exampleData = computed(() => props.guideObj.exampleData);
const abilityData = computed(() => props.guideObj.abilityData);
const limitData = computed(() => props.guideObj.limitData);
const emits = defineEmits(["select"]);
function selectGuide(item) {
  emits("guideSelect", item);
}
</script>

<style lang="scss" scoped>
.outer {
  position: relative;
  z-index: 21;
  margin-top: -75px;
  .chat-title {
    text-align: center;
    font-weight: 700;
    font-size: 42px;
    margin-bottom: 50px;
    margin-top: 200px;
  }
  .illustrate {
    text-align: center;
    font-size: 18px;
  }
}
.content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
  flex-wrap: wrap;
  .example {
    margin-top: 10px;
  }

  .ability {
    margin-top: 10px;
    margin-left: 20px;
    .top {
      display: flex;
    }
  }
  .limit {
    margin-top: 10px;
    margin-left: 20px;
    .top {
      display: flex;
    }
  }
}
.top {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.content-title {
  font-size: 18px;
  font-weight: 500;
  margin-top: 6px;
  margin-bottom: 2px;
}
</style>
