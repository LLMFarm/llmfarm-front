import http from "@/utils/http.js";
const prefix = "/api/chat/";
const chat = {
  chatList(keyword, type) {
    const uri = prefix + "list";
    return http.get(uri, { keyword: keyword, type: type });
  },
  updateChat(name, chatId) {
    const uri = prefix;
    return http.put(uri, { name: name, chatId: chatId });
  },
  deleteChat(chatId) {
    const uri = prefix;
    return http.del(uri, { chatId: chatId });
  },
  clear() {
    const uri = prefix + "clear";
    return http.post(uri, {});
  },
  updateChatContextType(chatId, contextType) {
    const uri = prefix + "contextType";
    return http.put(uri, { chatId, contextType });
  }
};
export default chat;