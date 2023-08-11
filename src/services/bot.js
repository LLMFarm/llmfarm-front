import http from "@/utils/http.js";

const prefix = "/api/bot/";
const settingPrefix = "/api/setting";
const bot = {
  botList() {
    const uri = prefix + "list";
    return http.get(uri, {});
  },
  botNoSetting(botId){
     //bot/botNoSetting
    const uri = prefix +"botNoSetting"
    return http.post(uri, { botId });
  },
  usedBotList() {
    const uri = prefix + "usedBotList";
    return http.get(uri, {});
  },
  addBot(name, chainId) {
    const uri = "/api/bot";
    return http.post(uri, { name, chainId });
  },
  updateBot(botId, name) {
    const uri = "/api/bot";
    return http.put(uri, { botId, name });
  },
  deleteBot(botId) {
    const uri = "/api/bot";
    return http.del(uri, { botId });
  },
  getLibraryList(botId) {
    const uri = "/api/resourceLibrary/list";
    return http.get(uri, { botId });
  },
  // /api/upload
  uploadFile(formData) {
    const uri = "/api/uploadOss";
    return http.post(uri, formData);
  },
  getFileOss(formData) {
    const uri = '/api/getFileOss';
    return http.post(uri, formData);
  },
  getFiles(formData){
    const uri = '/api/bot/getFiles';
    return http.post(uri, formData);
  },
  deleteLibrary(id) {
    const uri = "/api/resourceLibrary";
    return http.del(uri, { id });
  },
  uploadResourceLibrary(id, name) {
    const uri = "/api/resourceLibrary";
    return http.put(uri, { id, name });
  },
  // /resourceLibrary/parse
  parseResourceLibrary(id) {
    const uri = "/api/resourceLibrary/parse";
    return http.post(uri, { id });
  },
  // /resourceLibrary/updateList
  updateList(idList, botId) {
    const uri = "/api/resourceLibrary/updateList";
    return http.post(uri, { idList, botId });
  },
  // 判断是否需要更新
  isNeedUpdate(botId) {
    const uri = "/api/promptChain/isNeedUpdate";
    return http.post(uri, { botId });
  },
  updateChain(chainId) {
    const uri = "/api/promptChain/updateChain";
    return http.post(uri, { chainId });
  },
  // http://127.0.0.1:8000/api/setting
  setSetting(value, serviceType, chainId, botId) {
    const uri = settingPrefix;
    return http.post(uri, {
      value,
      serviceType,
      chainId,
      botId,
    });
  },
  // http://127.0.0.1:8000/api/setting/list
  getSettingList(botId) {
    const uri = settingPrefix + "/list";
    return http.get(uri, { botId });
  },
  // http://127.0.0.1:8000/api/setting
  updateSetting(id, serviceType, value) {
    const uri = settingPrefix;
    return http.put(uri, { id, serviceType, value });
  },
  // http://127.0.0.1:8000/api/bot/addLibs
  addLibs(botId, libIds) {
    const uri = prefix + "addLibs";
    return http.post(uri, { botId, libIds });
  },
  // http://127.0.0.1:8000/api/bot/getLibs
  getLibs(botId) {
    const uri = prefix + "getLibs";
    return http.post(uri, { botId });
  },
  subFiles(botId, fileIds) {
    const uri = prefix + "subFiles";
    return http.post(uri, { botId, fileIds });
  },
  addFiles(botId, fileIds) {
    const uri = prefix + "addFiles";
    return http.post(uri, { botId, fileIds });
  },
  // http://127.0.0.1:8000/api/bot/subLibs
  subLibs(botId, libIds) {
    const uri = prefix + "subLibs";
    return http.post(uri, { botId, libIds });
  },
  // http://127.0.0.1:8000/api/bot/detail
  getBotDetail(botId) {
    const uri = prefix + "detail";
    return http.get(uri, { botId });
  },
  // http://127.0.0.1:8000/api/bot/usedBotList
  getUsedBotList() {
    const uri = prefix + "usedBotList";
    return http.get(uri, {});
  },
  // http://127.0.0.1:8000/api/bot/getPublicBotList
  getPublicBotList(word, limit, pageNumber, PromptType, scenarioId) {
    const uri = prefix + "getPublicBotList";
    return http.get(uri, { word, limit, pageNumber, PromptType, scenarioId });
  },
};
export default bot;
