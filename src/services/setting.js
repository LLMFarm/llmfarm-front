import http from "@/utils/http.js";

const prefix = "/chain/api/chainflow/";
const setting = {
  list(chainId) {
    const uri = prefix + "setting/list";
    return http.get(uri, { chainId });
  },
  get(settingId) {
    const uri = prefix + "setting";
    return http.get(uri, { settingId });
  },
  post(setting) {
    const uri = prefix + "setting";
    return http.post(uri, { setting });
  },
  put(setting) {
    const uri = prefix + "setting";
    return http.put(uri, { setting });
  }
};

export default setting;
