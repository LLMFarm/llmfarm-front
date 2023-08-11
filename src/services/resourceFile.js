import http from "@/utils/http.js";

const prefix = "/api/file";
const resourceFile = {
  // http://127.0.0.1:8000/api/file/updateList
  updateList(idList) {
    const uri = prefix + "/updateList";
    return http.post(uri, { idList });
  },
  // http://127.0.0.1:8000/api/file/parse
  parse(id) {
    const uri = prefix + "/parse";
    return http.post(uri, { id });
  },
  // http://127.0.0.1:8000/api/file/list
  list() {
    const uri = prefix + "/list";
    return http.get(uri);
  },
  // http://127.0.0.1:8000/api/file
  update(id, name) {
    const uri = prefix;
    return http.put(uri, { id, name });
  },
  // delete http://127.0.0.1:8000/api/file
  delete(id) {
    const uri = prefix;
    return http.del(uri, { id });
  },
  // http://127.0.0.1:8000/api/file/addFiles
  addFiles(libId, fileIds) {
    const uri = prefix + "/addFiles";
    return http.post(uri, { libId, fileIds });
  },
};
export default resourceFile;
