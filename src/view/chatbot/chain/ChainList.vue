<template>
  <nav class="navbar">
    <div class="toolbar">
      <div class="btnGroup">
        <div class="addBtn" @click="addChain">
          <div class="itemLeft">
            <img class="itemIcon" :src="addIcon" />
          </div>
          <div class="itemRight">{{ $t("chain.newChain") }}</div>
        </div>
        <!-- <div class="version" @click="toVersion">
          <div class="itemLeft">
            <img class="itemIcon" :src="updateIcon" />
          </div>
          <div class="itemRight">{{ $t("chain.applicationManage") }}</div>
        </div> -->
      </div>
      <div class="search">
        <a-input
          v-model:value="searchValue"
          :placeholder="$t('pleaseEnter', { msg: 'Prompt Chain ' + $t('name') })"
        ></a-input>
      </div>
    </div>
    <div class="list">
      <ul>
        <li
          :class="{ active: chain.id === currentChain.id }"
          v-for="(chain, index) in data"
          :key="index"
          @click="selectChain(chain)"
        >
          <div class="title" v-if="chain.itemShow == 'normal'">
            <div class="itemLeft">
              <img class="itemIcon" :src="chainIcon" />
            </div>
            <div class="itemRight">
              <div>
                {{ chain.chainName }}
              </div>
              <!-- <div class="share-type">
                {{ chain.shareType }}
              </div> -->
            </div>
          </div>
          <div class="title" v-if="chain.itemShow == 'deleteShow'">
            <div class="itemLeft">
              <img class="itemIcon" :src="deleteIcon" />
            </div>
            <div class="itemRight">{{ $t("confirmDelete") }}"{{ chain.chainName || $t("chain.newChain") }}"</div>
          </div>
          <div class="title" v-if="chain.itemShow == 'editShow'">
            <div class="itemLeft">
              <img class="itemIcon" :src="chainIcon" />
            </div>
            <div class="itemRight">
              <input class="editInput" id="edit-input" type="text" v-model="chain.chainName" placeholder="" />
            </div>
          </div>
          <div class="op" v-if="chain.id === currentChain.id && chain.userType == 'user'">
            <div class="itemLeft" v-if="chain.itemShow == 'normal'">
              <template v-if="chain.userPermission == 'creator'">
                <div class="icon" @click.stop="editClick(chain.itemShow, index, 'open')">
                  <a-tooltip>
                    <template #title>{{ $t("edit") }}</template>
                    <edit-outlined style="font-size: 16px" />
                  </a-tooltip>
                </div>
                <div class="icon" @click.stop="deleteClick(chain.itemShow, index)">
                  <a-tooltip>
                    <template #title>{{ $t("delete") }}</template>
                    <delete-outlined style="font-size: 16px" />
                  </a-tooltip>
                </div>
              </template>
              <template v-else>
                <div class="icon" @click.stop="showExitConfirm(chain)">
                  <a-tooltip>
                    <template #title>{{ $t("exit") }}</template>
                    <export-outlined style="font-size: 16px" />
                  </a-tooltip>
                </div>
              </template>
            </div>
            <div class="itemLeft" v-if="chain.itemShow == 'deleteShow'">
              <div class="icon" @click.stop="getChainBotList(index)">
                <a-tooltip>
                  <template #title>{{ $t("save") }}</template>
                  <check-outlined style="font-size: 14px" />
                </a-tooltip>
              </div>
              <div class="icon" @click.stop="deleteClick(chain.itemShow, index)">
                <a-tooltip>
                  <template #title>{{ $t("cancel") }}</template>
                  <close-outlined style="font-size: 14px" />
                </a-tooltip>
              </div>
            </div>
            <div class="itemLeft" v-if="chain.itemShow == 'editShow'">
              <div class="icon" @click.stop="editClick(chain.itemShow, index, 'ok')">
                <a-tooltip>
                  <template #title>{{ $t("save") }}</template>
                  <check-outlined style="font-size: 14px" />
                </a-tooltip>
              </div>
              <div class="icon" @click.stop="editClick(chain.itemShow, index, 'close')">
                <a-tooltip>
                  <template #title>{{ $t("cancel") }}</template>
                  <close-outlined style="font-size: 14px" />
                </a-tooltip>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <!-- <div class="moreDiv" v-if="chainList.length > 0 && pageIndex < totalPage && totalPage != 0">
        <div class="moreBtn" @click="moreClick">加载更多</div>
      </div> -->
    </div>
    <pop></pop>
  </nav>
  <a-modal v-model:visible="visible" title="新建Prompt Chain">
    <template #footer>
      <a-button key="cancel" @click="handleCancel">{{ $t("cancel") }}</a-button>
      <a-button key="submit" type="primary" :confirm-loading="confirmLoading" @click="onOk">{{
        $t("create")
      }}</a-button>
    </template>
    <a-form ref="modalFormRef" :model="modalFormState" layout="vertical" name="userForm">
      <a-form-item
        name="chainName"
        :label="`Prompt Chain ${$t('name')}`"
        :rules="[{ required: true, message: $t('pleaseEnter', { msg: 'Prompt Chain ' + $t('name') }) }]"
      >
        <a-input v-model:value="modalFormState.chainName" :placeholder="$t('pleaseEnter', { msg: 'Prompt Chain ' + $t('name') })" />
      </a-form-item>
      <!-- <a-form-item name="useKnowledge" label="是否使用文件夹管理" :rules="[{ required: true, message: '请选择是否使用文件夹管理' }]">
        <a-switch v-model:checked="modalFormState.useKnowledge" /> </a-form-item>
      <a-form-item name="isPublic" label="是否公开" :rules="[{ required: true, message: '请选择是否公开' }]">
        <a-switch v-model:checked="modalFormState.isPublic" />
      </a-form-item> -->
    </a-form>
  </a-modal>
  <a-modal v-model:visible="visibleVersion" class="versionModel" width="90%" title="申请管理" @ok="onVersionOk">
    <div class="versionModelSearch">
      <a-input-search
        v-model:value="searchChainValue"
        placeholder="搜索chain名称"
        style="width: 200px; margin-right: 0px"
      />
      <div style="margin-left: 10px; display: flex">
        <div style="margin-right: 10px; font-color: 12px">审批状态:</div>
        <a-radio-group v-model:value="approveStatusValue" size="small" @change="initTableData">
          <a-radio-button value="全部">全部</a-radio-button>
          <a-radio-button value="待审批">待审批</a-radio-button>
          <a-radio-button value="已通过">已通过</a-radio-button>
          <a-radio-button value="已驳回">已驳回</a-radio-button>
        </a-radio-group>
      </div>
      <div style="margin-left: 10px; display: flex" v-if="approveStatusValue != '待审批'">
        <div style="margin-right: 10px; font-color: 12px">上架状态:</div>
        <a-radio-group v-model:value="chainTemplateStatusValue" size="small" @change="initTableData">
          <a-radio-button value="全部">全部</a-radio-button>
          <a-radio-button value="上架">上架</a-radio-button>
          <a-radio-button value="下架">下架</a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <a-table :columns="tableColumns" :data-source="chainTableData" size="small">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'icon'">
          <span>
            <img v-if="record.icon && record.icon != ''" style="width: 30px; height: 30px" :src="record.icon" />
          </span>
        </template>
        <template v-if="column.key == 'scene'">
          <span>
            <a-tag
              v-for="tag in record.scene"
              :key="tag"
              :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
            >
              {{ tag.sceneName }}
            </a-tag>
          </span>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <div v-if="record.key && record.key != ''">
            <a-button
              v-if="record.chainTemplateInfoId != 0"
              type="link"
              @click="onInfoOffShelf(record.chainTemplateInfoId)"
              style="padding: 0"
              >下架市场</a-button
            >
          </div>
          <div v-else>
            <a-popconfirm
              v-if="record.chainTemplateStatus == '上架'"
              title="确认下架?"
              @confirm="onOffShelf(record.id)"
            >
              <a-button style="padding: 0; margin-right: 10px" type="link" v-if="!disabled" danger>下架</a-button>
            </a-popconfirm>
            <a-button
              type="link"
              v-if="record.chainTemplateStatus == '下架' && record.approveStatus != '待审批'"
              @click="onShelf(record)"
              style="padding: 0"
              >重新上架</a-button
            >
          </div>
        </template>
      </template>
    </a-table>
  </a-modal>
  <a-modal
    v-model:visible="groundModalVisible"
    :title="$t('chain.applyListing')"
    cancel-text="取消"
    ok-text="提交"
    class="groundingModal"
    @ok="groundModalOk"
  >
    <TrendsForm :formDomains="domains" ref="trendsForm"></TrendsForm>
  </a-modal>
  <a-modal
    v-model:visible="chainBotVisible"
    title="提示"
    @ok="deleteChain(deleteChainIndex)"
    @cancel="deleteChainCancel"
  >
    <p>{{ chainbotTip }}</p>
  </a-modal>
