import http from "@/utils/http.js";

const prefix = "/api/folder";
const resourceLibrary = {
  // http://127.0.0.1:8000/api/folder/getFiles
  getFiles(folderId) {
    const uri = prefix + "/getFiles";
    return http.post(uri, { folderId });
  },
  // http://127.0.0.1:8000/api/folder/list
  list() {
    const uri = prefix + "/list";
    return http.get(uri);
  },
  // http://127.0.0.1:8000/api/folder
  create(name, fileIds) {
    const uri = prefix;
    return http.post(uri, { name, fileIds });
  },
  // http://127.0.0.1:8000/api/folder/addFiles
  addFiles(folderId, fileIds) {
    const uri = prefix + "/addFiles";
    return http.post(uri, { folderId, fileIds });
  },
  // http://127.0.0.1:8000/api/folder/detail
  detail(id) {
    const uri = prefix + "/detail";
    return http.post(uri, { id });
  },
  // delete http://127.0.0.1:8000/api/folder
  delete(id) {
    const uri = prefix;
    return http.del(uri, { id });
  },
  // http://127.0.0.1:8000/api/resourceLibrary
  update(id, name) {
    const uri = prefix;
    return http.put(uri, { id, name });
  },
  // http://127.0.0.1:8000/api/folder/subFiles
  subFiles(folderId, fileIds) {
    const uri = prefix + "/subFiles";
    return http.post(uri, { folderId, fileIds });
  },
};
export default resourceLibrary;
