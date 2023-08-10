import { defineStore } from "pinia";

export const useLibraryStore = defineStore("library", {
  state: () => ({
    fileList: [],
    libraryList: [],
    dataSetList: [],
    selectDataSetVector: {},
    selectedDataSetId: 0,
  }),
  actions: {
    setFileList(list) {
      this.fileList = list?.map((item) => {
        return {
          ...item.file,
          createUser: item.userInfo?.name || "暂无",
        };
      });
    },
    addFile(info) {
      this.fileList.push(info);
    },
    setLibraryList(list) {
      if (list == null) {
        list = [];
      }
      this.libraryList = list?.map((item) => {
        return { ...item, createUser: item.userInfo?.name || "暂无" };
      });
      //console.log("libraryList=========",this.libraryList)
    },
    addLibrary(info) {
      this.libraryList.unshift(info);
    },
    deleteLibrary(id) {
      this.libraryList = this.libraryList.filter((item) => item.id !== id);
    },
    setDataSetList(list) {
      this.dataSetList = list;
    },
    setSelectDataSetVector(info) {
      this.selectDataSetVector = info;
    },
    updateDocuments(list) {
      this.selectDataSetVector.documents.push(...list);
    },
    setSelectedDataSetId(id) {
      this.selectedDataSetId = id;
    },
  },
});
