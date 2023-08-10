import http from "@/utils/http.js";

const prefix = "/api/chainflow/";
const chatgpt = {
  list() {
    const uri = prefix + "list";
    return http.get(uri);
  },
  get(chainId) {
    const uri = prefix + "chain";
    return http.get(uri, { chainId });
  },
  post(chain) {
    const uri = prefix + "chain";
    return http.post(uri, { chain });
  },
  put(chain) {
    const uri = prefix + "chain";
    return http.put(uri, { chain });
  },
};
export default chatgpt;
