<template>
  <div class="outbox">
    <div class="login">
      <h1>{{ systemName }}</h1>
      <a-input
        size="large"
        :value="login.phone"
        @change="login.phone = $event.target.value"
        :placeholder="$t('pleaseEnter', { msg: $t('login.phone') })"
        :class="{ 'is-invalid': login.errors.phone }"
      />
      <div class="error-seat">
        <a-alert
          show-icon
          class="invalid-feedback"
          :type="'error'"
          :message="login.errors.phone"
          v-if="login.errors.phone"
        />
      </div>
      <div class="code-group">
        <a-input
          size="large"
          :value="login.code"
          @change="login.code = $event.target.value"
          :placeholder="$t('pleaseEnter', { msg: $t('login.verificationCode') })"
          :class="{ 'is-invalid': login.errors.code }"
        />
        <a-button
          size="large"
          class="btn-send-code"
          :loading="false"
          :disabled="login.isSending"
          type="primary"
          @click="sendCode"
          >{{ login.buttonText }}</a-button
        >
      </div>
      <div class="error-seat">
        <a-alert
          show-icon
          class="invalid-feedback"
          :type="'error'"
          :message="login.errors.code"
          v-if="login.errors.code"
        />
      </div>
      <!-- <a-input
        size="large"
        :value="login.invite"
        @change="login.invite = $event.target.value"
        placeholder="请输入邀请码"
        :class="{ 'is-invalid': login.errors.invite }"
      />
      <div class="error-seat">
        <a-alert
          show-icon
          class="invalid-feedback"
          :type="'error'"
          :message="login.errors.invite"
          v-if="login.errors.invite"
        />
      </div> -->
      <div class="code-group">
        <a-input
          type="password"
          size="large"
          :value="login.password"
          @change="login.password = $event.target.value"
          :placeholder="$t('pleaseEnter', { msg: $t('login.password') })"
          :class="{ 'is-invalid': login.errors.password }"
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
      <div class="code-group">
        <a-input
          size="large"
          type="password"
          :value="login.new_password"
          @change="login.new_password = $event.target.value"
          :placeholder="$t('pleaseEnter', { msg: $t('login.confirmPassword') })"
          :class="{ 'is-invalid': login.errors.new_password }"
        />
      </div>
      <div class="error-seat">
        <a-alert
          show-icon
          class="invalid-feedback"
          :type="'error'"
          :message="login.errors.new_password"
          v-if="login.errors.new_password"
        />
      </div>
      <a-form-item>
        <a class="forge-password" style="float: left" @click="loginButton">{{ $t("login.haveAccount") }}</a>
      </a-form-item>
      <a-button size="large" type="primary" class="btn-login" @click="submitForm">{{ $t("login.register") }}</a-button>
    </div>
  </div>
</template>
<script setup>
import { inject, ref, reactive } from "vue";
import { ymPoint } from "@/utils/point.js";
import { useRouter } from "vue-router";
import services from "@/services/index";
import md5 from "js-md5";
import { message } from "ant-design-vue";

import { useLoginStore } from "@/store/modules/user.js";
import { storeToRefs } from "pinia";

const t = inject("$i18nT");
const loginStore = useLoginStore();
const { systemName } = storeToRefs(loginStore);

const login = reactive({
  phone: "",
  code: "",
  isSending: false,
  buttonText: t("send", { msg: t("login.verificationCode") }),
  errors: {},
  time: 60,
  password: "",
  new_password: "",
});
const sendCode = async () => {
  if (!login.phone) {
    login.errors.phone = t("pleaseEnter", { msg: t("login.phone") });
  } else if (!/^1[0-9]{10}$/.test(login.phone)) {
    login.errors.phone = t('login.phoneFormatError');
  } else {
    // 发送验证码逻辑
    login.errors = {};
    try {
      ymPoint("login_click_from_code_register", "注册发送验证码操作");
    } catch (error) {
      console.log("埋点", error);
    }
    login.isSending = true;
    try {
      const resCode = await services.user.sendCode(login.phone);
      if (resCode.code == 0) {
        message.success(t("success", { msg: t("send") }));
      } else {
        message.error(resCode.message ? resCode.message : "验证码发送失败");
      }
    } catch (error) {
      message.error(t("fail", { msg: t("send") }));
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

const submitForm = async () => {
  // 提交表单逻辑
  login.errors = {};
  console.log("打印手机号", login.phone);
  // 验证表单
  if (!login.phone) {
    login.errors.phone = t("pleaseEnter", { msg: t("login.phone") });
  } else if (!/^1[0-9]{10}$/.test(login.phone)) {
    login.errors.phone = t("login.phoneFormatError");
  }
  if (!login.code) {
    login.errors.code = t("pleaseEnter", { msg: t("login.verificationCode") });
  }
  // if (!login.invite) {
  //   login.errors.invite = t("pleaseEnter", { msg: t("login.invitationCode") });
  // }
  if (!login.password) {
    login.errors.password = t("pleaseEnter", { msg: t("login.password") });
  } else if (login.password.length < 6) {
    login.errors.password = t("login.passwordFormatError");
  }
  if (!login.new_password) {
    login.errors.new_password = t("pleaseEnter", { msg: t("login.confirmPassword") });
  } else if (login.new_password.length < 6) {
    login.errors.new_password = t("login.passwordFormatError");
  }
  if (login.new_password != login.password) {
    login.errors.password = t("login.confirmPasswordError");
    login.errors.new_password = t("login.confirmPasswordError");
  }
  // 如果表单验证通过，则提交表单
  if (Object.keys(login.errors).length === 0) {
    try {
      ymPoint("login_click_from_signup", "点击注册按钮");
    } catch (error) {
      console.log("埋点", error);
    }
    // 提交表单逻辑手机号+验证码登录
    try {
      const res = await services.user.signup(login.phone, login.code, md5(login.password), login.invite);
      if (res.code === 0) {
        message.success(t("success", { msg: t("login.register") }));
        router.push({
          name: "chat",
        });
      } else {
        message.error(res.message ? res.message : t("fail", { msg: t("login.register") }));
      }
    } catch (error) {
      message.error(t("fail", { msg: t("login.register") }));
    }
  }
};
//跳转到登录页面
const router = useRouter();
const loginButton = () => {
  router.push({
    name: "login",
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
