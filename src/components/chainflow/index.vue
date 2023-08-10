<template>
  <div class="container">
    <div class="sidebar" ref="sidebar"></div>
    <div class="flow-container">
      <div class="flow-toolbar" v-if="toolbar">
        <a-tooltip :title="`command+z`" placement="bottom">
          <a-button @click="undo" :disabled="!state.canUndo" class="op"> {{ $t("revoke") }} </a-button>
        </a-tooltip>
        <a-tooltip :title="`command+shift+z`" placement="bottom">
          <a-button @click="redo" :disabled="!state.canRedo" class="op"> {{ $t("redo") }} </a-button>
        </a-tooltip>
        <div class="divider"></div>

        <a-button type="primary" @click="saveFlow" :disabled="disabled_save">{{ $t("chain.saveFlowConfig") }}</a-button>

        <a-input
          v-model:value="question"
          style="width: 300px; margin: 0 24px"
          :placeholder="$t('pleaseEnter', { msg: $t('content') })"
          v-if="enable"
        ></a-input>

        <ConfigSetting :flow="flow" />
      </div>
      <div ref="container" style="width: 100%; height: 100%"></div>
      <div id="minimap" ref="minimap"></div>
    </div>
  </div>
</template>

<script>
import { RedoOutlined, UndoOutlined } from "@ant-design/icons-vue";
import ConfigSetting from "@/components/chainflow/ConfigSetting.vue";
// 插件能力
import { Dnd } from "@antv/x6-plugin-dnd";
import { Keyboard } from "@antv/x6-plugin-keyboard";

import "@antv/x6-vue-shape";
import { registerDAGNode } from "./node/dag-node.r";
import { registerVueComponent } from "./register.js";
import AssistMixin from "./assist.mixin.js";
import useMinimap from "@/components/chainflow/plugins/minimap.js";
import useHistory from "@/components/chainflow/plugins/history.js";

import useStencil from "@/components/chainflow/stencil/index.js";
import initGraph from "./initGraph";

import emitter from "@/components/emitter.js";
import { useServiceStore } from "@/store/modules/service";

const ENABLE_DEBUG = import.meta.env.VITE_ENABLE_DEBUG;

