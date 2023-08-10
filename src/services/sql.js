import http from "@/utils/http.js";

const prefix = "/api/sql/";
const chatgpt = {
  getTables(dataSource) {
    const uri = prefix + "tables";
    return http.post(uri, { dataSource }).then(res => {
      if (res.code != 0 && res.message) {
        return Promise.reject(res.message);
      }
      return res.data;
    });
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
