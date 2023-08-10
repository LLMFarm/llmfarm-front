import http from "@/utils/http.js";

const prefix = "/api/database/";
const chatgpt = {
  testConnection(connection) {
    const uri = prefix + "connect";
    return http.post(uri, connection);
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
