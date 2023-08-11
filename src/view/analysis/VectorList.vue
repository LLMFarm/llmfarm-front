<template>
  <div class="vector-list" :class="{ 'vector-details': !preview, 'preview-vector': preview }">
    <template v-if="list.length <= 0 && !loading">
      <a-empty
        :image="emptyImage"
        :description="$t('noContent')"
        :image-style="{
          height: '60px',
        }"
      >
      </a-empty>
    </template>
    <template v-else>
      <div class="item" v-for="(item, index) in list" :class="{ QA: type == 'QA' }" @click="selectVector(item, index)">
        <template v-if="type !== 'QA'">
          <div class="title">
            <div class="code">{{ `#${index + 1}` }}</div>
            <div class="name" v-if="preview">
              <font-size-outlined />
              {{ item.pageContent.length }}
              个字符
            </div>
          </div>
          <div class="body" v-html="item.pageContent"></div>
        </template>
        <template v-else>
          <!-- 倒序 -->
          <div v-for="key in Object.keys(item).reverse()">
            <div class="title">
              <div class="code">{{ key }}</div>
            </div>
            <div class="body" v-html="item[key]"></div>
          </div>
        </template>
      </div>
    </template>
  </div>
  <a-modal v-model:visible="visible" class="vector-list-details" width="500px" :footer="null" centered>
    <div class="model-body">
      <!-- 倒序 -->
      <div class="title">
        <div class="code">{{ `#${selectVectorInfo.selectIndex + 1}` }}</div>
        <div class="name" v-if="preview">
          <font-size-outlined />
          {{ selectVectorInfo.pageContent.length }}
          个字符
        </div>
      </div>
      <div class="body" v-html="selectVectorInfo.pageContent"></div>
    </div>
  </a-modal>
</template>
<script setup>
import { computed, ref, onMounted, createVNode, nextTick, onBeforeUnmount, watch } from "vue";
import services from "@/services/index";
import { Modal } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { FontSizeOutlined } from "@ant-design/icons-vue";

import { useLibraryStore } from "@/store/modules/library.js";
const router = useRouter();
const route = useRoute();
const libraryStore = useLibraryStore();
const { selectDataSetVector } = storeToRefs(libraryStore);
const emptyImage = new URL("/src/assets/empty.png", import.meta.url).href;
const visible = ref(false);
const props = defineProps({
  preview: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// const list = ref([{}, {}, {}, {}, {}]);

const list = computed(() => {
  if (props.preview) {
    return props.list || [];
  } else {
    return (
      selectDataSetVector.value.documents?.map((item) => {
        return {
          pageContent: item,
        };
      }) || []
    );
  }
});
const selectVectorInfo = ref({});
const selectVector = (item, index) => {
  console.log("selectVector", item, index);
  if (props.preview) {
    return;
  } else {
    selectVectorInfo.value = item;
    selectVectorInfo.value.selectIndex = index;
    visible.value = true;
  }
};
</script>
<style lang="scss" scoped>
.vector-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: fit-content;
  background-color: #fff;

  :deep(.ant-empty) {
    position: absolute;
    top: 0px;
    z-index: 111;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 0px;
  }
  .item {
    width: 400px;
    height: fit-content;
    background-color: rgba(249, 251, 251, 1);
    border-radius: 8px;
    margin-right: 20px;
    margin-bottom: 20px;
    padding: 12px;
    height: 200px;
    .title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .code {
        border: 1px solid rgba(233, 233, 233, 1);
        border-radius: 8px;
        padding: 0px 6px;
        color: #666;
      }
      .name {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #666;
        .anticon {
          margin-right: 4px;
        }
      }
    }
    .body {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: start;
      //自动换行
      word-break: break-all;
      height: calc(100% - 40px);
      overflow: hidden;
      .icon {
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        color: #1890ff;
      }
      .info {
        width: calc(100% - 50px);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        .item {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .label {
            width: 50%;
            text-align: left;
            font-size: 12px;
            color: #666;
          }
          .value {
            width: 50%;
            text-align: right;
            font-size: 12px;
            color: #333;
          }
        }
      }
    }
  }
  .QA {
    margin: 0px;
    width: 100%;
    margin-bottom: 20px;
    height: fit-content;

    .body {
      margin-bottom: 20px;
    }
  }
}
.vector-details {
  .item {
    transition: all 0.3s;
    // height: fit-content;
    &:hover {
      //阴影
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px 0px;
      background-color: rgba(249, 251, 251, 1);
      cursor: pointer;
    }
  }
}
.preview-vector {
  .item {
    height: fit-content;
    margin-right: 0px !important;
    width: 100%;
  }
}
</style>
<style lang="scss">
.vector-list-details {
  border-radius: 8px;
  .ant-modal-header {
    border: none;
  }
  .ant-modal-content {
    border-radius: 8px;
    background-color: rgba(249, 251, 251, 1);
  }
  .ant-modal-body {
    padding: 0;
    .model-body {
      width: 100%;
      height: fit-content;
      background-color: rgba(249, 251, 251, 1);
      border-radius: 8px;
      padding: 24px;
      max-height: 500px;

      .title {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        .code {
          border: 1px solid rgba(233, 233, 233, 1);
          border-radius: 8px;
          padding: 0px 6px;
          color: #666;
        }
        .name {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #666;
          .anticon {
            margin-right: 4px;
          }
        }
      }
      .body {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: start;
        //自动换行
        word-break: break-all;
        overflow: auto;
        height: fit-content;
        max-height: 400px;
        .icon {
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 30px;
          color: #1890ff;
        }
        .info {
          width: calc(100% - 50px);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          .item {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .label {
              width: 50%;
              text-align: left;
              font-size: 12px;
              color: #666;
            }
            .value {
              width: 50%;
              text-align: right;
              font-size: 12px;
              color: #333;
            }
          }
        }
      }
    }
  }
}
</style>
