import FlowNode from "./node/FlowNode.vue";
import MenuNode from "./node/MenuNode.vue";
import { register, getTeleport } from "@antv/x6-vue-shape"

window.registered = window.registered || {}

const hash = {
  'flow-node': FlowNode,
  'menu-node': MenuNode
}

export const registerVueComponent = () => {
  // const type = 'flow-node';
  const types = ['flow-node', 'menu-node'];
  for (const type of types) {
    if (window.registered[type]) {
      return;
    }
    console.log("graph 注册 vue 组件", type);

    register({
      shape: type,
      component: hash[type]
    })
    window.registered[type] = true;
  }
}

export default {
  registerVueComponent
}