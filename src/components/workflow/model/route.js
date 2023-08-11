import { TYPES } from "../common";
const node = {
  type: TYPES.ROUTE,
  name: "条件分支",
  default: {
    type: TYPES.ROUTE,
    name: "路由",
    props: {},
  },
  permission: {
    add: true,
  },
};

export default node;
