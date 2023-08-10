<template>
  <div class="container">
    <div class="menu">
      <a-button primary style="margin-right: 20px;" @click="appendChain">添加</a-button>
      <div class="menu-list">
        <div class="menu-item" v-for="(chain, index) in chainList" :key="chain.id"
          :class="{ active: chain.id == chainId }" @click="switchChain(chain)">
          <span class="flow-name">{{ chain.name }}</span>
        </div>
      </div>

    </div>
    <ChainFlow :flow="flow" @save-flow="saveFlow" @ask-question="askQuestion" />
  </div>

  <a-drawer title="问题回答" placement="right" :closable="true" :visible="visible" @close="onClose" :width="700">
    <Markdown :markdown="content" />
  </a-drawer>
</template>

<script setup>
import { onMounted, ref, watchEffect, computed } from "vue";
import ChainFlow from "@/components/chainflow/index.vue";
import Markdown from "@/components/markdown/index.vue";
import { fetchEventSource } from '@microsoft/fetch-event-source';
import chainflow from "@/services/chainflow.js"

import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const chainId = ref(null)
const flow = ref({});
const visible = ref(false);
const content = ref('');
const chainList = ref([])

const fetchChainFlow = async () => {
  // Your logic to refresh the data goes here, using the `chainId` reference
  console.log("fetch.chain.flow");
  if (chainId.value) {
    const chain = await chainflow.get(chainId.value)
    console.log('chain', chain);
    flow.value = chain.data;
  } else {
    flow.value = {
      nodes: [],
      edges: [],
    }
  }
}

const saveFlow = async (flow) => {
  console.log('saveFlow', flow);
  localStorage.setItem('flow', JSON.stringify(flow));
  if (flow.id) {
    // 更新流程
    await chainflow.put(flow);
  } else {
    // 创建流程
    const chain = await chainflow.post(flow);
    router.push({ path: `/chainflow/${chain.id}` })
  }
}

const askQuestion = (question) => {
  visible.value = true;
  const uri = '/api/chainflow/run-sse';
  // const uri = '/api/chatgpt/stream'
  fetchEventSource(uri, {
    method: 'POST',
    body: JSON.stringify({
      question: question,
      chainId: chainId.value
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    onmessage(ev) {
      const data = ev.data;
      console.log('data', data);
      content.value = content.value + data;
    },
    onerror(err) {
      console.log('err', err);
    },
  }).then((response) => {
    console.log('response', response);
  }).catch((error) => {
    console.log(error);
  });
}

const onClose = () => {
  visible.value = false;
  content.value = "";
}

// Method to initialize the component with data based on the `chainId` value
const initialize = () => {
  if (chainId.value) {
    fetchChainFlow();
  }
  chainflow.list().then((list) => {
    console.log('list', list);
    chainList.value = list.data;
  })
}

const appendChain = () => {
  router.push({ path: `/chainflow/` })
}
const switchChain = chain => {
  router.push({ path: `/chainflow/${chain.id}` })
}

// Call the `initialize` method when the component is mounted
initialize()

watchEffect(() => {
  // Update the `chainId` reference
  chainId.value = route.params.chainId || null
  // Call a method to refresh the data based on the `chainId` value
  fetchChainFlow()
})

</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
}

.menu {
  width: 100%;
  height: 60px;

  display: flex;
  align-items: center;
  padding: 5px 10px;

  .menu-list {
    display: flex;
  }

  .menu-item {
    padding: 10px;
    margin: 0 10px;
    cursor: pointer;

    &.active {
      border-bottom: 1px solid #1890ff;
    }
  }
}
</style>