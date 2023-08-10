<template>
  <div class="outbox">
    <div class="login">
      <h1>{{ systemName }}</h1>
      <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
        <a-tabs
          :activeKey="customActiveKey"
          :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
          @change="handleTabClick"
        >
          <a-tab-pane key="tab1" :tab="$t('login.login')">
            <a-input
              size="large"
              :value="login.newPhone"
              @change="login.newPhone = $event.target.value"
              :placeholder="$t('pleaseEnter', { msg: $t('login.phone') })"
              :class="{ 'is-invalid': login.errors.newPhone }"
            />
            <div class="error-seat">
              <a-alert
                show-icon
                class="invalid-feedback"
                :type="'error'"
                :message="login.errors.newPhone"
                v-if="login.errors.newPhone"
              />
            </div>
            <div class="code-group">
              <a-input
                size="large"
                type="password"
                autocomplete="false"
                :value="login.password"
                @change="login.password = $event.target.value"
                :placeholder="$t('pleaseEnter', { msg: $t('login.password') })"
                :class="{ 'is-invalid': login.errors.password }"
                @keyup.enter="submitPasswordForm"
              />
            </div>
            <div class="error-seat">
              <a-alert
                show-icon
                class="invalid-feedback"
                :type="'error'"
                :message="login.errors.password"
                v-if="login.errors.password"
              />
            </div>
            <a-form-item v-if="isPersonal">
              <a class="forge-password" style="float: left" @click="register">{{ $t("login.register") }}</a>
              <a class="forge-password" style="float: right" @click="forgotpass">{{ $t("login.forgetPassword") }}</a>
            </a-form-item>
            <a-button size="large" type="primary" class="btn-login" @click="submitPasswordForm">{{
              $t("login.login")
            }}</a-button>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { inject, ref, reactive } from "vue";
import { ymPoint } from "@/utils/point.js";
import { useRouter } from "vue-router";
import services from "@/services/index";
import md5 from "js-md5";
import { useLoginStore } from "@/store/modules/user.js";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import leftIcon from "@/assets/leftLine.png";
import rightIcon from "@/assets/rightLine.png";

const EDITION = import.meta.env.VITE_EDITION || "ENTERPRISE";
const isPersonal = computed(() => {
  return EDITION === "PERSONAL";
});

const t = inject("$i18nT");
const loginStore = useLoginStore();
const { systemName } = storeToRefs(loginStore);
const userId = computed(() => loginStore.userId);
// const submit = () => {
//     //测试友盟埋点
//     try {
//         ymPoint("login_click_from_code", "发送验证码操作")
//     } catch (error) {
//         console.log("埋点", error)
//     }
// }
const login = reactive({
  phone: "",
  code: "",
  newPhone: "",
  password: "",
  customActiveKey: "tab1",
  isSending: false,
  buttonText: t("send", { msg: t("login.verificationCode") }),
  errors: {},
  phoneErroe: t("pleaseEnter", { msg: t("login.phone") }),
  time: 60,
});
//切换登录选项
const handleTabClick = () => {
  login.customActiveKey = login.key;
  login.errors = {};
  // this.form.resetFields()
};
const inputPhone = () => {
  console.log("监听输入");
  if (login.phone) {
    login.errors.phone = "";
  }
};

