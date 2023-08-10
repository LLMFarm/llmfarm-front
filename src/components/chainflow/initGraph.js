import { Graph, Shape } from "@antv/x6";

const magnetAvailabilityHighlighter = {
  name: "stroke",
  args: {
    padding: 3,
    attrs: { strokeWidth: 3, stroke: "#52c41a" },
  },
};

const createEdge = (cell) => {
  const lineStyle = {
    stroke: "#c2c8d5",
    strokeWidth: 2,
    targetMarker: { name: "block", size: 8 },
  };

  const edge = new Shape.Edge({
    shape: "next",
    attrs: {
      line: lineStyle,
    },
    // 连接线路由方式 https://x6.antv.antgroup.com/api/registry/router
    router: { name: "normal" }, // normal | orth | oneSide | manhattan | metro | er
    // https://x6.antv.antgroup.com/api/registry/connector
    connector: {
      name: "smooth", // normal | smooth | rounded
      args: { radius: 4 },
    },
    zIndex: 0,
  });
  return edge;
};

const initGraph = (container) => {

  const rect = container.getBoundingClientRect();

  const options = {
    container: container,
    // width: "100%",
    // height: "100%",
    width: rect.width || 900,
    height: rect.height || 700,
    // 网格背景
    grid: true,
    // 画布平移 https://x6.antv.antgroup.com/api/graph/panning
    panning: {
      enabled: true,
    },
    // 缩放大小配置
    scaling: {
      min: 0.05, // 默认值为 0.01
      max: 12, // 默认值为 16
    },
    // 画布缩放 mousewheel
    mousewheel: {
      enabled: true,
      factor: 1.04,
    },
    highlighting: {
      magnetAvailable: magnetAvailabilityHighlighter,
    },
    snap: true,
    highlight: true,
    allowNode: false,
    selecting: {
      enabled: true,
    },
    // 连接配置
    connecting: {
      anchor: "center",
      // connectionPoint: 'anchor',
      allowBlank: false,
      allowMulti: true,
      allowNode: true,
      // highlight: true,
      snap: true,
      createEdge(context) {
        const { sourceCell, sourceView } = context;
        console.log("调用 create.edge");
        const edge = createEdge(sourceCell);
        return edge;
      },
      validateConnection({ sourceView, targetView, sourceMagnet, targetMagnet }) {
        if (sourceView.cid === targetView.cid) {
          return false;
        }
        const portGroup = sourceMagnet.getAttribute("port-group");
        console.log("port.group", portGroup);
        return true;
      },
    },
  };

  const graph = new Graph(options);
  return graph;
}

export default initGraph;