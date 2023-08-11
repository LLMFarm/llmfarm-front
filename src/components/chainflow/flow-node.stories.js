
import Flow from "./index.vue";

export default {
  title: 'Flow/节点',
  component: Flow,
  argTypes: {

  },
};

const Template = (args) => ({
  components: { Flow },
  setup() {
    return { args };
  },
  template: '<Flow v-bind="args" style="height:100%;"/>',
});

const circle = { r: 6, magnet: true, style: { stroke: "#52c41a" } }
export const FlowBasic = Template.bind({});
FlowBasic.storyName = "FlowNode"
FlowBasic.args = {
  flow: {
    "nodes": [
      {
        "id": "d6e0a71e-df65-411a-9778-6de3e62f56c2",
        "data": {
          "type": "ChatOpenAI",
          "title": "ChatOpenAI 调用",
          "desc": "Wrapper around OpenAI Chat large language models.",
          "value": {
            "modelName": "gpt-3.5-turbo"
          }
        },
        "position": { "x": 160, "y": 60 },
        "size": {
          "width": 300,
        },
        "shape": "flow-node",
        "ports": {
          items: [
            {
              group: "response",
              id: "response",
              attrs: {
                circle: circle
              }
            },
            {
              group: "modelName",
              id: 'modelName',
              attrs: {
                circle: circle
              },
            }
          ],
          groups: {
            modelName: {
              position: {
                name: 'left',
                args: {
                  dy: 320
                }
              },
            },
            response: {
              position: {
                name: "right",
                args: {
                  dy: 380
                }
              }
            },
          },
        },
      },
      {
        "position": {
          "x": 480,
          "y": 30
        },
        "size": {
          "width": 300,
        },
        "view": "vue-shape-view",
        "shape": "flow-node",
        "id": "29861fcc-da7a-4070-b57b-d9c63e97675f",
        "data": {
          "type": "VectorSearch",
          "title": "VectorSearch",
          "desc": "根据向量从向量数据库中查询相关向量",
          "value": {}
        },
        "ports": {
          "items": [
            {
              "group": "vector",
              "id": "vector",
              "attrs": {
                "circle": {
                  "r": 6,
                  "magnet": true,
                  "style": {
                    "stroke": "#52c41a"
                  }
                }
              }
            },
            {
              "group": "k",
              "id": "k",
              "attrs": {
                "circle": {
                  "r": 6,
                  "magnet": true,
                  "style": {
                    "stroke": "#52c41a"
                  }
                }
              }
            },
            {
              "group": "similarVectors",
              "id": "similarVectors",
              "attrs": {
                "circle": {
                  "r": 6,
                  "magnet": true,
                  "style": {
                    "stroke": "#52c41a"
                  }
                }
              }
            }
          ],
          "groups": {
            "vector": {
              "position": {
                "name": "left",
                "args": {
                  "dy": 160
                }
              }
            },
            "k": {
              "position": {
                "name": "left",
                "args": {
                  "dy": 320
                }
              }
            },
            "similarVectors": {
              "position": {
                "name": "right",
                "args": {
                  "dy": 380
                }
              }
            }
          }
        },
        "zIndex": 2
      }
    ],
    edges: []
  },
  minimap: true,
  toolbar: true
}