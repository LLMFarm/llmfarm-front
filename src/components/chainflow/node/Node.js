import { extractTemplateVariables, resolveRequests } from './template';
import { rebuild } from './builder';
class Node {
  constructor(node) {
    this.node = node;
    console.log('node', node);
    this.data = node.getData();

    this.type = this.data.type;
    this.value = this.data.value || {}
  }

  isChanged(variables) {
    const c = variables;
    c.unshift('linked');
    c.push('prompt');
    const ports = this.node.getPorts();
    const previous = ports.map(port => port.id).join(',');
    // console.log("c", c.join(','));
    // console.log("ports", previous);
    return c.join(',') !== previous;
  }

  buildTemplate() {
    const promptTemplate = this.value.template;
    const variables = extractTemplateVariables(promptTemplate);
    const isChanged = this.isChanged(variables)
    // console.log("isChanged", isChanged);
    if (!isChanged) {
      return false;
    }
    const requests = resolveRequests(variables);

    // 重新渲染节点 PORTS
    rebuild(this.node, requests);
    // 更新数据
    this.data.requests = requests;
    this.node.setData(this.data);
    return requests;
  }
}

export default Node;