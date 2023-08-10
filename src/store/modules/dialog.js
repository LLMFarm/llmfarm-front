import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useDialogStore = defineStore('dialog', {
  state: () => ({
    dialogTree: {}, // 会话树
    lastDialogId: "ROOT", // 当前最后的对话
    genStatus: false, //对话生成状态
  }),
  actions: {
    initDialogTree(dialogTree) {
      Object.keys(dialogTree).forEach((key) => {
        dialogTree[key].realId = dialogTree[key].id;
        if (dialogTree[key].children.length > 0) {
          dialogTree[key].children.forEach((child) => {
            console.log("dialogTree[child].active", typeof dialogTree[child].active);

            if (typeof dialogTree[child].active == "undefined") {
              dialogTree[child].active = 0;
            }
          });
          if (typeof dialogTree[dialogTree[key].children[0]].active == "undefined") {
            dialogTree[dialogTree[key].children[0]].active = 1;
          }
        }
      });
      console.log("initDialogTree", dialogTree);
      this.dialogTree = dialogTree;
    },
    setLastDialogId(dialogId) {
      this.lastDialogId = dialogId;
    },
    setGenStatus(status) {
      this.genStatus = status;
    },
    updateTreeContext(id, context) {
      this.dialogTree[id].context = context;
    },
    genDialog(context, type, parentId,botName,icon) {
      const UUID = uuidv4();
      const genDialog = {
        id: UUID,
        botName:botName,
        icon:icon,
        message: {
          id: UUID,
          author: {
            role: type,
          },
          content: {
            content_type: "text",
            parts: [context]
          },
        },
        parent: parentId || this.lastDialogId,
        children: [],
        active: 1,
      }
      this.dialogTree[UUID] = genDialog;
      this.dialogTree[parentId || this.lastDialogId].children.push(UUID);
      return genDialog;
    },
    genAnswer(treeNode, context) {
      const nodeId = treeNode.id;
      this.dialogTree[nodeId].message.content.parts[0] += context;
    },
    saveDialog(dialog, id) {
      this.dialogTree[dialog.id].realId = id;
    },
    clearDialogTree() {
      this.dialogTree = {};
      this.lastDialogId = "ROOT";
    }
  },
  // persist: true,
  // plugins: [createPersistedState()]
})