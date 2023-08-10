
import Flow from "./index.vue";

export default {
  title: '流程图 Flow',
  component: Flow,
  argTypes: {

  },
};

const Template = (args) => ({
  components: { Flow },
  setup() {
    return { args };
  },
  template: '<Flow v-bind="args" style="height:500px;"/>',
});

const flowItem = {
  "nodes": [
    {
      "id": "d6e0a71e-df65-411a-9778-6de3e62f56c2",
      "data": {
        "name": "开始节点",
        "status": "success"
      },
      "position": {
        "x": 160,
        "y": 60
      },
      "size": {
        "width": 180,
        "height": 40
      },
      "shape": "dag-node"
    },
    {
      "id": "6f199c4f-5d54-44b2-8f67-0ccf05d400f4",
      "data": {
        "name": "数据处理",
        "status": "success"
      },
      "position": {
        "x": 160,
        "y": 170
      },
      "size": {
        "width": 180,
        "height": 40
      },
      "shape": "dag-node"
    },
    {
      "id": "aea96b64-0a6f-4fb2-9ce3-c872deae0e1c",
      "data": {
        "name": "发送通知",
        "status": "failure"
      },
      "position": {
        "x": 160,
        "y": 280
      },
      "size": {
        "width": 180,
        "height": 40
      },
      "shape": "dag-node"
    }
  ],
  "edges": [
    {
      "shape": "next",
      "attrs": {
        "line": {
          "stroke": "#c2c8d5",
          "targetMarker": {
            "name": "block",
            "size": 8
          }
        }
      },
      "id": "2603f013-07d5-443f-9825-7b1479676b72",
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth",
        "args": {
          "radius": 4
        }
      },
      "zIndex": 0,
      "source": {
        "cell": "d6e0a71e-df65-411a-9778-6de3e62f56c2",
        "port": "bottom"
      },
      "target": {
        "cell": "6f199c4f-5d54-44b2-8f67-0ccf05d400f4",
        "port": "top"
      }
    },
    {
      "shape": "next",
      "attrs": {
        "line": {
          "stroke": "#c2c8d5",
          "targetMarker": {
            "name": "block",
            "size": 8
          }
        }
      },
      "id": "9ea96395-931c-4c98-ac93-d25cefd2bb84",
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth",
        "args": {
          "radius": 4
        }
      },
      "zIndex": 0,
      "source": {
        "cell": "6f199c4f-5d54-44b2-8f67-0ccf05d400f4",
        "port": "bottom"
      },
      "target": {
        "cell": "aea96b64-0a6f-4fb2-9ce3-c872deae0e1c",
        "port": "top"
      }
    }
  ]
}

export const FlowBasic = Template.bind({});
FlowBasic.storyName = "基础渲染"
FlowBasic.args = {
  flow: flowItem,
  minimap: false,
  toolbar: false
}

export const FlowMinimap = Template.bind({});
FlowMinimap.storyName = "渲染小地图"
FlowMinimap.args = {
  flow: flowItem,
  minimap: true,
  toolbar: false
}

export const FlowToolbar = Template.bind({});
FlowToolbar.storyName = "工具栏显示"
FlowToolbar.args = {
  flow: flowItem,
  minimap: true,
  toolbar: true
}