<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <el-popover placement="right-start" trigger="hover" v-model="visible" width="auto">
        <div class="add-node-popover-body">
          <a class="add-node-popover-item approver" @click="addType(1)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>审批人</p>
          </a>
          <a class="add-node-popover-item notifier" @click="addType(2)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>抄送人</p>
          </a>
          <a class="add-node-popover-item condition" @click="addType(4)">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>条件分支</p>
          </a>
        </div>
        <template #reference>
          <button class="btn" type="button">
            <span class="iconfont"></span>
          </button>
        </template>
      </el-popover>
    </div>
  </div>
</template>
<script setup>
import { ref, inject } from "vue";
import { TYPES } from "./common"
import map from "./model/index";

const nodes = inject('nodes');
const appendNode = inject('appendNode');
const appendNodes = inject('appendNodes')

let props = defineProps({
  childNodeP: {
    type: Object,
    default: () => { },
  },
  node: {
    type: Object,
    default: () => { },
  }
});

let visible = ref(false);

const addType = (type) => {
  // Next 节点 ID
  const nodeId = nodes.value.length;
  // console.log("add.id", nodes.value, nodes.value.length)
  const def = JSON.parse(JSON.stringify(map[type].default)); // 读取定义的默认值
  // console.log('def', def);

  console.log("Prev 节点", props.node.id);
  console.log("当前节点", nodeId, "Next 节点", props.childNodeP ? props.childNodeP.id : 0)

  if (type == TYPES.ROUTE) {
    const routeNode = Object.assign(def, {
      id: nodeId,
      next: props.childNodeP ? props.childNodeP.id : 0,
      conditions: [nodeId + 1, nodeId + 2]
    })
    const cNode1 = {
      id: nodeId + 1,
      type: TYPES.CONDITION,
      name: "条件 1",
      props: {},
      next: 0,
    }
    const cNode2 = {
      id: nodeId + 2,
      type: TYPES.CONDITION,
      name: "条件 2",
      props: {},
      next: 0,
    }
    appendNodes([routeNode, cNode1, cNode2]);
    props.node.next = nodeId;
  } else {
    const data = Object.assign(def, {
      id: nodeId,
      next: props.childNodeP ? props.childNodeP.id : 0
    })
    appendNode(data);
    // 修改 prev.next = current
    props.node.next = nodeId;
  }

  visible.value = false;
};
</script>
<style scoped lang="scss">
.add-node-btn-box {
  width: 240px;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    margin: auto;
    width: 2px;
    height: 100%;
    background-color: #cacaca;
  }

  .add-node-btn {
    user-select: none;
    width: 240px;
    padding: 20px 0 32px;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    flex-shrink: 0;
    -webkit-box-flex: 1;
    flex-grow: 1;

    .btn {
      outline: none;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      width: 30px;
      height: 30px;
      background: #3296fa;
      border-radius: 50%;
      position: relative;
      border: none;
      line-height: 30px;
      -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

      .iconfont {
        color: #fff;
        font-size: 16px;
      }

      &:hover {
        transform: scale(1.3);
        box-shadow: 0 13px 27px 0 rgba(0, 0, 0, 0.1);
      }

      &:active {
        transform: none;
        background: #1e83e9;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.add-node-popover-body {
  max-width: 336px;
  display: flex;
  flex-wrap: wrap;

  .add-node-popover-item {
    margin-right: 10px;
    cursor: pointer;
    text-align: center;
    color: #191f25 !important;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    margin-right: 8px;
    margin-bottom: 8px;
    width: 160px;
    background: rgba(17, 31, 44, 0.02);
    padding: 8px;
    border: 1px solid #ffffff;
    border-radius: 4px;

    .item-wrapper {
      user-select: none;
      display: inline-block;
      width: 40px;
      height: 40px;
      margin-right: 12px;
      margin-bottom: 5px;
      background: #fff;
      border: 1px solid #e2e2e2;
      border-radius: 50%;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

      .iconfont {
        font-size: 20px;
        line-height: 40px;
      }
    }

    &.approver {
      .item-wrapper {
        color: #ff943e;
      }
    }

    &.notifier {
      .item-wrapper {
        color: #3296fa;
      }
    }

    &.condition {
      .item-wrapper {
        color: #15bc83;
      }
    }

    &:hover {
      .item-wrapper {
        background: #3296fa;
        box-shadow: 0 10px 20px 0 rgba(50, 150, 250, 0.4);
      }

      .iconfont {
        color: #fff;
      }
    }

    &:active {
      .item-wrapper {
        box-shadow: none;
        background: #eaeaea;
      }

      .iconfont {
        color: inherit;
      }
    }
  }
}
</style>