</template>

<script setup>
import { computed, ref, reactive, nextTick, createVNode,inject } from "vue";
import { useChainStore } from "@/store/modules/chain.js";
import { useDialogStore } from "@/store/modules/dialog";
import { useLoginStore } from "@/store/modules/user.js";
import addIcon from "@/assets/add.png";
import updateIcon from "@/assets/updateIcon.png";
import chainIcon from "@/assets/chain/chain.png";
import deleteIcon from "@/assets/deleteIcon.png";
import { useRouter, useRoute } from "vue-router";
import services from "@/services/index";
import { storeToRefs } from "pinia";
import pop from "../Pop.vue";
import { ymPoint } from "@/utils/point.js";
import { message } from "ant-design-vue";
import TrendsForm from "@/components/trends-form/index.vue";
import { Modal } from "ant-design-vue";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";

const t = inject("$i18nT");
const chainStore = useChainStore();
const dialogStore = useDialogStore();
const loginStore = useLoginStore();
const { chainList } = storeToRefs(chainStore);
const { userInfo } = storeToRefs(loginStore);

const approveStatusValue = ref("全部");
const chainTemplateStatusValue = ref("全部");
const router = useRouter();
const route = useRoute();
const { chainId } = route.params;
let oldName = ""; //当前选中chain名称
let count;
let allData;
// let pageData;
// let pageIndex = 1;
// let totalPage = 1;
// const pageSize = 20;

