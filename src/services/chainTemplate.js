import http from "@/utils/http.js";
const prefix = "/api/chainTemplate/";
const chainTemplate = {
  OffShelf(chainTemplateId){
    //http://127.0.0.1:8000/api/chainTemplate/OffShelf
    const uri = prefix + "OffShelf";
    console.log("chainTemplateId==============",uri);
    return http.post(uri, {chainTemplateId});
  },
  ReShelf({chainTemplateId,versionDesc,desc,icon,sceneIds}){
    const uri = prefix + "reshelf";
    return http.post(uri, {chainTemplateId,versionDesc,desc,icon,sceneIds});
  }
};
export default chainTemplate;
