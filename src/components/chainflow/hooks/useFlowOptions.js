import { ref, watch, computed } from "vue";
// import { useChainflowStore } from '@/store/modules/chainflow';
import { useServiceStore } from '@/store/modules/service'
import schema from '../schema/index.js'

const useFlowOptions = () => {
  // const chainflowStore = useChainflowStore();
  const serviceStore = useServiceStore();

  const resolveAPI = (value, nodeId) => {
    const { service, api } = value;
    const match = serviceStore.plugins.find(item => item.unique == service)
    if (!match) { return [] }
    const matchAPI = match.list.find(item => item.uri == api);
    const response = matchAPI.response || [];
    return response.map(item => {
      return {
        value: nodeId + '.' + item.key,
        label: item.desc
      }
    })
  }

  const resolveTrigger = (value, nodeId) => {
    const { service, value: triggerValue } = value;
    const match = serviceStore.plugins.find(item => item.unique == service)
    if (!match) { return [] }
    const matchTrigger = match.triggers.find(item => item.value == triggerValue);
    const request = matchTrigger.request || [];
    return request.map(item => {
      return {
        value: nodeId + '.' + item.key,
        label: item.desc
      }
    })
  }

  const resolveCommonOptions = (type, nodeId) => {
    console.log("nodeId", nodeId);
    const remoteSchema = window.remoteSchema || {}
    const info = schema[type] || remoteSchema[type];
    const list = []
    for (const { key, type } of info.response) {
      list.push({
        value: nodeId,
        label: key
      })
    }
    return list;
  }

  const resolveNodeOptions = (node) => {
    let options = []
    const { type, value = {} } = node.data;
    console.log('node.type', type, node);
    if (type === 'LogicIF') { return [] }
    if (type == 'API') {
      options = resolveAPI(value, node.id);
    } else if (type == 'Trigger') {
      options = resolveTrigger(value, node.id);
    } else {
      options = resolveCommonOptions(type, node.id);
    }

    return {
      label: node.data.title + ' ' + node.data.desc,
      options
    }
  }

  // 动态计算返回值
  const resolveOptions = () => {
    const flow = chainflowStore.flow;
    const nodes = flow.nodes || [];
    const options = [];
    for (const node of nodes) {
      const option = resolveNodeOptions(node);
      if (option.options && option.options.length > 0) {
        options.push(option);
      }
    }
    // console.log("JSON.", JSON.stringify(options, null, 2))
    return options;
  }

  const selectorOptions = computed(() => {
    return resolveOptions()
  });

  return {
    selectorOptions
  }
}

export default useFlowOptions;