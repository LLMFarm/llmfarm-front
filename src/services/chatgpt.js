import http from "@/utils/http.js";

const prefix = "/api/chatgpt/";
const chatgpt = {
  question(content) {
    const uri = prefix + "question";
    return http.post(uri, { content });
  },
  getVector(uuid) {
    const uri = prefix + "vector";
    // console.log("getVector.uuid", uuid)
    return http.get(uri, { uuid });
  }
};
export default chatgpt;
