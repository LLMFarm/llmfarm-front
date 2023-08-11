<template>
  <template v-if="paramChainId">
    <div class="chain-body">
      <div class="menu">
        <img class="chain-icon" src="/src/assets/chain/chainSelect.png" />

        <div class="title">{{ selectChain.chainName }}</div>
        <span class="system" v-if="!disabledChain">(当前Prompt Chain仅可查看)</span>
      </div>
      <div class="chain-flow">
        <ChainFlow
          :flow="flow"
          :disabledSave="!disabledChain"
          @save-flow="saveFlow"
          @ask-question="askQuestion"
          @debug-node="debugChainNode"
          @flow-update="flowUpdate"
        />
      </div>
    </div>

    <a-drawer
      title="问题回答"
      placement="right"
      :closable="true"
      :visible="visible"
      @close="onClose"
      :width="contentWidth"
    >
      <template #extra>
        <FullscreenOutlined @click="toggleWidth" v-if="contentWidth === '700px'" />
        <FullscreenExitOutlined @click="toggleWidth" v-else />
      </template>
      <Markdown :markdown="content" />
    </a-drawer>
  </template>
  <template v-else>
    <Guide guideName="Prompt Chain" :showContent="false"></Guide>
  </template>
  <a-modal
    v-model:visible="groundModalVisible"
    :title="$t('chain.applyListing')"
    :cancel-text="$t('cancel')"
    :ok-text="$t('submit')"
    class="grounding"
    @ok="groundModalOk"
  >
    <TrendsForm :formDomains="domains" ref="trendsForm"></TrendsForm>
  </a-modal>
  <a-modal
    v-model:visible="uploadRecordVisible"
    title="上传记录"
    cancel-text="关闭"
    ok-text="确定"
    class="uploadRecord"
    @ok="groundModalOk"
  >
  </a-modal>
</template>

<script setup>
import { inject, ref, watchEffect, computed, watch } from "vue";
import ChainFlow from "@/components/chainflow/index.vue";
import Markdown from "@/components/markdown/index.vue";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import services from "@/services/index.js";
import { useChainStore } from "@/store/modules/chain.js";
import { useLoginStore } from "@/store/modules/user.js";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Guide from "@/components/question-guide/Guide.vue";
import { message } from "ant-design-vue";
import base64 from "@/utils/base64";
import { useServiceStore } from "@/store/modules/service.js";
import { useSettingStore } from "@/store/modules/setting";
import TrendsForm from "@/components/trends-form/index.vue";
const serviceStore = useServiceStore();
const settingStore = useSettingStore();
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons-vue";
const route = useRoute();
const router = useRouter();

const t = inject("$i18nT");
const chainStore = useChainStore();
const loginStore = useLoginStore();
const { selectChain } = storeToRefs(chainStore);
const { userInfo } = storeToRefs(loginStore);

const contentWidth = ref("700px");
const trendsForm = ref();
const toggleWidth = () => {
  if (contentWidth.value === "700px") {
    contentWidth.value = "100%";
  } else {
    contentWidth.value = "700px";
  }
};
const flowUpdate = (chain) => {
  chainStore.setChain(chain);
};

const domains = ref([
  {
    key: "chainName",
    label: `Chain${t("name")}：`,
    type: "string",
    required: false,
    disabled: true,
  },
  {
    key: "desc",
    label: `Chain${t("desc")}：`,
    type: "string",
    control: {
      type: "textarea",
    },
  },
  {
    key: "icon",
    label: `${t("chain.coverImg")}：`,
    type: "string",
    control: {
      type: "upload",
    },
  },
  {
    key: "sceneIds",
    label: `${t("chain.sceneSelection")}：`,
    type: "array",
    required: true,
    control: {
      type: "checkbox",
      options: [],
    },
  },
  {
    key: "version",
    label: `${t("chain.versionNumber")}：`,
    type: "string",
    required: true,
  },
  {
    key: "versionDesc",
    label: `${t("chain.versionDescription")}：`,
    type: "string",
    control: {
      type: "textarea",
    },
  },
]);
const groundModalVisible = ref(false);
const uploadRecordVisible = ref(false);

const groundModalOk = async () => {
  let required = true;
  for (const item of domains.value) {
    if (item.required && !item.value) {
      required = false;
      message.error(`${item.label}${t("notEmpty")}`);
      break;
    }
  }
  if (!required) {
    return;
  }
  let info = {
    chainId: paramChainId.value,
  };
  domains.value.forEach((item) => {
    info[item.key] = item.value;
  });
  const res = await services.chain.addChainTemplate(info);
  if (res.code === 0) {
    message.success(t("success", { msg: t("submit") }));
    groundModalVisible.value = false;
    domains.value.forEach((item) => {
      delete item.value;
    });
  } else {
    message.error(res.message);
  }
};

