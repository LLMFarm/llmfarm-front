import { defineStore } from 'pinia'
import services from "@/services/index";


export const useChainStore = defineStore('chain', {
  state: () => ({
    selectMenu: "chat",
    chainList: [],
    selectChain: {},
    chain: {},
  }),
  actions: {
    //切换选中菜单
    setSelectMenu(menu) {
      this.selectMenu = menu;
    },
    setChainList(list) {
      this.chainList = list || [];
    },
    addChain(chain) {
      this.chainList.unshift(chain);
    },
    setSelectChain(chain) {
      if (!chain.id) {
        this.selectChain = chain;
        this.chain = chain;
        return;
      }
      services.chain.chainDetail(chain.id).then((res) => {
        if (res.code === 0) {
          this.selectChain = res.data;
          this.chain = res.data;
        }
      });
    },
    setChain(chain) {
      this.chain = chain;
    },
    getChainByID(id) {
      return this.chainList.find(item => item.id === parseInt(id)) || {}
    },
    deleteChain(index) {
      this.chainList.splice(index, 1)
      if (this.chainList.length) {
        this.setSelectChain([]);
      } else {
        this.setSelectChain({})
      }
    },
  },
  // persist: true,
  // plugins: [createPersistedState()]
})