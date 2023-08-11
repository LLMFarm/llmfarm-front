import http from "@/utils/http.js";

const prefix = "/api/user/";
const login = {
  login(phone, code) {
    const uri = prefix + "loginByVerify";
    return http.post(uri, { phone: phone, code: code });
  },
  sendCode(phone) {
    const uri = prefix + "send";
    return http.post(uri, { phone: phone });
  },
  phonePassword(username, password) {
    const uri = prefix + "login";
    return http.post(uri, { username: username, password: password });
  },
  signup(phone, code, password) {
    const uri = prefix + "signup";
    return http.post(uri, { phone: phone, code: code, password: password });
  },
  logOut() {
    const uri = prefix + "signout";
    return http.post(uri);
  },
  getUserInfo() {
    const uri = prefix + "get";
    return http.get(uri);
  },
  forget(phone, code, password) {
    const uri = prefix + "forget";
    return http.post(uri, { phone: phone, code: code, password: password });
  },
  // /api/sysConfig/systemName
  getSystemName() {
    const uri = "/api/sysConfig/systemName";
    return http.get(uri);
  },
  userApplication(enterpriseName, post, purpose, requirementScenario, code, userName, phone) {
    const uri = "/api/userApplication";
    return http.post(uri, { enterpriseName, post, purpose, requirementScenario, code, userName, phone })
  },
  // http://localhost:8000/api/user/getUserInfo
  getUserDetail() {
    const uri = "/api/user/getUserInfo";
    return http.get(uri);
  },
  // /api/user/loginGoogle
  loginGoogle(IdToken) {
    const uri = "/api/user/loginGoogle";
    return http.post(uri, { IdToken });
  },
};
export default login;