const sendCode = async () => {
  if (!login.phone) {
    login.errors.phone = t("pleaseEnter", { msg: t("login.phone") });
  } else if (!/^1[0-9]{10}$/.test(login.phone)) {
    login.errors.phone = "手机号格式不正确";
  } else {
    // 发送验证码逻辑
    login.errors = {};
    try {
      ymPoint("login_click_from_code", "发送验证码操作");
    } catch (error) {
      console.log("埋点", error);
    }
    login.isSending = true;
    try {
      const resCode = await services.user.sendCode(login.phone);
      if (resCode.code == 0) {
        message.success(t("success", { msg: t("send") }));
      } else {
        login.isSending = false;
        message.error(resCode.message ? resCode.message : "验证码发送失败");
      }
    } catch (error) {
      message.error("发送接口调用失败");
    }
    const interval = window.setInterval(() => {
      if (login.time-- <= 0) {
        login.time = 60;
        login.isSending = false;
        login.buttonText = t("send", { msg: t("login.verificationCode") });
        window.clearInterval(interval);
      } else {
        login.buttonText = login.time + `s${t("send", { msg: t("login.verificationCode") })}`;
      }
    }, 1000);
    // 发送成功后将isSending设为false，按钮文本改为"重新发送"，倒计时60秒
  }
};
//手机号+验证码登录
const submitForm = async () => {
  try {
    ymPoint("login_click_from_phone_code", "手机号+验证码登录操作");
  } catch (error) {
    console.log("埋点", error);
  }
  // 提交表单逻辑
  login.errors = {};
  // 验证表单
  if (!login.phone) {
    login.errors.phone = t("pleaseEnter", { msg: t("login.phone") });
  } else if (!/^1[0-9]{10}$/.test(login.phone)) {
    login.errors.phone = t("login.phoneFormatError");
  }
  if (!login.code) {
    login.errors.code = t("pleaseEnter", { msg: t("login.verificationCode") });
  }
  // 如果表单验证通过，则提交表单
  if (Object.keys(login.errors).length === 0) {
    // 提交表单逻辑手机号+验证码登录
    try {
      const res = await services.user.login(login.phone, login.code);
      if (res.code === 0) {
        message.success(t("success", { msg: t("login.login") }));
        //修改用户id
        loginStore.setUserId(res.data.userId);
        loginStore.setUserInfo({ id: res.data.userId, ...res.data });
        router.push({
          name: "chat",
        });
      } else {
        message.error(res.message ? res.message : t("fail", { msg: t("login.login") }));
      }
    } catch (error) {
      message.error(t("fail", { msg: t("login.login") }));
    }
  }
};
//手机号+密码登录
const submitPasswordForm = async () => {
  try {
    ymPoint("login_click_from_phone_password", "手机号+密码登录操作");
  } catch (error) {
    console.log("埋点", error);
  }
  // 提交表单逻辑
  login.errors = {};
  // 验证表单
  if (!login.newPhone) {
    login.errors.newPhone = t("pleaseEnter", { msg: t("login.phone") });
  } else if (!/^1[0-9]{10}$/.test(login.newPhone)) {
    login.errors.newPhone = t("login.phoneFormatError");
  }
  if (!login.password) {
    login.errors.password = t("pleaseEnter", { msg: t("login.password") });
  } else if (login.password.length < 6) {
    login.errors.password = t("login.passwordFormatError");
  }
  // 如果表单验证通过，则提交表单
  if (Object.keys(login.errors).length === 0) {
    // 提交表单逻辑手机号+密码登录
    try {
      const res = await services.user.phonePassword(login.newPhone, md5(login.password));
      if (res.code === 0) {
        message.success(t("success", { msg: t("login.login") }));
        loginStore.setUserId(res.data.userId);
        // 存储用户信息
        loginStore.setUserInfo({ id: res.data.userId, ...res.data });
        router.push({
          name: "chat",
        });
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error(t("fail", { msg: t("login.login") }));
    }
  }
};
//跳转到注册页面
const router = useRouter();
const register = () => {
  router.push({
    name: "register",
  });
};
const forgotpass = () => {
  router.push({
    name: "forgotpass",
  });
};
</script>

<style lang="scss" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }
}

.outbox {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  min-width: 400px;
  background: #f0f2f5 url(https://really28.gitee.io/vue-antdesign-admin-template-pages/assets/background.5825f033.svg)
    no-repeat 50%;
}

.login {
  min-width: 400px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  .other {
    margin: 20px 0px;
    span {
      margin: 0px 20px;
    }
  }
  .other-login {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

h1 {
  text-align: center;
  font-size: 28px;
  margin-bottom: 40px;
}

.btn-login {
  width: 100%;
  margin-top: 10px;
}

.code-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-send-code {
  margin-left: 10px;
}

button.login-button {
  padding: 0 15px;
  font-size: 16px;
  height: 40px;
  width: 100%;
}

.invalid-feedback {
  background: #fff;
  color: #f5222d;
  font-size: 14px;
  line-height: 1.5;
  border: 0px;
  padding: 0px, 0px;
  display: flex;
}

.error-seat {
  height: 30px;
}

.ant-alert {
  padding: 0px;
}

input {
  border-radius: 4px;
}

button {
  border-radius: 4px;
}

:deep(.ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap, .ant-tabs > div > .ant-tabs-nav .ant-tabs-nav-wrap) {
  justify-content: space-around !important;
}

:deep(.ant-tabs > .ant-tabs-nav .ant-tabs-nav-list, .ant-tabs > div > .ant-tabs-nav .ant-tabs-nav-list) {
  display: contents;
}

:deep(.ant-tabs-tab + .ant-tabs-tab) {
  margin: 0 0 0 0px !important;
}
</style>
<style lang="scss">
@media screen and (max-width: 768px) {
  .outbox {
    min-width: 100% !important;

    .login {
      min-width: auto;
      width: calc(100% - 40px);
    }
  }
}
</style>
