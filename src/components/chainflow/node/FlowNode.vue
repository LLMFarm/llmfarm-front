<template>
  <div :class="className">
    <div class="title">
      {{ flowNode.title }}

      <img :src="debug" alt="" class="debug" @click="debugNode">
    </div>
    <div class="desc">
      <p v-if="!isEditing" @dblclick="isEditing = true">{{ desc }}</p>
      <a-textarea v-if="isEditing" v-model:value="desc" :bordered="false" :rows="2" @keyup.enter="isEditing = false" />
    </div>
    <div class="content">
      <!-- 入参 -->
      <div class="item request-item" :class="{ 'ignored': ignored.has(item.type) }" v-for="(item, index) in rendered"
        :key="index">
        <div class="label">
          {{ item.label }}
        </div>

        <div class="setting">
          <Config v-model:value="flowNode.value[item.key]" :option="flowNode.value" :type="item.type" :label="item.label"
            :control="item.control" />
        </div>
      </div>

      <!-- 出参 -->
      <div class="item response-item" v-for="(item, index) in nodeSchema.response" :key="index">
        {{ item.key }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { Modal as AModal, Textarea as ATextarea, Button as AButton } from "ant-design-vue"
import Config from "./Config.vue"
import schema from "../schema/index.js";
import { provide, inject, onMounted, ref, computed, watch } from "vue";
import Node from './Node';
import debug from "@/assets/icons/run.svg"
import emitter from "@/components/emitter.js"

const getNode = inject('getNode');
const node = getNode();

// 自定义请求参数
const requests = ref([]);

const ignored = new Set(['trigger-config', 'api-config', 'request-config', 'condition-config']);

const rendered = computed(() => {
  return requests.value.length ? requests.value : nodeSchema.value.request;
})

const flowNode = ref({});
const flowNodeId = ref('');

onMounted(() => {
  flowNodeId.value = node.id;
  const data = node.getData();
  flowNode.value = data;
  requests.value = data.requests || [];
});

const isEditing = ref(false);
const desc = computed({
  get() {
    return flowNode.value.desc;
  },
  set(value) {
    flowNode.value.desc = value;
    node.setData(flowNode.value);
  }
})

watch(
  () => flowNode.value.value,
  (newValue) => {
    // console.log('Flow node item value has changed:', newValue)
    node.setData(flowNode.value);
  }, { deep: true }
)


const className = computed(() => {
  const status = "";
  return `node ${status}`;
})

const nodeSchema = computed(() => {
  const type = flowNode.value.type;
  return schema[type] || (window.remoteSchema||{})[type] || { input: [] }
})

const handleDynamic = () => {
  console.log('handleDynamic')
  const instance = new Node(node);
  console.log("instance.type", instance.type);
  if (instance.type === "PromptTemplate") {
    const list = instance.buildTemplate();
    if (Array.isArray(list)) {
      requests.value = list;
    }
  }
}
provide('handleDynamic', handleDynamic)

provide('flowNode', flowNode);

const debugNode = () => {
  console.log("debugNode", node.id);
  emitter.emit('debug-node', node.id);
}

</script>

<style lang="scss" scoped>
.debug {
  width: 18px;
  height: 18px;
  position: absolute;
  right: 16px;
  cursor: pointer;
}

.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: fit-content;
  background-color: #fff;
  border: 1px solid #c2c8d5;
  border-left: 4px solid #5f95ff;
  border-radius: 6px;
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  .title {
    width: 300px;
    height: 60px;
    display: flex;
    width: 100%;
    padding: 16px;
    background-color: #f9fafb;
  }

  .desc {
    height: 60px;
    padding: 8px 16px;
    font-size: 14px;
    color: #6b7280;
    width: 100%;
  }

  .content {
    width: 100%;
    padding-bottom: 15px;
  }

  .item {
    width: 100%;
    padding: 8px 16px;
    display: flex;
    background-color: #f9fafb;
    margin-top: 4px;
  }

  .request-item {
    height: 76px;
    flex-direction: column;

    .label {
      font-size: 14px;
    }

    &.ignored {
      justify-content: center;

      .label {
        display: none;
      }
    }
  }

  .response-item {
    height: 36px;
    justify-content: flex-end;
    padding: 8px 16px;
  }
}


.x6-node-selected .node {
  border-color: #1890ff;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #d4e8fe;
}

.x6-node-selected .node.success {
  border-color: #52c41a;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #ccecc0;
}

.x6-node-selected .node.failure {
  border-color: #ff4d4f;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #fedcdc;
}

.x6-edge:hover path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1px;
}

.x6-edge-selected path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1.5px !important;
}

@keyframes running-line {
  to {
    stroke-dashoffset: -1000;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>