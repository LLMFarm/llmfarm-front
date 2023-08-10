import http from "@/utils/http.js";

const prefix = "/api/messages";
const messages = {
  getMessage(chatId) {
    const uri = prefix;
    return http.get(uri, { chatId });
  },
  sendMessage(chatId, parentId, content) {
    const uri = "/api/message";
    return http.post(uri, { chatId, parentId, content });
  },
  getUserDailyUsage() {
    const uri = "/api/message/getUserDailyUsage";
    return http.get(uri, {});
  },
  getTokenUsageLimit() {
    const uri = "/api/tokenUsageLimit/list";
    return http.get(uri, {});
  },
  // http://127.0.0.1:8000/api/message/stopAnswer
  stopAnswer(chatId) {
    const uri = "/api/message/stopAnswer";
    return http.post(uri, { chatId });
  },
  // http://localhost:8000/api/messageLog/log?messageId=18561
  getMessageLog(messageId) {
    const uri = "/api/messageLog/log";
    return http.get(uri, { messageId });
  }
};
export default messages;