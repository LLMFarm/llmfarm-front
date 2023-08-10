import axios from "axios";

const language = (navigator.language || "en").toLocaleLowerCase(); // 这是获取浏览器的语言
const useLocale = localStorage.getItem("lang") || language.split("-")[0] || "en";

// 设置 post 请求头
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
// 在跨域请求时，不会携带用户凭证；返回的 response 里也会忽略 cookie
axios.defaults.withCredentials = false;

console.log("环境变量", import.meta.env);
// 创建 axios 实例, 请求超时时间为 10 秒
const instance = axios.create({
  baseURL: import.meta.env.BASE_URL,
  // baseURL: 'https://chatplus.wuwei-prod.wudaima.com',
  timeout: 100000,
});

// 请求发起前拦截
instance.interceptors.request.use(
  (config) => {
    //这里可以对接口请求头进行操作 如：config.headers['X-Token'] = token
    // console.log("请求拦截", config);
    config.headers['Content-Language'] = useLocale === "zh" ? "zh-CN" : 'en';

    if (config.url === '/api/uploadOss' || config.url === '/api/getFileOss') {
      //上传图片到图库请求头处理
      console.log("/api/upload");
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 响应拦截（请求返回后拦截）
instance.interceptors.response.use(
  (res) => {
    //console.log('res', res),返回接口中只有一层data
    if (res.data) {
      return res.data;
    }
    return res;
  },
  (error) => {
    console.log("catch", error);
    return Promise.reject(error);
  }
);

const http = {
  get(url, params) {
    return instance.get(url, { params: params });
  },
  post(url, params, header = {}) {
    // console.log("post", url, params);
    const options = {
      url,
      method: "POST",
      data: params,
      headers: Object.assign({ 'Content-Type': 'application/json' }, header),
    }
    // console.log('options', options)
    return instance.request(options);
  },
  put(url, params) {
    return instance.put(url, params);
  },
  del(url, params) {
    return instance.delete(url, { params: params });
  },
};

export default http;
