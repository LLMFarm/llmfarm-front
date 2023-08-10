import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import services from "@/services/index";

import pinyin from "pinyin/lib/pinyin";
const convertToPinYin = (word) => {
  const result = pinyin(word, { style: "normal", heteronym: true });
  const py = result.map((item) => item[0]).join("");
  return py;
};

export const useBotStore = defineStore("bot", {
  state: () => ({
    bots: [], // bot列表
    selectedBot: {}, // 当前选中bot
    settings: [], // bot设置
    libs: [], // libs
    botSpinning: false,
    usedBotList: [],
  }),
  getters: {
    completionOptions() {
      const options = [
        // {
        //   type: "category",
        //   title: "指令",
        //   options: [
        //     {
        //       type: "command",
        //       title: "添加机器人",
        //       value: "add-bot",
        //       pinyin: "tianjiajiqiren",
        //     },
        //   ],
        // },
        // {
        //   type: "category",
        //   title: "最近使用",
        //   options: this.usedBotList.map((item) => {
        //     return {
        //       value: item.id,
        //       type: "bot",
        //       title: item.botName,
        //       pinyin: convertToPinYin(item.botName),
        //     };
        //   }),
        // },
        {
          type: "category",
          title: "我的",
          options: this.bots.map((item) => {
            return {
              value: item.id,
              type: "bot",
              title: item.botName,
              icon: item.icon,
              pinyin: convertToPinYin(item.botName),
            };
          }),
        },
      ];
      return options;
    },
  },
  actions: {
    async init() {
      const usedBotRes = await services.bot.usedBotList();
      if (usedBotRes.code == 0) {
        this.usedBotList = usedBotRes.data || [];
        console.log("this.usedBotList", this.usedBotList);
      }
      const botRes = await services.bot.botList();
      if (botRes.code == 0) {
        this.bots = botRes.data || [];
        console.log("this.botRes", this.bots);
      }

    },
    // 添加一条bot
    addBot(bot) {
      if (!bot.itemShow) {
        bot.itemShow = "normal";
      }
      this.bots.unshift(bot);
    },
    // 删除一条bot
    deleteBot(index) {
      this.bots.splice(index, 1);
      if (this.bots.length) {
        this.selectBot([]);
      } else {
        this.selectBot({});
      }
    },
    // 更新一条bot
    updateBot({ uuid, bot }) {
      const index = this.bots.findIndex((item) => item.uuid === uuid);
      this.bots.splice(index, 1, bot);
    },
    // 修改bot列表
    setBots(list) {
      this.bots = list.map((item) => {
        item.useKnowledge = 0;
        return item;
      });
      return this.bots;
    },
    // 清空bot列表
    clearBots() {
      this.bots = [];
      this.selectBot({});
    },
    // 获取bot列表
    getBots() {
      return this.bots;
    },
    getBotByID(id) {
      return this.bots.find((item) => item.id === parseInt(id)) || {};
    },
    // 更新选中的bot
    selectBot(bot) {
      this.selectedBot = bot;
      this.botSpinning = true;

      services.bot.getBotDetail(bot.id).then((res) => {
        if (res.code === 0) {
          this.selectedBot = res.data;
          // debugger
          this.settings =
            res.data.configs?.map((item) => {
              item.type = "form";
              if (item.settingId === 0) {
                item.settingId = null;
              }
              return item;
            }) || [];
          // //判断bot是否需要更新chain
          // services.bot.isNeedUpdate(bot.id).then(res => {
          //   if (res.code === 0) {
          //     this.selectedBot.needUpdate = res.data;
          //   }
          // });
        }
        this.botSpinning = false;
      });
      // services.bot.getSettingList(bot.id).then(res => {
      //   if (res.code === 0) {
      //     this.settings.forEach(item => {
      //       let findItem = res.data?.find(i => i.serviceType === item.unique) || item
      //       item.id = findItem.id;
      //       if (findItem.value) {
      //         item.configs.forEach(config => {
      //           config.value = findItem.value[config.key];
      //         });
      //       } else {
      //         item.configs.forEach(config => {
      //           config.value = null;
      //         });
      //       }
      //     });
      //     console.log("更新设置", this.settings);
      //   }
      // });
      this.getLibs(bot.id);
    },
    saveBot() {
      this.bots = this.bots.map((item) => {
        if (item.uuid === this.selectedBot.uuid) {
          item.messages = this.selectedBot.messages || [];
          console.log("更新消息条数", item.messages.length);
        }
        return item;
      });
    },
    clearChat() {
      this.bots = [];
      this.selectedBot = {};
    },
    getLibs(id) {
      services.bot.getLibs(id).then((res) => {
        if (res.code === 0) {
          this.setLibs(res.data || []);
        }
      });
    },
    setLibs(list) {
      this.libs = list?.map((item) => {
        return {
          ...item,
          createUser: item.userInfo?.name || "暂无",
        };
      });
    },
    addLib(lib) {
      this.libs.unshift(lib);
    },
  },
  persist: false,
  // plugins: [createPersistedState()]
});
