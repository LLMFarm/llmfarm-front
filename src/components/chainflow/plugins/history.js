import { History } from "@antv/x6-plugin-history";

const useHistory = (graph) => {

  // 开启历史记录
  graph.use(new History({
    enabled: true,
    beforeAddCommand(event, args) {
      return args.key !== "tools";
    },
  }))
}

export default useHistory;