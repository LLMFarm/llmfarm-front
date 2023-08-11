import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

//引入友盟文件
import "@/utils/point.js";

import store from "./store";
import router from "./router";

const app = createApp(App);

app.use(store);
app.use(router);

// 引入 pinia
import { createPinia } from "pinia";
const pinia = createPinia();
app.use(pinia);

// 引用 element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
app.use(ElementPlus);

// antd 组件
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
// import vuePlugin from '@vitejs/plugin-vue';
app.use(Antd);

import * as ElementPlusIconsVue from "@element-plus/icons-vue";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 代码渲染
import "prismjs/themes/prism-okaidia.css";

// 挂载全局 $service
import service from "@/services/index";
app.config.globalProperties.$service = service;
app.config.unwrapInjectedRef = true;

import i18n from './locals'
app.provide("$i18nT", i18n.global.t)
app.use(i18n)

app.mount("#app");
