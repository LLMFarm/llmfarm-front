import http from "@/utils/http.js";

const prefix = "/api/dataSet";
const analysis = {
  // http://127.0.0.1:8000/api/dataSet
  getDataSet(userFileId, pageNumber) {
    const uri = prefix;
    return http.get(uri, { userFileId, pageNumber });
  },
  // http://127.0.0.1:8000/api/dataSet/getVectors
  getVectors(setId, pageNumber = 1, pageCount = 20, vectorBase = 'chroma') {
    const uri = prefix + "/getVectors";
    return http.post(uri, { setId, vectorBase, pageNumber, pageCount });
  },
  // http://127.0.0.1:8000/api/dataSet/idList
  idList(ids) {
    const uri = prefix + "/idList";
    return http.get(uri, { ids });
  },
  // http://127.0.0.1:8000/api/dataSet
  createDataSet(setName, vectorBase, userFileId, params, embeddingModel) {
    const uri = prefix;
    return http.post(uri, { setName, vectorBase, userFileId, params, embeddingModel });
  },
  // http://127.0.0.1:8000/api/dataSet/textSplitterPreview
  textSplitterPreview(userFileId, params) {
    const uri = prefix + "/textSplitterPreview";
    return http.post(uri, { userFileId, params });
  },
  hitTest(text, setIds) {
    const uri = prefix + "/hitTest";
    return http.post(uri, { text, setIds });
  },
  // http://127.0.0.1:8000/api/dataSet
  deleteDataSet(dataSetId) {
    const uri = prefix;
    return http.del(uri, { dataSetId });
  },
  // http://127.0.0.1:8000/api/dataSet
  editDataSet(dataSetId, setName) {
    const uri = prefix;
    return http.put(uri, { dataSetId, setName });
  },
  // http://127.0.0.1:8000/api/setFolder
  setFolder(setFolderName, dataSetId) {
    const uri = "/api/setFolder";
    return http.post(uri, { setFolderName, dataSetId });
  },
  // http://127.0.0.1:8000/api/setFolder
  editFolder(setFolderId, setFolderName) {
    const uri = "/api/setFolder";
    return http.put(uri, { setFolderId, setFolderName });
  },
  // http://127.0.0.1:8000/api/setFolder
  deleteFolder(setFolderId) {
    const uri = "/api/setFolder";
    return http.del(uri, { setFolderId });
  },
  // /setFolder
  getFolder() {
    const uri = "/api/setFolder";
    return http.get(uri);
  },
  // http://127.0.0.1:8000/api/bot/botSetFolder
  botSetFolderList(botId) {
    const uri = "/api/bot/botSetFolder";
    return http.get(uri, { botId });
  },
  // http://127.0.0.1:8000/api/bot/botSetFolder
  botFolderSet(setFolderIds, botId) {
    const uri = "/api/bot/botSetFolder";
    return http.post(uri, { setFolderIds, botId });
  },
  // http://127.0.0.1:8000/api/bot/dataSet
  botDataSet(dataSetIds, botId) {
    const uri = "/api/bot/dataSet";
    return http.post(uri, { botId, dataSetIds });
  },
  // http://127.0.0.1:8000/api/bot/dataSet
  delBotDataSet(botId, dataSetId) {
    const uri = "/api/bot/dataSet";
    return http.del(uri, { botId, dataSetId });
  },
  // http://127.0.0.1:8000/api/dataSet/getDataSetListBybotId
  getDataSetListByBotId(botId, pageNumber) {
    const uri = "/api/dataSet/getDataSetListBybotId";
    return http.post(uri, { botId, pageNumber });
  },
  // http://127.0.0.1:8000/api/bot/botSetFolder  delFolder(setFolderId) {
  delFolder(setFolderId, botId) {
    const uri = "/api/bot/botSetFolder";
    return http.del(uri, { setFolderId, botId });
  },
  // http://127.0.0.1:8000/api/dataSet/getDataSetListBySetFolderId
  getDataSetListBySetFolderId(setFolderId) {
    const uri = "/api/dataSet/getDataSetListBySetFolderId";
    return http.post(uri, { setFolderId });
  },
  // http://127.0.0.1:8000/api/file/getUserFileById
  getUserFileById(userFileId) {
    const uri = "/api/file/getUserFileById";
    return http.get(uri, { userFileId });
  },
  // http://127.0.0.1:8000/api/setFolder/detail
  getSetFolderDetail(setFolderId) {
    const uri = "/api/setFolder/detail";
    return http.get(uri, { setFolderId });
  },
  // http://127.0.0.1:8000/api/folderDataSet
  folderDataSet(setFolderId, dataSetId) {
    const uri = "/api/folderDataSet";
    return http.post(uri, { setFolderId, dataSetId });
  },
  // http://127.0.0.1:8000/api/folderDataSet
  delFolderDataSet(setFolderId, dataSetId) {
    const uri = "/api/folderDataSet";
    return http.del(uri, { setFolderId, dataSetId });
  },
};
export default analysis;
