import { ref, watch, computed, inject } from "vue";
import { useServiceStore } from '@/store/modules/service'
import { useChainStore } from "@/store/modules/chain.js";
import schema from '../schema/index.js'

const useNodeOptions = () => {
  const serviceStore = useServiceStore();
  const chainStore = useChainStore();

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
    return {
      label: node.data.desc,
      value: node.id,
    }
  }

  // 动态计算返回值
  const resolveOptions = () => {
    const flow = chainStore.chain;
    const nodes = flow.nodes || [];
    const options = [];
    for (const node of nodes) {
      const option = resolveNodeOptions(node);
      options.push(option);
    }
    return options;
  }

  const nodeOptions = computed(() => {
    return resolveOptions()
  });

  return {
    nodeOptions
  }
}

export default useNodeOptions;