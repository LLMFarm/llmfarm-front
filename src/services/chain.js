import http from "@/utils/http.js";
const prefix = "/api/chain/";
const chain = {
  chainList() {
    const uri = prefix + "list";
    return http.get(uri, {});
  },
  addChain(name, isPublic, useKnowledge, nodes = [], edges = []) {
    const uri = "/api/chain";
    return http.post(uri, { name, nodes, edges, isPublic, useKnowledge });
  },
  //id, name, required, nodes, edges, isPublic, type
  updateChain(data) {
    const uri = "/api/chain";
    const info = {
      id: data.id,
      name: data.name,
      nodes: data.nodes,
      edges: data.edges,
      isPublic: data.isPublic,
    };
    return http.put(uri, info);
  },
  updateChainName(name, id) {
    const uri = prefix + "updateChainName";
    return http.put(uri, { id, name });
  },
  deleteChain(id) {
    const uri = "/api/chain";
    return http.del(uri, { id });
  },
  chainBotList(chainId) {
    const uri = prefix + "chainBotList";
    return http.post(uri, { chainId });
  },
  chainTree({approveStatusValue,chainTemplateStatusValue}){
    const uri = "/api/chainTemplate/getTree";
    return http.post(uri, {approveStatusValue,chainTemplateStatusValue});
  },
  chainTemplateList({
    word,
    chainLevel,
    sceneId,
    downloadType,
    createTimeSort,
    downloadCountSort,
    limit,
    pageNumber }) {
    const uri = "/api/chainTemplateInfo/list";
    return http.post(uri, {
      word,
      chainLevel,
      sceneId,
      downloadType,
      createTimeSort,
      downloadCountSort,
      limit,
      pageNumber,
    });
  },
  sceneList() {
    const uri = "/api/scene/list";
    return http.get(uri);
  },
  addChainTemplate({ chainId, version, versionDesc, desc, icon, sceneIds }) {
    const uri = "/api/chainTemplate";
    return http.post(uri, { chainId, version, versionDesc, desc, icon, sceneIds });
  },
  getChainTemplate(chainTemplateId) {
    const uri = "/api/chainTemplate";
    return http.get(uri, { chainTemplateId });
  },
  chainTemplateVersionList(fatherId) {
    const uri = "/api/chainTemplate/versionList";
    return http.get(uri, { fatherId });
  },
  // http://127.0.0.1:8000/api/chainTemplateInfo/download
  downloadChainTemplate(templateInfoId, templateId) {
    const uri = "/api/chainTemplateInfo/download";
    return http.post(uri, { templateInfoId, templateId });
  },
  coverChainTemplate(templateInfoId, templateId) {
    const uri = "/api/chainTemplateInfo/coverDownload";
    return http.post(uri, { templateInfoId, templateId });
  },
  // http://127.0.0.1:8000/api/chain/detail
  chainDetail(id) {
    const uri = "/api/chain/detail";
    return http.get(uri, { id });
  }
};
export default chain;