const openGroundModal = () => {
  domains.value.find((item) => item.key === "chainName").value = selectChain.value.chainName;
  groundModalVisible.value = true;
};

const openUploadRecord = () => {
  uploadRecordVisible.value = true;
  console.log(uploadRecordVisible.value);
};

// 获取场景列表
const getSceneList = async () => {
  const res = await services.chain.sceneList();
  if (res.code === 0) {
    let options = res.data.map((item) => {
      return {
        label: item.sceneName,
        value: item.id,
      };
    });
    (domains.value.find((item) => item.key === "sceneIds") || {}).control.options = options;
  }
};
getSceneList();

const disabledChain = computed(() => {
  return selectChain.value.userType == "user" && selectChain.value.userPermission !== "view";
});
// const chainId = ref(null);
const flow = computed(() => {
  const chain = selectChain.value;
  return {
    id: chain.id,
    nodes: chain.nodes || [],
    edges: chain.edges || [],
  };
});
const visible = ref(false);
const content = ref("");
const chainList = ref([]);

const paramChainId = computed(() => {
  const { chainId } = route.params;
  return chainId;
});

watch(paramChainId, async () => {
  const { chainId } = route.params;
  // console.log("chainId changed", chainId);
  const settings = await settingStore.init(chainId);
  console.log("settings", settings);
});

const fetchChainFlow = async () => {
  // Your logic to refresh the data goes here, using the `chainId` reference
  console.log("fetch.chain.flow");
  if (paramChainId.value) {
    const chain = await chainflow.get(paramChainId.value);
    console.log("chain", chain);
    flow.value = chain;
  } else {
    flow.value = {
      nodes: [],
      edges: [],
    };
  }
};

const saveFlow = async (flow) => {
  console.log("saveFlow", flow);
  localStorage.setItem("flow", JSON.stringify(flow));
  const data = selectChain.value;
  data.nodes = flow.nodes;
  data.edges = flow.edges;
  // 更新流程
  const res = await services.chain.updateChain(data);
  console.log("res", res);
  if (res.code === 0) {
    message.success(t("success", { msg: t("save") }));
  } else {
    message.error(`保存失败：${res.message}`);
  }
};

const askQuestion = (question) => {
  visible.value = true;
  const uri = "/api/chainflow/run-sse";
  // const uri = '/api/chatgpt/stream'
  fetchEventSource(uri, {
    method: "POST",
    body: JSON.stringify({
      question: question,
      chainId: paramChainId.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    onmessage(ev) {
      const data = ev.data;
      console.log("data", data);
      content.value = content.value + data;
    },
    onerror(err) {
      console.log("err", err);
    },
  })
    .then((response) => {
      console.log("response", response);
    })
    .catch((error) => {
      console.log(error);
    });
};

const debugChainNode = ({ nodeId, question }) => {
  visible.value = true;
  const uri = "/chain/api/chainflow/debug-sse";
  fetchEventSource(uri, {
    method: "POST",
    body: JSON.stringify({
      question: question,
      chainId: paramChainId.value,
      nodeId: nodeId,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    onmessage(ev) {
      const data = ev.data;
      const decoded = base64.decode(data);
      content.value = content.value + decoded;
    },
    onerror(err) {
      console.log("err", err);
    },
  })
    .then((response) => {
      console.log("response", response);
    })
    .catch((error) => {
      console.log(error);
    });
};

const onClose = () => {
  visible.value = false;
  content.value = "";
};

// Method to initialize the component with data based on the `chainId` value
const initialize = async () => {
  console.log("initialize.chainflow");
  const { chainId } = route.params;
  if (chainId) {
    await settingStore.init(chainId);
  } else {
    await serviceStore.init();
  }
};

// Call the `initialize` method when the component is mounted
initialize();

watchEffect(() => {
  // Update the `chainId` reference
  // chainId.value = route.params.chainId || null;
  // Call a method to refresh the data based on the `chainId` value
  // fetchChainFlow();
});
</script>

<style lang="scss" scoped>
.chain-body {
  height: 100vh;
  width: 100%;
  position: relative;
  z-index: 21;

  .menu {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0px 14px;
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    background-color: #fff;
    position: relative;
    z-index: 22;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);

    .chain-icon {
      width: 16px;
      height: 16px;
    }

    .title {
      padding: 0 14px;
    }

    .system {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
    }

    .ground {
      position: absolute;
      right: 30px;
      font-size: 14px;
      font-weight: 400;
      color: rgb(0, 0, 0);
      cursor: pointer;
    }

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

  .chain-flow {
    height: calc(100% - 60px);
  }
}
</style>
<style lang="scss">
.grounding {
  .ant-modal-body {
    max-height: 700px;
    overflow: auto;
  }
}

.uploadRecord {
  .ant-modal-body {
    max-height: 1000px;
    overflow: auto;
  }
}
</style>
