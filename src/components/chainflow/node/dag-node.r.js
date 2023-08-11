import DagNode from './dag-node.vue'
import { Graph } from "@antv/x6";
import { register, getTeleport } from "@antv/x6-vue-shape"

window.registered = window.registered || {}

const circle = {
  r: 4,
  magnet: true,
  stroke: '#C2C8D5',
  strokeWidth: 1,
  fill: '#fff',
}

export const registerDAGNode = () => {
  const shape = 'dag-node';
  if (window.registered[shape]) {
    return;
  }

  console.log("registerDAGNode", shape);
  register({
    inherit: "vue-shape",
    shape: shape,
    component: {
      template: `<DagNode :name="name" @handle="handle" />`,
      data() {
        return {};
      },
      methods: {
        handle(item) {
          console.log('handle.item', item);
        }
      },
      components: {
        DagNode,
      },
    },
    ports: {
      items: [
        {
          id: "top",
          group: "top",
          attrs: {
            circle: circle,
          },
        },
        {
          id: "bottom",
          group: "bottom",
          attrs: {
            circle: circle,
          },
        }
      ],
      groups: {
        top: { position: { name: "top" } },
        bottom: { position: { name: "bottom" } },
      },
    },
    // 删除工具
    // tools: [{
    //   name: 'button-remove',
    //   args: {
    //     attrs: { fill: '#7c68fc', stroke: '#333' },
    //     x: '100%',
    //     y: 0,
    //     offset: { x: 0, y: 0 }
    //   }
    // }],
  })

  Graph.registerConnector(
    'algo-connector',
    (s, e) => {
      const offset = 4
      const deltaY = Math.abs(e.y - s.y)
      const control = Math.floor((deltaY / 3) * 2)

      const v1 = { x: s.x, y: s.y + offset + control }
      const v2 = { x: e.x, y: e.y - offset - control }

      return Path.normalize(
        `M ${s.x} ${s.y}
         L ${s.x} ${s.y + offset}
         C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
         L ${e.x} ${e.y}
        `,
      )
    },
    true,
  )

  Graph.registerEdge('next', {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: "#c2c8d5",
        strokeWidth: 2,
        targetMarker: { name: "block", size: 8 },
      },
    },
    //连接线路由方式
    router: { name: 'normal', },
    connector: {
      name: 'smooth',
      args: {
        radius: 4,
      },
    },
    zIndex: 0,
  }, true);

  window.registered[shape] = true;
}

export default {
  registerDAGNode
}