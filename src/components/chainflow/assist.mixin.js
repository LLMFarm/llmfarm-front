export default {
  methods: {
    // 添加辅助工具
    assist(graph) {
      const addRemoveTool = node => {
        node.addTools([{
          name: "button-remove",
          args: { x: -8, y: -8, offset: { x: 10, y: 10 }, },
        }]);
      }
      graph.on("cell:mouseenter", ({ cell }) => {
        if (cell.isEdge()) {
          cell.addTools([{ name: "button-remove", args: { distance: -50 } }]);
        }
      });
      graph.on("cell:mouseleave", ({ cell }) => {
        if (cell.isEdge()) {
          cell.removeTools();
        }
      });
      graph.on("node:mouseenter", ({ cell }) => {
        if (cell.isNode()) {
          addRemoveTool(cell);
        }
      });
      graph.on("node:mouseleave", ({ cell }) => {
        cell.removeTools();
      });
    },
    mock() {
      const graph = this.graph;
      const list = [
        { id: 1, name: "读取数据", status: "success", x: 100, y: 120 },
        { id: 2, name: "逻辑回归", status: "success", x: 420, y: 120 },
        { id: 3, name: "模型预测", status: "running", x: 420, y: 220 },
        { id: 4, name: "处理数据", status: "failure", x: 720, y: 120 },
      ];
      for (const item of list) {
        const node = this.resolveDagNode(item);
        graph.addNode(node);
      }
      const edges = [
        { source: 1, target: 2 },
        { source: 2, target: 3 },
      ];
      for (const item of edges) {
        const edge = graph.createEdge({
          source: { cell: item.source },
          target: { cell: item.target },
          router: "orth",
          connector: { name: "rounded" },
          attrs: { line: { stroke: "#c2c8d5" } },
        });
        graph.addCell(edge);
      }
    },
  },
};
