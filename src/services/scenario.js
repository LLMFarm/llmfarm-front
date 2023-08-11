import http from "@/utils/http.js";

const prefix = "/api/scenario/";
const scenario = {
  sceneList() {
    const uri = prefix + "list";
    return http.get(uri, {});
  }
};
export default scenario;
