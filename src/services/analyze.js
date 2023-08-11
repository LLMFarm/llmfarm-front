import http from "@/utils/http.js";

const prefix = "/api/analyze/";
const chatgpt = {
  getQuestion(questionId) {
    const uri = prefix + "question";
    return http.get(uri, { questionId });
  },
  analyzeSQL(sql, instanceId) {
    const uri = prefix + "sql";
    return http.post(uri, { sql, instanceId });
  },
  executeSQL(sql, dynamics, instanceId) {
    const uri = prefix + "dynamic/execute";
    return http.post(uri, { sql, dynamics, instanceId })
  }
};
export default chatgpt;
