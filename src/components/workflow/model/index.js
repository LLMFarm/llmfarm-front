import start from "./start";
import approval from "./approval";
import cc from "./cc";
import route from "./route";
import condition from "./condition";

const map = {};
map[start.type] = start;
map[approval.type] = approval;
map[cc.type] = cc;
map[route.type] = route;
map[condition.type] = condition;

export default map;
