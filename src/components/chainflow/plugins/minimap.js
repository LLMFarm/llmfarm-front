/**
 * 小地图插件 https://x6.antv.antgroup.com/tutorial/plugins/minimap
 */
import { MiniMap } from "@antv/x6-plugin-minimap";

const useMinimap = (graph, elem) => {
  let container = elem;
  if (typeof elem === "string") {
    container = document.getElementById(elem);
  }
  if (!container instanceof HTMLElement) {
    return {};
  }

  graph.use(
    new MiniMap({
      container: container
    })
  )

  // const options = {
  //   scroller: {
  //     enabled: true,
  //   },
  //   minimap: {
  //     enabled: true,
  //     // width: 200,
  //     // height: 200,
  //     container: container,
  //     scalable: true,
  //     minScale: 0.5,
  //     maxScale: 1.5,
  //   },
  // };
  return graph
};

export default useMinimap;
