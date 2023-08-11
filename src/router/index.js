import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/view/home/Index.vue";
import { message } from "ant-design-vue";
import { useLoginStore } from "@/store/modules/user.js";
import services from "@/services/index";
import i18n from '@/locals/index'

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/chatbot/chat",
    // component: () =>
    //   import(/* webpackChunkName: "chat" */ "@/view/chatbot/Index.vue"),
  },
  {
    path: "/chatbot/",
    name: "chatbot",
    component: () =>
      import(/* webpackChunkName: "chat" */ "@/view/chatbot/Index.vue"),
    meta: {
      requireAuth: true
    },
    children: [
      {
        path: "/market/:templateInfoId/:chainTemplateId?/:uploaderName?",
        name: "chainDetail",
      },
      {
        path: 'chat/:chatId?',
        name: 'chat',
      }, {
        path: 'bot/:botId?',
        name: 'bot',
      }, {
        path: 'chain/:chainId?',
        name: 'chain',
      }]
  },
  {
    path: "/chatgpt",
    name: "chatgpt",
    component: () =>
      import(/* webpackChunkName: "chat" */ "@/view/chatgpt/Index.vue"),
  },
  {
    path: "/application",
    name: "application",
    component: () =>
      import(/* webpackChunkName: "chat" */ "@/view/application/Index.vue"),
  },
  {
    path: "/invite",
    name: "invite",
    component: () =>
      import(/* webpackChunkName: "chat" */ "@/view/invite/Index.vue"),
  },
  {
    path: "/analyze",
    name: "analyze",
    component: () =>
      import(/* webpackChunkName: "chat" */ "@/view/chatgpt/Analyze.vue"),
  },
  {
    path: "/workflow",
    name: "workflow",
    component: () =>
      import(/* webpackChunkName: "chat" */ "@/view/Workflow.vue"),
  },
  {
    path: "/price",
    name: "price",
    component: () =>
      import(/* webpackChunkName: "chat" */ "@/view/price/Price.vue"),
  },
  {
    path: "/login",
    name: "login",
    redirect: "/chatbot/chat",
    // component: () =>
    //   import(/* webpackChunkName: "chat" */ "@/view/login/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    redirect: "/chatbot/chat",
    // component: () =>
    //   import(/* webpackChunkName: "chat" */ "@/view/login/Register.vue"),
  },
  {
    path: "/forgotpass",
    name: "forgotpass",
    redirect: "/chatbot/chat",
    // component: () =>
    //   import(/* webpackChunkName: "chat" */ "@/view/login/Forgotpass.vue"),
  },
  {
    path: "/chainflow/:chainId?",
    name: "chainflow",
    component: () =>
      import(/* webpackChunkName: "chat" */ "@/view/chainflow/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const loginStore = useLoginStore();
  const userId = loginStore.userId;
  console.log("id", to.meta.requireAuth, to);

  services.user.getSystemName().then((res) => {
    if (res.code === 0) {
      loginStore.setSystemName(res.data || "Hexdo");
      //设置页面title
      if (to.meta) {
        document.title = to.meta.title || loginStore.systemName;
      }
    }
  });
  if (to.meta.requireAuth) {
    if (!userId || userId === "") {
      services.user.getUserInfo().then((res) => {
        console.log(res);
        if (res.code === 0) {
          loginStore.setUserId(res.data.userId);
          loginStore.setUserInfo(res.data);
          console.log(userId, "name");
          if (to.name === 'login' || to.name === 'Home') {
            router.push('/chatbot/home');
          } else {
            next();
          }
        } else {
          console.log("jump to login", to.name);
          if (to.name === "login") {
            next();
          } else if (to.name === "Home") {
            next({ name: "login" });
          } else {
            router.push("/login");
            message.error({
              content: i18n.global.t('login.pleaseLogin'),
            });
          }
        }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
