import schemaHash from '../schema/index.js';

const getSchema = (node) => {
  const data = node.getData()
  const name = data.name;
  return schemaHash[name] || window.remoteSchema[name];
}

// TODO 不同类型的节点分配不同的颜色
const circle = { r: 6, magnet: true, style: { stroke: "#52c41a" } }

const linkedPort = {
  group: 'linked',
  position: { name: 'left', args: { dy: 30 } }
}

const createFlowNode = (node) => {

  const schema = getSchema(node);

  const data = {
    type: schema.type,
    title: schema.type,
    desc: schema.desc,
    service: schema.service,
    value: {}
  }
  console.log('data', data);
  const ports = [linkedPort];

  let nodeHeight = 120;
  let inputHeight = 80;
  for (const item of schema.request || []) {
    // 设置默认值
    if (item.default) {
      data.value[item.key] = item.default;
    }
    if (item.input === true) {
      ports.push({
        group: item.key,
        position: {
          name: 'left',
          args: { dy: nodeHeight + inputHeight / 2 }
        }
      })
      // console.log('nodeHeight + inputHeight / 2', nodeHeight + inputHeight / 2)
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

  const flowNode = {
    shape: "flow-node",
    width: 300,
    // height: nodeHeight,
    data: data,
    ports: {
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
  };

  // console.log("flowNode", flowNode)
  return flowNode;
}

export default createFlowNode;