import http from "@/utils/http.js";

const prefix = "/api/scenario/";
const share = {
  // http://127.0.0.1:8000/api/chainBotUserRelation
  chainBotUserRelationList(relationId, relationType) {
    console.log("===============", relationId, relationType);
    const uri = "/api/chainBotUserRelation";
    return http.get(uri, { relationId, relationType });
  },
  // http://127.0.0.1:8000/api/chainBotUserRelation
  addChainBotUserRelation(relationId, relationType, userPermission, phone) {
    const uri = "/api/chainBotUserRelation";
    return http.post(uri, { relationId, relationType, userPermission, phone });
  },
  // http://127.0.0.1:8000/api/chainBotUserRelation
  updateChainBotUserRelation(id, userId, userPermission) {
    const uri = "/api/chainBotUserRelation";
    return http.put(uri, { id, userId, userPermission });
  },
  // http://127.0.0.1:8000/api/chainBotUserRelation
  deleteChainBotUserRelation(relationId, relationType, userId) {
    const uri = "/api/chainBotUserRelation";
    return http.del(uri, { relationId, relationType, userId });
  }
};
export default share;