const searchValue = ref("");
const searchChainValue = ref("");
const trendsForm = ref();
// 模糊搜索
const inputMatch = (text = "") => {
  let a = searchValue.value || "";
  let str = ["", ...a, ""].join(".*"); //转化成正则格式的字符串
  let reg = new RegExp(str); //正则
  return reg.test(text || ""); //去匹配待查询的字符串
};

const inputMatchChain = (text = "") => {
  let a = searchChainValue.value || "";
  let str = ["", ...a, ""].join(".*"); //转化成正则格式的字符串
  let reg = new RegExp(str); //正则
  return reg.test(text || ""); //去匹配待查询的字符串
};

const data = computed(() => {
  return chainList.value
    .map((item) => {
      item.key = item.id;
      return item;
    })
    .filter((item) => inputMatch(item.chainName));
});

const chainTableData = computed(() => {
  return tableData.value.filter((item) => inputMatchChain(item.chainName));
});
// 新增chain相关
const visible = ref(false);

//版本管理
const visibleVersion = ref(false);
const groundModalVisible = ref(false);
const domains = ref([
  {
    key: "chainName",
    label: "Chain名称：",
    type: "string",
    required: false,
    disabled: true,
  },
  {
    key: "desc",
    label: "Chain描述：",
    type: "string",
    control: {
      type: "textarea",
    },
  },
  {
    key: "icon",
    label: "封面图：",
    type: "string",
    control: {
      type: "upload",
    },
  },
  {
    key: "sceneIds",
    label: "场景选择：",
    type: "array",
    required: true,
    control: {
      type: "checkbox",
      options: [],
    },
  },
  {
    key: "version",
    label: "版本号：",
    type: "string",
    disabled: true,
    required: true,
  },
  {
    key: "versionDesc",
    label: "版本描述：",
    type: "string",
    control: {
      type: "textarea",
    },
  },
]);

