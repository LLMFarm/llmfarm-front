import axios from "axios";
import { computed } from "vue";
// import { useRouter } from "vue-router";
import { useLoginStore } from "@/store/modules/user.js";
// import { createPinia } from "pinia";

import { createApp } from "vue";
import App from "@/App.vue";
const app = createApp(App);

import { createPinia } from "pinia";
const pinia = createPinia();
app.use(pinia);

//友盟初始化
(function (w, d, s, q, i) {
  w[q] = w[q] || [];
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s);
  j.async = true;
  j.id = "beacon-aplus";
  j.src = "https://d.alicdn.com/alilog/mlog/aplus/" + i + ".js";
  f.parentNode.insertBefore(j, f);
})(window, document, "script", "aplus_queue", "203467608");

//集成应用的appKey
aplus_queue.push({
  action: "aplus.setMetaInfo",
  arguments: ["appKey", "64476ab87dddcc5bad3acdc5"],
});

//evenId代表事件id，如：login_click_from_code（登录页面_点击_表单_验证码），规则是：页面名称+前缀+后缀+备注描述，自己定义完后，需要添加到友盟，
//前缀
// click_：表示点击事件。
// scroll_：表示滚动事件。
// view_：表示视图事件，例如页面加载、广告展示等。
// submit_：表示表单提交事件。
// input_：表示输入事件，例如用户在输入框中输入文本等。
// hover_：表示鼠标悬停事件。
// search_：表示搜索事件，例如用户在搜索框中输入关键词等。
// play_：表示播放事件，例如用户点击播放按钮播放视频或音频等。
// share_：表示分享事件，例如用户分享内容到社交媒体上等。
// like_：表示点赞事件，例如用户给某个内容点赞等。
//后缀
// button：表示按钮事件，例如用户点击了一个按钮。
// link：表示链接事件，例如用户点击了一个链接。
// form：表示表单事件，例如用户提交了一个表单。
// video：表示视频事件，例如用户播放了一个视频。
// audio：表示音频事件，例如用户播放了一段音频。
// page_view：表示页面浏览事件，例如用户浏览了一个页面。
// modal：表示弹出框事件，例如用户打开或关闭了一个弹出框。
// menu：表示菜单事件，例如用户点击了一个菜单项。
// tab：表示标签事件，例如用户切换了一个标签。
// image：表示图片事件，例如用户点击了一张图片。
//enentType代表事件类型，规则是：页面+事件描述；比如：登录按钮点击
const loginStore = useLoginStore();
const userId = computed(() => loginStore.userId);
console.log("ZUIXIN userid", userId);
export const ymPoint = (evenId, enentType) => {
  window.aplus_queue.push({
    action: "aplus.record",
    arguments: [evenId, enentType, { userId: userId }],
  });
};
