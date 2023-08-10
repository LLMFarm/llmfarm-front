import http from "@/utils/http.js";
const prefix = "/api/chainTemplateInfo/";
const chainTemplateInfo = {
  OffShelf(templateInfoId){
    //http://127.0.0.1:8000/api/chainTemplate/OffShelf
    const uri = prefix + "OffShelf";
    return http.post(uri, {templateInfoId});
  }
};
export default chainTemplateInfo;