export default {
  components: {
    RedoOutlined,
    UndoOutlined,
    ConfigSetting,
  },
  emits: ["select-node", "save-flow", "ask-question", "debug-node", "flow-update"],
  mixins: [AssistMixin],
  props: {
    flow: {
      type: Object,
      default: () => {},
    },
    minimap: {
      type: Boolean,
      default: false,
    },
    // 是否显示默认工具栏
    toolbar: {
      type: Boolean,
      default: true,
    },
    disabledSave: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      state: {
        canRedo: false,
        canUndo: false,
      },
      question: "",
    };
  },
  computed: {
    disabled_save() {
      return this.disabledSave;
    },
    enable() {
      return ENABLE_DEBUG == "true";
    },
  },
  mounted() {
    registerVueComponent();
    registerDAGNode();
    this.init();

    emitter.on("debug-node", (nodeId) => {
      // this.debugFlowNode(nodeId, this.question);
      this.$emit("debug-node", { nodeId, question: this.question });
    });
  },
  watch: {
    flow(to, from) {
      if (to) {
        this.render();
      }
    },
  },
  methods: {
    undo() {
      this.graph.undo();
    },
    redo() {
      this.graph.redo();
    },
    render() {
      const graph = this.graph;
      const flow = this.flow || {};
      console.log("graph load", graph, flow);
      if (graph && flow.nodes) {
        graph.fromJSON(flow);
        // graph.zoomToFit({ padding: 50, minScale: 0.01, maxScale: 12, });
        graph.centerContent({ padding: 50 });
      }
    },
    askQuestion() {
      this.$emit("ask-question", this.question);
    },
    getJSON() {
      const json = this.graph.toJSON();
      console.log("json", json);
      const { cells = [] } = json;
      const flow = { nodes: [], edges: [] };
      const resolveNode = (cell) => {
        return {
          id: cell.id,
          data: cell.data,
          position: cell.position,
          size: cell.size,
          shape: cell.shape,
          ports: cell.ports || [],
        };
      };
      for (const cell of cells) {
        if (cell.connector) {
          flow.edges.push(cell);
        }
        if (cell.ports) {
          const node = resolveNode(cell);
          flow.nodes.push(node);
        }
      }
      return Object.assign(this.flow, flow);
    },
    saveFlow() {
      const flow = this.getJSON();
      this.$emit("save-flow", flow);
    },
    resolveDagNode(data) {
      const node = {
        shape: "dag-node",
        width: 180,
        height: 40,
        data: data,
        ports: [
          { id: `top`, group: "top" },
          { id: `bottom`, group: "bottom" },
        ],
      };
      return node;
    },
    startDrag(e, data = {}) {
      if (!data.name) {
        data = { name: "流程节点", status: "running" };
      }
      // const node = this.resolveDagNode(item);
      const node = this.graph.createNode(this.resolveDagNode(data));
      this.dnd.start(node, e);
    },
    async init() {
      // const graph = new Graph(options);
      const container = this.$refs.container;
      const graph = initGraph(container);
      this.graph = graph;

      // 开启小地图
      if (this.minimap) {
        const mapElem = this.$refs.minimap;
        useMinimap(graph, mapElem);
      }
      // 历史记录
      useHistory(graph);

      // 左侧菜单
      const sidebar = this.$refs.sidebar;
      // 远程组件
      // const serviceStore = useServiceStore();
      const schema = [];
      window.remoteSchema = schema;
      useStencil(graph, sidebar, schema);

      this.assist(graph);

      this.dnd = new Dnd({
        target: graph,
        scaled: false,
        animation: true,
      });

      graph.on("node:click", ({ cell, e, x, y, node, view }) => {
        console.log("node.click", node);
        // cell.removeTools();
        // 修改当前选中节点
        this.node = {
          id: node.id,
          shape: node.shape,
          data: node.getData(),
        };
        this.$emit("select-node", this.node);
        // this.node = node.getData();
        // console.log("this.node", node, this.node);
      });

      this.render();

      graph.on("history:change", () => {
        this.state.canRedo = graph.canRedo();
        this.state.canUndo = graph.canUndo();
      });

      const flowUpdate = () => {
        const flow = this.getJSON();
        this.$emit("flow-update", flow);
      };
      // https://x6.antv.antgroup.com/tutorial/basic/events
      graph.on("cell:added", ({ cell, index, options }) => {
        flowUpdate();
      });
      graph.on("cell:removed", ({ cell, index, options }) => {
        flowUpdate();
      });

      // 绑定快捷键
      graph.use(
        new Keyboard({
          enabled: true,
        })
      );
      graph.bindKey(["ctrl+z", "command+z"], () => {
        console.log("command+z");
        if (this.state.canUndo) {
          graph.undo();
        }
      });
      graph.bindKey(["ctrl+shift+z", "command+shift+z"], () => {
        if (this.state.canRedo) {
          graph.redo();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100%;

  .sidebar {
    position: relative;
    flex-basis: 200px;
  }
}

.flow-container {
  flex: 1;
  display: flex;
  flex-direction: column;

  margin: 20px auto;
  border: 1px solid #f5f5f5;
  border-radius: 1px;

  position: relative;

  #minimap {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .x6-widget-minimap-viewport,
  .x6-widget-minimap-viewport-zoom {
    border: 2px solid #1890ff;
  }
}

.flow-toolbar {
  display: flex;
  padding: 6px 12px;

  .op {
    margin-right: 5px;
    font-size: 12px;
  }

  .divider {
    border: solid #c3c3c3;
    border-width: 0 0 0 1px;
    margin: 0 10px;
  }

  .flow-node {
    display: inline-block;
    height: 32px;
    padding: 0 12px;
    font-size: 12px;
    line-height: 30px;
    text-align: center;
    border-radius: 5px;
    border: 1px solid #1890ff;
    color: #1890ff;
    cursor: pointer;

    user-select: none;
    margin-right: 16px;
  }
}
</style>
