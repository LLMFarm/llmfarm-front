import http from "@/utils/http.js";

const prefix = "/chain/api/service";
const chatgpt = {
  initNode() {
    const uri = '/chain/api/chainflow/schema';
    return http.get(uri);
  },
  schema() {
    const uri = prefix + "/schema";
    return http.get(uri);
  },
  getList() {
    const uri = prefix + "/list";
    return http.get(uri);
  }
};
export default chatgpt;