const modalFormState = reactive({
  chainName: "",
  useKnowledge: false,
  isPublic: false,
});
const modalFormRef = ref();
const confirmLoading = ref(false);
const onOk = () => {
  confirmLoading.value = true;
  modalFormRef.value.validateFields().then(() => {
    services.chain
      .addChain(modalFormState.chainName, modalFormState.isPublic, modalFormState.useKnowledge ? 1 : 0)
      .then((res) => {
        confirmLoading.value = false;
        if (res.code === 0) {
          message.success(t("success", { msg: t("add") }));
          visible.value = false;
          let resData = res.data;
          resData.itemShow = "normal";
          resData.shareOpen = false;
          resData.userPermission = "creator";
          //allData.unshift(Resdata);
          //chainStore.setChainList(allData);
          chainStore.addChain(resData);
          selectChain(chainStore.getChainByID(resData.id));
          // chainListInit();
        } else {
          message.warning(res.message ? res.message : "新增chain失败");
        }
        visible.value = false;
      });
  });
};

const handleCancel = () => {
  visible.value = false;
  confirmLoading.value = false;
};

// 查询chain列表
const chainListInit = async () => {
  try {
    const res = await services.chain.chainList();
    console.log("res", res);
    if (res.code === 0) {
      if (res.data) {
        res.data.map((item) => {
          item.itemShow = "normal";
        });
        allData = res.data;
        // pageData = res.data.slice(0, 20);
        chainStore.setChainList(allData);
        count = res.data.length;
        if (!chainId && allData.length > 0) {
          chainStore.setSelectChain(chainStore.getChainByID(allData[0].id));
          router.push({ name: "chain", params: { chainId: allData[0].id } });
        } else {
          chainStore.setSelectChain(chainStore.getChainByID(chainId));
        }
        return res.data;
      } else {
        chainStore.setChainList([]);
        return [];
      }
    } else {
      console.log("rs", res);
      message.warning(res.message ? res.message : "查询chain列表接口请求失败");
    }
  } catch (error) {
    console.log(error);
    message.warning("查询chain列表接口调用失败");
  }
};
//初始化调用查询列表
chainListInit();

// 获取当前选中的chain
const currentChain = computed(() => {
  return chainStore.selectChain ? chainStore.selectChain : chainList.filter((item) => item.id == chainId)[0];
});

// 切换选中的chain
const selectChain = async (chain) => {
  chainStore.setSelectChain(chain);
  router.replace({
    name: "chain",
    params: {
      chainId: chain.id,
    },
  });
  emit("selectChat");
};
const emit = defineEmits(["selectChat"]);

