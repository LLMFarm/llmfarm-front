<template>
  <div :class="className">
    <img src="https://hextools.oss-cn-beijing.aliyuncs.com/icon/graph/logo.png" alt="" />
    <span class="label">{{ item.name }}</span>
    <span class="status">
      <img :src="icon" alt="" />
    </span>
  </div>
</template>
<script>
const imageDir = "https://hextools.oss-cn-beijing.aliyuncs.com/icon/graph/";
export default {
  name: "dag-node",
  inject: ["getGraph", "getNode"],
  emits: ["handle"],
  props: {},
  data() {
    return {
      item: {},
    };
  },
  mounted() {
    const node = this.getNode();
    const data = node.getData() || {};
    this.item = data || {};
    // 监听数据改变事件
    node.on("change:data", ({ }) => { });
  },
  computed: {
    className() {
      const status = this.item.status || "success";
      return `node ${status}`;
    },
    icon() {
      const status = this.item.status || "success";
      return imageDir + `${status}.png`;
    },
  },
  methods: {
    click() {
      this.$emit("handle", this.item);
    },
  },
};
</script>

<style lang="scss" scoped>
.node {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #c2c8d5;
  border-left: 4px solid #5f95ff;
  border-radius: 4px;
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
}

.node img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-left: 8px;
}

.node .label {
  display: inline-block;
  flex-shrink: 0;
  width: 104px;
  margin-left: 8px;
  color: #666;
  font-size: 12px;
}

.node .status {
  flex-shrink: 0;
}

.node.success {
  border-left: 4px solid #52c41a;
}

.node.failure {
  border-left: 4px solid #ff4d4f;
}

.node.running .status img {
  animation: spin 1s linear infinite;
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
