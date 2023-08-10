import schemaHash from '../schema/index.js';
import { extractTemplateVariables, resolveRequests } from "./template.js"

const getSchema = (node) => {
  const data = node.getData()
  const schemaType = data.type;
  return schemaHash[schemaType];
}

const linkedPort = {
  group: 'linked',
  position: { name: 'left', args: { dy: 30 } }
}

// TODO 不同类型的节点分配不同的颜色
const circle = { r: 6, magnet: true, style: { stroke: "#52c41a" } }

export const resolvePromptTemplate = (template) => {
  const defaultVariables = [{ "key": "template", "label": "提示词模板", "type": "PromptTemplate" }]
  const variables = extractTemplateVariables(template);
  const dynamics = variables.map((variable) => {
    return {
      key: variable,
      input: true,
      type: 'string',
    }
  });
  return defaultVariables.concat(dynamics);
}

// 根据 Node 定义和配置生成端口配置
export const buildNodePorts = (schema, value) => {

  let requests = schema.request;
  // PromptTemplate 的端口配置, 动态解析
  console.log('buildNodePorts', schema.type);
  if (schema.type === 'PromptTemplate') {
    requests = resolvePromptTemplate(value.template);
    console.log("requests", requests)
  }

  const ports = []
  let nodeHeight = 120;
  let inputHeight = 80;

  // const requests = request || schema.request;
  for (const item of requests || []) {
    if (item.input === true) {
      ports.push({
        group: item.key,
        position: {
          name: 'left',
          args: { dy: nodeHeight + inputHeight / 2 }
        }
      })
    }
    nodeHeight += inputHeight;
  }

  let outputHeight = 40;
  for (const item of schema.response || []) {
    ports.push({
      group: item.key,
      position: {
        name: 'right',
        args: { dy: nodeHeight + outputHeight / 2 }
      }
    })
    nodeHeight += 40;
  }

  const nodePorts = {
    items: ports.map((item) => {
      return {
        group: item.group,
        id: item.group,
        attrs: { circle: circle },
      }
    }),
    groups: (() => {
      const map = {}
      for (const port of ports) {
        if (!map[port.group]) {
          map[port.group] = {
            position: port.position,
          }
        }
      }
      return map;
    })()
  }
  return nodePorts
}

export const rebuild = (node, requests) => {

  const schema = getSchema(node);
  let ports = [linkedPort]

  let nodeHeight = 120;
  let inputHeight = 80;
  console.log("requests", requests);
  for (const item of requests || []) {
    if (item.input === true) {
      ports.push({
        group: item.key,
        position: {
          name: 'left',
          args: { dy: nodeHeight + inputHeight / 2 }
        }
      })
    }
    nodeHeight += inputHeight;
  }

  let outputHeight = 40;
  for (const item of schema.response || []) {
    ports.push({
      group: item.key,
      position: {
        name: 'right',
        args: { dy: nodeHeight + outputHeight / 2 }
      }
    })
    nodeHeight += 40;
  }

  nodeHeight += 20

  // 清空端口
  node.ports.groups = {};
  for (const port of node.getPorts()) {
    node.removePort(port.id);
  }
  //去重ports
  const map = {};
  for (const port of ports) {
    if (!map[port.group]) {
      map[port.group] = port;
    }
  }
  ports = Object.values(map);
  
  // 添加端口
  for (const item of ports) {
    // 配置 GROUP
    node.ports.groups[item.group] = {
      position: item.position
    }
    // 添加 PORT
    const port = {
      group: item.group,
      id: item.group,
      attrs: { circle: circle },
    }
    node.addPort(port);
  }
}

export default {
  rebuild,
  buildNodePorts
};