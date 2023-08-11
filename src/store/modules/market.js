import { defineStore } from "pinia";
import services from "@/services/index";
import i18n from '@/locals/index'

export const useMarketStore = defineStore("market", {
  state: () => ({
    userSearch: "",
    chainMarketList: [],
    selectOption: { chainLevel: 0, sceneId: 0, downloadType: 0 },
    spinning: false,
    marketTotal: 0,
    marketPageSize: 20,
    marketCurrent: 1,
    screenConfig: [
      {
        key: "sceneId",
        name: i18n.global.t('home.screen.byScene'),
        option: [{ id: 0, name: i18n.global.t('home.screen.all') }],
      },
      {
        key: "chainLevel",
        name: i18n.global.t('home.screen.byNode'),
        option: [
          { id: 0, name: i18n.global.t('home.screen.all') },
          { id: 1, name: "1" },
          { id: 2, name: "2" },
          { id: 3, name: "3" },
          { id: 4, name: "4" },
          { id: 5, name: `4 ${i18n.global.t('home.screen.above') }` },
        ],
      },
      {
        key: "downloadType",
        name: i18n.global.t('home.screen.byDownload'),
        option: [
          { id: 0, name: i18n.global.t('home.screen.all') },
          { id: 1, name: i18n.global.t('home.screen.downloaded') },
          { id: 2, name: i18n.global.t('home.screen.notDownloaded') },
        ],
      },
    ],
    slotsConfig: [
      { name: i18n.global.t('home.screen.default'), key: "createTimeSort", type: 'default' },
      { name: i18n.global.t('home.screen.downloadCount'), key: "downloadCountSort" },
    ],
    selectSlots: { createTimeSort: "desc", downloadCountSort: "" },
    //加载更多
    loading: false,
    haveMore: true,
  }),
  actions: {
    setUserSearch(text) {
      this.userSearch = text;
      this.getChainTemplateList();
    },
    setChainMarketList(list) {
      this.chainMarketList = list;
    },
    setSelectOption(key, value) {
      this.selectOption[key] = value;
    },
    async getChainTemplateList(type) {
      if (!type) {
        this.spinning = true;
        this.marketCurrent = 1;
      } else {
        this.loading = true;
      }
      let info = {
        word: this.userSearch,
        chainLevel: this.selectOption.chainLevel,
        sceneId: this.selectOption.sceneId,
        downloadType: this.selectOption.downloadType,
        createTimeSort: this.selectSlots.createTimeSort,
        downloadCountSort: this.selectSlots.downloadCountSort,
        limit: this.marketPageSize,
        pageNumber: this.marketCurrent,
      };
      const res = await services.chain.chainTemplateList(info);
      if (res.code === 0) {
        if (type == 'add') {
          this.chainMarketList.push(...res.data.chainTemplateInfoList || []);
        } else {
          this.chainMarketList = res.data.chainTemplateInfoList || [];
        }
        this.marketTotal = res.data.pageCount * this.marketPageSize;
        this.haveMore = res.data.pageCount > this.marketCurrent;
        // if (res.data.pageCount > this.marketCurrent && type == 'add') {
        this.marketCurrent += 1;
        // }

      }
      this.spinning = false;
      this.loading = false;
    },
    loadingMore() {
      if (!this.haveMore) return;
      this.getChainTemplateList("add");
    },
    async getSceneList() {
      const res = await services.chain.sceneList();
      if (res.code === 0) {
        this.screenConfig.forEach((item) => {
          if (item.key === "sceneId") {
            item.option = [
              { id: 0, name: "所有" },
              ...res.data.map((item) => {
                return {
                  name: item.sceneName,
                  id: item.id,
                };
              }),
            ];
          }
        });
      }
    },
    //重置marketCurrent
    resetMarketCurrent() {
      this.marketCurrent = 1;
    },
    setMarketCurrent(current) {
      this.marketCurrent = current || this.marketCurrent + 1;
    },
    setMoreText(text) {
      this.moreText = text || "";
    },
    //重置筛选排序
    resetSelectOption() {
      this.userSearch = "";
      this.selectOption = { chainLevel: 0, sceneId: 0, downloadType: 0 };
      this.selectSlots = { createTimeSort: "desc", downloadCountSort: "" };
    },
  },
});
