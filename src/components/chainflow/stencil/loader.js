import schema from '../schema/index.js'
const VITE_IGNORE_LLM = import.meta.env.VITE_IGNORE_LLM;
let ignoredLLM = new Set();
if (VITE_IGNORE_LLM == "true") {
  ignoredLLM = new Set(["ChatAquila", "ChatWenXin", "StableDiffusion", "ChatChineseAlpaca"])
}

// 自定义比较函数
const orders = ['用户输入', '提示词模板', 'LLM', '向量化处理', '向量化搜索', 'SQL'];
function compare(u, v) {
  const indexU = orders.indexOf(u.name);
  const indexV = orders.indexOf(v.name);
  // return indexV - indexU;
  if (indexU !== -1 && indexV !== -1 || indexU === -1 && indexV === -1) {
    return indexU - indexV;
  }

  if (indexU === -1) {
    return 1;
  } else {
    return -1;
  }
}

export const getGroups = (remote = {}) => {
  const set = new Set();
  for (const key in schema) {
    const info = schema[key];
    const { group = '基础' } = info;
    set.add(group);
  }
  for (const key in remote) {
    const info = remote[key];
    const group = info.group || info.service;
    set.add(group);
  }
  const groups = Array.from(set).map(item => {
    return { name: item }
  });
  return groups.sort(compare);
}

// TODO loader 处理服务分组
export const loadComponent = (stencil, graph, remote) => {
  const hash = {};
  const handle = (key, info) => {
    const groupKey = info.group || info.service;
    if (info.ignored || ignoredLLM.has(info.type)) {
      return;
    }
    const node = graph.createNode({ shape: "menu-node", width: 180, height: 40, data: { 'name': key, 'title': info.title } });
    if (hash[groupKey]) {
      hash[groupKey].nodes.push(node);
    } else {
      hash[groupKey] = { nodes: [node] }
    }
  }
  for (const key in schema) {
    const info = schema[key];
    handle(key, info);
  }
  for (const key in remote) {
    const info = remote[key];
    handle(key, info);
  }

  // stencil.load(nodes, "基础服务");
  for (const key in hash) {
    const nodes = hash[key].nodes
    stencil.load(nodes, key);
  }
}

export default {
  getGroups,
  loadComponent
}