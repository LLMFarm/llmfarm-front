import { defineStore } from "pinia";
import settingService from "@/services/setting";

export const useSettingStore = defineStore("setting", {
  state: () => ({
    list: []
  }),
  actions: {
    async init(chainId) {
      const res = await settingService.list(chainId);
      if (res.data) {
        this.list = res.data;
        return this.list;
      }
      return [];
    },
  },
  persist: {
    debug: true,
  },
});
