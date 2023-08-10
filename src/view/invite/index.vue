<template>
  <div class="outbox">
    <div class="body">
      <div class="title1">内测声明</div>
      <div class="title">
        <p>尊敬的用户:</p>
        <p>感谢您对我们产品的关注与支持！我们目前处于内测阶段，诚挚地邀请您成为我们的内测体验用户。</p>
        <p>
          作为内测体验用户，您将有机会提前体验我们产品的独特功能和特性，您的反馈对我们的产品发展至关重要。您的参与将帮助我们完善产品，并确保它能够满足您的需求和期望。
        </p>

        <p>
          如果您对成为内测体验用户感兴趣，请您提交申请。我们将根据您的申请内容和一系列筛选标准，挑选合适的用户进行内测体验。一旦您被选中，我们将通过短信通知您。
        </p>

        <!-- <p>请理解我们目前无法向所有用户开放，但我们将竭尽全力提供最佳的产品体验。感谢您的耐心与支持！ 祝好!</p> -->
        <p>宜创（北京）科技有限公司</p>
      </div>
      <div class="to">
        <div class="register">
          <div class="jump" @click="toRegister">
            <arrow-left-outlined /><span class="text">已有邀请码？</span><a>立即注册</a>
          </div>
        </div>
        <div class="application">
          <div class="jump" @click="toApplication"><a>立即申请</a> <arrow-right-outlined /></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { getCurrentInstance, ref, reactive } from "vue";
import { ymPoint } from "@/utils/point.js";
import { useRouter } from "vue-router";
import services from "@/services/index";
import md5 from "js-md5";
import { useLoginStore } from "@/store/modules/user.js";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons-vue";
const router = useRouter();
const toApplication = () => {
  router.push({ name: "application" });
};
const toRegister = () => {
  router.push({ name: "register" });
};
</script>

<style lang="scss" scoped>
.outbox {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  min-width: 400px;
  background: #f0f2f5 url(https://really28.gitee.io/vue-antdesign-admin-template-pages/assets/background.5825f033.svg)
    no-repeat 50%;
  .body {
    width: 70%;
    height: 70%;
    max-width: 900px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 24px;

    display: flex;
    flex-direction: column;
    .title {
      width: 100%;
      font-size: 16px;
      color: #2b2b2b;
      line-height: 43px;
      text-align: left;
      font-weight: 500;
      p {
        text-indent: 2em;
        margin-bottom: 12px;
      }
    }
    .title1 {
      text-align: center;
      font-size: 26px;
      font-weight: 500;
      color: #2b2b2b;
      margin-bottom: 12px;
    }
    .to {
      height: 100%;
      display: flex;
      div {
        width: 50%;
        height: 100%;
        position: relative;
      }
      .register {
        .jump {
          left: 0;
          bottom: 0;
        }
      }
      .application {
        .jump {
          right: 0;
          bottom: 0;
        }
      }
      .jump {
        height: fit-content;
        width: fit-content;
        position: absolute;
        padding: 16px;
        background: #fff;
        border-radius: 8px;
        border: 1px solid #e7e9e8;
        margin-bottom: 16px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: 0.3s;
        cursor: pointer;
        &:hover {
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          background-color: #eff0f0;
        }
        :deep(.anticon) {
          margin: 0 6px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
@media screen and (max-width: 767px) {
  .outbox {
    min-width: fit-content !important;
    .body {
      width: 100vw !important;
      height: 100vh !important;
      overflow: auto !important;
      padding-bottom: 72px !important;
      .to {
        height: fit-content !important;
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0px;
        padding: 0 24px;
        display: flex !important;
        justify-content: space-between;
        .register {
          height: fit-content !important;
          width: fit-content !important;
        }
        .application {
          height: fit-content !important;
          width: fit-content !important;
        }
        .jump {
          height: fit-content !important;
          width: fit-content !important;
          position: relative !important;
          .text {
            display: none;
          }
        }
      }
    }
  }
}
</style>
