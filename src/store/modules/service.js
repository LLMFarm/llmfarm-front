import { defineStore } from "pinia";
import service from "@/services/service";

export const useServiceStore = defineStore("service", {
  state: () => ({
    schema: {},
    services: [],
    plugins: []
  }),
  actions: {
    async init() {
      const res = await service.schema();
      const hash = res.data || {};
      const services = []
      for (const key in hash) {
        services.push(hash[key]);
      }
      this.services = services || [];

      const result = await service.getList();
      const plugins = result.data || [];
      this.plugins = plugins;

      return plugins || [];
    },
    async loadSchema() {
      const res = await service.initNode();
      const schema = res.data || {};
      this.schema = schema;
      return schema;
    },
    getService(unique) {
      const service = this.services.find(service => service.unique === unique);
      return service || { configs: [] }
    }
  },
  persist: {
    debug: true,
  },
});
