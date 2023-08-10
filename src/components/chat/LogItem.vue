<template>
  <div class="item">
    <div class="title">
      <div class="name">{{ item.title }}</div>
      <div class="time">{{ item.time }}</div>
    </div>
    <div v-if="matchesList.length == 0 ">
      <div class="content" :class="{ 'collapse': collapse && isEmbedding }">
        <MarkdownRender :markdown="render(item.result)" ref="markdownRef" @on-rendered="rendered" />
      </div>
      <div class="op-icon" @click="toggleCollapse" v-if="isEmbedding">
        <DownOutlined v-if="collapse" />
        <UpOutlined v-if="!collapse" />
      </div>
    </div>
    <div v-else>
      <div v-for="item in matchesList">
        <div class="matches_content">
          {{ item.document }}
          <div v-if="item.userFile" style="margin-top: 10px;">
            <a @click="File(item)" >查看文件</a>
            <div style="margin-bottom: 10px;margin-top: 10px;">来源文件：{{ item.userFile.fileName }}</div>
            <div style="margin-bottom: 10px;">来源数据集：{{ item.userFile.setName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// use down-outlined and up-outlined
import { DownOutlined, UpOutlined } from "@ant-design/icons-vue";
import MarkdownRender from "@/components/markdown/Index.vue";
import { defineProps, ref, computed,inject } from "vue";
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});

const matchesList = ref([]);

const init = () =>{
  // console.log("init", props.item);
  if (props.item.matches && props.item.matches.length > 0) {
    matchesList.value = props.item.matches;
  }
}
init()

//打开文件
const File = (item) => {
  //触发父组件的事件
  openFile(item);
  
};

const openFile = inject("openFile");


const collapse = ref(true);
const toggleCollapse = () => {
  collapse.value = !collapse.value;
};

const isEmbedding = computed(() => {
  const result = props.item.result;
  if (Array.isArray(result) && result.length == 1536) {
    return true;
  }
})

const render = (info) => {
  const type = typeof info
  if (type === 'string') return info
  if (type === 'object') {
    const pretty = `\`\`\`json
${JSON.stringify(info, null, 2)}    
\`\`\``
    return pretty
  }
  return info.toString();
}

const markdownRef = ref(null);
const rendered = () => {
  console.log("rendered", markdownRef.value);
}
</script>

<style lang="scss" scoped>
.item {
  height: fit-content;
  margin-bottom: 10px;
  position: relative;

  .op-icon {
    position: absolute;
    left: 50%;
    bottom: -12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: rgba(247, 247, 248, 1);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    user-select: none;

    &:hover {
      background-color: rgba(70, 78, 92, 1);
      color: #fff;
    }
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .name {
      color: rgba(70, 78, 92, 1);
      font-weight: 500;
      font-size: 18px;
      max-width: 70%;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      word-wrap: break-word;
    }

    .time {
      color: rgba(118, 119, 126, 1);
      font-size: 14px;
    }
  }

  .content {
    background-color: rgba(247, 247, 248, 1);
    border-radius: 10px;
    padding: 16px;

    &.collapse {
      max-height: 200px !important;
      transition: all 0.2s ease-in-out;
      overflow: hidden;
    }
  }

  .matches_content{
    background-color: rgba(247, 247, 248, 1);
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 10px;
    &.collapse {
      max-height: 200px !important;
      transition: all 0.2s ease-in-out;
      overflow: hidden;
    }
  }
}
</style>