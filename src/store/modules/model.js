import { defineStore } from 'pinia'

export const useModelStore = defineStore('model', {
  state: () => ({
    modelList: [],
    defaultModel: {},
  }),
  actions: {
    setModelList(list) {
      this.modelList = list || [];
    },
    setDefaultModel(info) {
      this.defaultModel = info || [];
    },
    selectModel(info) {
      this.defaultModel = info || {};
      localStorage.setItem("defaultModel", info.id)
    },
    selectById(id) {
      const model = this.modelList.find(item => item.id == id);
      if (model) {
        this.defaultModel = model;
        console.log("===============model",model)
        localStorage.setItem("defaultModel", model.id)
      }
    }
  },
})