import { Stencil } from "@antv/x6-plugin-stencil";
import loader from "./loader";
import createFlowNode from "./createFlowNode";

const useStencil = (graph, stencilContainer, remoteSchema = {}) => {

  const groups = loader.getGroups(remoteSchema);

  const stencil = new Stencil({
    title: "节点列表",
    // search: true,
    placeholder: "节点名称",
    layoutOptions: {
      columns: 1,
      columnWidth: 'compact',
      rowHeight: 'compact',
      resizeToFit: true
    },
    target: graph,
    groups: groups,
    stencilGraphWidth: 200,
    stencilGraphHeight: 0,
    getDragNode(node) {
      console.log("getDragNode", node);
      const val = createFlowNode(node, graph);
      return graph.createNode(val);
    }
  })

  stencilContainer.appendChild(stencil.container);

  // 加载服务组件
  loader.loadComponent(stencil, graph, remoteSchema);
}

export default useStencil;