// 添加chain
const addChain = () => {
  // const chain = { 'id': new Date().getTime(), 'itemShow': 'normal' }
  // chainStore.addChain(chain)
  modalFormState.chainName = "";
  dialogStore.setLastDialogId("ROOT");
  try {
    ymPoint("chat_click_list_add", "chain列表点击新增");
  } catch (error) {
    console.log("埋点", error);
  }
  chainStore.setSelectChain({});
  router.replace({
    name: "chain",
    params: {
      chainId: "",
    },
  });
  emit("selectChat");
  visible.value = true;
};
const showExitConfirm = (chain) => {
  console.log("chain", chain);
  Modal.confirm({
    title: `确认退出chain"${chain.chainName}"?`,
    icon: createVNode(ExclamationCircleOutlined),
    content: "退出后需要创建人重新邀请才能查看该chain",
    okText: "确认",
    okType: "danger",
    cancelText: "取消",
    onOk() {
      outClick(chain);
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

const outClick = async (chain) => {
  let res = await services.share.deleteChainBotUserRelation(chain.id, "chain", userInfo.value.id);
  if (res.code === 0) {
    message.success(t("success", { msg: t("exit") }));
    chainListInit();
  } else {
    message.warning(res.message || t("fail", { msg: t("exit") }));
  }
};
//版本管理
const toVersion = () => {
  initTableData();
  visibleVersion.value = true;
};

const onVersionOk = () => {
  visibleVersion.value = false;
};

const tableColumns = [
  {
    title: "chain名称",
    dataIndex: "chainName",
    key: "chainName",
  },
  {
    title: "封面图",
    dataIndex: "icon",
    key: "icon",
  },
  {
    title: "版本号",
    dataIndex: "version",
    key: "version",
  },
  {
    title: "版本描述",
    dataIndex: "versionDesc",
    key: "versionDesc",
    ellipsis: true,
  },
  {
    title: "所属场景",
    dataIndex: "scene",
    key: "scene",
  },
  {
    title: "审批状态",
    dataIndex: "approveStatus",
    key: "approveStatus",
  },
  {
    title: "上架状态",
    dataIndex: "chainTemplateStatus",
    key: "chainTemplateStatus",
    customRender: (info) => {
      let res = "";
      if (info.record.approveStatus && info.record.approveStatus == "已通过") {
        res = info.record.chainTemplateStatus;
      }
      return res;
    },
  },
  {
    title: "操作",
    dataIndex: "operation",
  },
];
const tableData = ref([]);

const initTableData = () => {
  if (approveStatusValue.value == "待审批") {
    chainTemplateStatusValue.value = "全部";
  }
  services.chain
    .chainTree({
      approveStatusValue: approveStatusValue.value,
      chainTemplateStatusValue: chainTemplateStatusValue.value,
    })
    .then((res) => {
      if (res.code === 0) {
        if (res.data && res.data.length > 0) {
          tableData.value = [];
          res.data.map((item) => {
            item["key"] = item.chainId;
            console.log(item);
            if (item.children && item.children.length > 0) {
              let children = [];
              item.children.map((child) => {
                let scene = child.scene;
                child.chainTemplate["scene"] = scene;
                children.push(child.chainTemplate);
                return child.chainTemplate;
              });
              item.children = children;
            }
            console.log("--", item);
            tableData.value.push(item);
            return item;
          });
          console.log("tableData", tableData.value);
        } else {
          tableData.value = [];
        }
        console.log("====tableData===", tableData.value);
      } else {
        message.warning(res.message ? res.message : "查询chain列表接口请求失败");
      }
    });
};

const chainBotVisible = ref(false);
const chainbotTip = ref("");
const deleteChainIndex = ref(0);
const deleteChainCancel = () => {
  data.value[deleteChainIndex.value].itemShow = "normal";
};
//删除方法
const getChainBotList = async (index) => {
  //查询chain关联的bot
  deleteChainIndex.value = index;
  let botList = await services.chain.chainBotList(data.value[index].id);
  let botTip = "";
  if (botList.data != null && botList.data.length > 0) {
    botTip += "您这个Chain,已经关联了 Bot: ";
    botList.data.map((item) => {
      botTip += item.botName + "、";
      return item;
    });
    botTip += "如果删除Chain以后，Bot将会同步被删除， 确认删除吗？ ";
    chainBotVisible.value = true;
    chainbotTip.value = botTip;
  } else {
    deleteChain(index);
  }
  return;
};
const deleteChain = async (index) => {
  chainBotVisible.value = false;
  try {
    ymPoint("chat_click_delete", "确认删除chain");
  } catch (error) {
    console.log("埋点", error);
  }
  try {
    const res = await services.chain.deleteChain(data.value[index].id);
    if (res.code === 0) {
      let chainIndex = chainList.value.findIndex((item) => item.id == data.value[index].id);
      chainStore.deleteChain(chainIndex);
      message.success(t("success", { msg: t("delete") }));
      router.replace({
        name: "chain",
        params: {
          chainId: "",
        },
      });
      return res.data;
    } else {
      message.warning(res.message ? res.message : t("fail", { msg: t("delete") }));
    }
  } catch (error) {
    console.log(error);
    message.warning("删除chain接口调用失败");
  }
};

//确认删除开关
const deleteClick = (itemShow, index) => {
  if (itemShow == "normal" || itemShow == undefined) {
    try {
      ymPoint("chat_click_confirm_delete", "提示删除chain");
    } catch (error) {
      console.log("埋点", error);
    }
    chainList.value.map((item) => {
      item.itemShow = "normal";
    });
    data.value[index].itemShow = "deleteShow";
  } else {
    try {
      ymPoint("chat_click_close_confirm_delete", "关闭提示删除chain");
    } catch (error) {
      console.log("埋点", error);
    }
    data.value[index].itemShow = "normal";
  }
};

//修改事件
const editClick = (itemShow, index, status) => {
  if (itemShow == "normal" || itemShow == undefined) {
    try {
      ymPoint("chat_click_confirm_update", "提示修改chain");
    } catch (error) {
      console.log("埋点", error);
    }
    chainList.value.map((item) => {
      item.itemShow = "normal";
    });
    data.value[index].itemShow = "editShow";
    nextTick(() => {
      document.getElementById("edit-input")?.focus();
    });
  } else {
    try {
      ymPoint("chat_click_close_confirm_update", "关闭提示修改chain");
    } catch (error) {
      console.log("埋点", error);
    }
    data.value[index].itemShow = "normal";
  }

  if (status == "close") {
    data.value[index].chainName = oldName;
  } else if (status == "open") {
    oldName = data.value[index].chainName;
  } else if (status == "ok") {
    if (data.value[index].chainName && data.value[index].chainName != "") {
      const updateChat = async () => {
        try {
          ymPoint("chat_click_update", "修改chain名称");
        } catch (error) {
          console.log("埋点", error);
        }
        try {
          const res = await services.chain.updateChainName(data.value[index].chainName, data.value[index].id);
          if (res.code === 0) {
            oldName = "";
            message.success(t("success", { msg: t("modify") }));
            return res.data;
          } else {
            data.value[index].chainName = oldName;
            message.warning(res.message ? res.message : "修改chain接口请求失败");
          }
        } catch (error) {
          message.warning("修改chain接口调用失败");
        }
      };
      updateChat();
    } else {
      // chainList.value[index].name = oldName;
      data.value[index].itemShow = "editShow";
      message.warning("chain名称不可为空");
    }
  } else {
    oldName = "";
  }
};

//点击加载更多
const moreClick = () => {
  try {
    ymPoint("chat_click_more_chatlist", "点击加载更多chain");
  } catch (error) {
    console.log("埋点", error);
  }
  pageIndex++;
  pageData = allData.slice(0, pageIndex * pageSize);
  chainStore.setChainList(pageData);
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
//重新上架
const onShelf = (chainTemplate) => {
  //关闭申请管理
  visibleVersion.value = false;
  //打开重新上架
  groundModalVisible.value = true;
  //设置上架表单信息
  domains.value[0].value = chainTemplate.chainTemplateName;
  domains.value[1].value = chainTemplate.desc;
  domains.value[2].value = chainTemplate.icon;
  let sceneIds = [];
  chainTemplate.scene.map((item) => {
    sceneIds.push(item.id);
    return item;
  });
  domains.value[3].value = sceneIds;
  domains.value[4].value = chainTemplate.version;
  domains.value[5].value = chainTemplate.versionDesc;

  paramChainId.value = chainTemplate.id;
};

//下架
const onOffShelf = async (chainTemplateId) => {
  try {
    ymPoint("chain_click_offShelf", "chain下架");
  } catch (error) {
    console.log("埋点", error);
  }
  try {
    services.chainTemplate.OffShelf(chainTemplateId).then((res) => {
      if (res.code === 0) {
        message.success(t("success", { msg: t("offShelf") }));
        initTableData();
      } else {
        message.warning(res.message ? res.message : "下架接口请求失败");
      }
    });
  } catch (error) {
    message.warning("下架接口调用失败");
  }
};
//onInfoOffShelf
const onInfoOffShelf = async (chainTemplateInfoId) => {
  try {
    ymPoint("chainTemplateInfo_click_offShelf", "市场下架");
  } catch (error) {
    console.log("埋点", error);
  }
  try {
    services.chainTemplateInfo.OffShelf(chainTemplateInfoId).then((res) => {
      if (res.code === 0) {
        message.success(t("success", { msg: t("offShelf") }));
        initTableData();
      } else {
        message.warning(res.message ? res.message : "下架接口请求失败");
      }
    });
  } catch (error) {
    message.warning("下架接口调用失败");
  }
};
const paramChainId = ref("");
const groundModalOk = async () => {
  let required = true;
  for (const item of domains.value) {
    if (item.required && !item.value) {
      required = false;
      message.error(`${item.label}${t('notEmpty')}`);
      break;
    }
  }
  if (!required) {
    return;
  }
  let info = {
    chainTemplateId: paramChainId.value,
  };
  domains.value.forEach((item) => {
    info[item.key] = item.value;
  });
  const res = await services.chainTemplate.ReShelf(info);
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
</script>

<style lang="scss" scoped>
.navbar {
  width: calc(100% - 70px);
  padding: 8px;
  height: 100vh;
  position: relative;

  .list {
    margin-top: 98px;
    height: calc(100% - 160px);
    overflow: auto;
    padding-bottom: 30px;

    //滚动条样式处理
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.2);
    }

    &::-webkit-scrollbar-track {
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}

.moreBtn {
  width: auto;
  height: auto;
  padding: 4px 8px;
  background-color: rgba(52, 53, 65, 1);
  color: rgba(255, 255, 255);
  border-radius: 4px;
  font-size: 0.875rem;
  border: 1px solid rgba(86, 88, 105);
}

.moreDiv {
  width: 100%;
  height: 50px;
  align-items: center;
  display: flex;
  position: relative;
  justify-content: center;
}

.moreBtn:hover {
  background-color: rgba(64, 65, 79);
}

.editInput {
  color: #fff;
  background-color: rgba(32, 33, 35);
  border: 1px #2d3b75 solid;
  height: 22px;
  width: 100%;

  &:focus-visible {
    outline: none !important;
  }
}

.toolbar {
  position: absolute;
  background: rgba(32, 33, 35);
  top: 0px;
  padding-top: 8px;
  z-index: 2;
  width: calc(100% - 16px);
  height: 100px;
}

.addBtn {
  width: 100%;
  background: rgba(32, 33, 35);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 6px;
  padding: 12px;
  align-items: center;
  display: flex;
  height: 42px;
  position: relative;
  cursor: pointer;
}
.version {
  width: 50%;
  background: rgba(32, 33, 35);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 6px;
  padding: 12px;
  align-items: center;
  display: flex;
  height: 42px;
  margin-left: 10px;
  position: relative;
  cursor: pointer;
}

.addBtn:hover {
  background: hsla(240, 9%, 59%, 0.1);
}

.search {
  margin-top: 10px;
  height: 42px;

  input {
    background-color: rgba(42, 43, 50);
    color: #fff;
    border-radius: 4px;
  }
}

li:hover {
  background: rgba(42, 43, 50);
}

.itemLeft {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  position: relative;
  width: auto;
  margin-right: 8px;

  .icon {
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.7);

    &:hover {
      color: rgba(255, 255, 255, 1);
    }
  }
}

.itemRight {
  width: auto;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  .share-type {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
}

.itemIcon,
.updateIcon,
.deleteIcon {
  width: 16px;
  height: 16px;
}

.deleteIcon2 {
  width: 14px;
  height: 14px;
}

.updateIcon {
  margin-right: 8px;
}

li div.active {
  background-color: rgba(52, 53, 65, 1);
}

ul,
li {
  list-style: none;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
}

li {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-radius: 5px;
  position: relative;

  .title {
    width: 80%;
    color: #fff;
    display: flex;
    padding: 12px;
    align-items: center;
    display: flex;
    height: 100%;
    position: relative;
  }

  .op {
    width: fit-content;
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    z-index: 11;
  }

  i {
    cursor: pointer;
  }
}

li.active {
  background-color: rgba(52, 53, 65, 1);
}

.btnGroup {
  display: flex;
}
</style>
<style lang="scss">
.versionModel {
  height: calc(100vh - 200px);
  .versionModelSearch {
    position: fixed;
    z-index: 9999;
    background: #fff;
    height: 72px;
    width: calc(90% - 48px);
    padding-top: 24px;
    display: flex;
    align-content: center;
    flex-direction: row;
    align-items: center;
  }
  .ant-modal-content {
    height: 100%;
  }
  .ant-modal-body {
    height: calc(100% - 100px);
    max-height: 100%;
    overflow: auto;
    background-color: #fff;
    padding-top: 0;
  }
  .ant-table {
    margin-top: 72px;
  }
}
.groundingModal {
  height: calc(100vh - 200px);
  .ant-modal-content {
    height: 100%;
  }
  .ant-modal-body {
    height: calc(100% - 100px);
    max-height: 100%;
    overflow: auto;
  }
}
</style>
