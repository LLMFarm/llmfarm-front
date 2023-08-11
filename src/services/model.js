import http from "@/utils/http.js";

const prefix = "/api/model/";
const login = {
  modelList() {
    const uri = prefix + "list";
    return http.get(uri, {});
  },
};
export default login;
