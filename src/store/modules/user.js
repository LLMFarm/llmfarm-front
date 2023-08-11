import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
  state: () => ({
    userId: "",
    userInfo: {},
    systemName: "",
  }),
  actions: {
    setUserId(userId) {
      this.userId = userId;
    },
    setUserInfo(info) {
      this.userInfo = info || {};
      console.log(info, "setUserInfo");
      // 手机号码加密
      if (info.phone) {
        // 手机号码脱敏
        var pho = /(\d{3})\d*(\d{4})/;
        var str = info.phone.replace(pho, "$1****$2");
        this.userInfo.encryptionPhone = str;
      }
    },
    setSystemName(name) {
      this.systemName = name;
    }
  },
  // persist: true,
  // plugins: [createPersistedState()]
})