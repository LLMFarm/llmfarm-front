<template>
  <div class="outbox">
    <div class="login">
      <p class="maintitle">欢迎申请加入LLM Farm平台</p>
      <p class="subtitle">平台目前处于内测阶段，暂不对外开放，请您填写申请信息</p>
      <template v-if="!applyStatus">
        <div style="display: flex; align-items: center; height: calc(100% - 100px)">
          <div class="form">
            <a-form
              ref="formRef"
              name="dynamic_form_item"
              :model="dynamicValidateForm"
              layout="vertical"
              :rules="dynamicRules"
            >
              <a-form-item
                v-for="(domain, index) in domains"
                :key="domain.key"
                :label="domain.label"
                :name="domain.key"
              >
                <a-checkbox-group
                  v-model:value="dynamicValidateForm[domain.key]"
                  :options="domain.options"
                  v-if="domain.type == 'checkbox'"
                />
                <a-textarea
                  v-model:value="dynamicValidateForm[domain.key]"
                  mode="multiple"
                  :placeholder="domain.label"
                  :auto-size="{ minRows: 4, maxRows: 6 }"
                  v-else-if="domain.type == 'textarea'"
                >
                </a-textarea>
                <a-select
                  :placeholder="domain.label"
                  v-model:value="dynamicValidateForm[domain.key]"
                  :options="domain.options"
                  :filter-option="filterOption"
                  v-else-if="domain.type === 'select'"
                >
                </a-select>
                <a-input
                  v-model:value="dynamicValidateForm[domain.key]"
                  mode="multiple"
                  :placeholder="domain.label"
                  v-else
                >
                </a-input>
              </a-form-item>
              <!-- <a-form-item :key="tables" label="选择数据库表" :name="tables"> </a-form-item> -->
              <!-- <a-form-item label="邀请码">
              <a-input v-model:value="code" placeholder="请输入邀请码"></a-input>
              <span style="color: red; font-size: 12px">输入邀请码则无需等待审核</span>
            </a-form-item> -->
            </a-form>
            <a-form-item>
              <a-checkbox-group v-model:value="isAgree">
                <a-checkbox value="true" name="type"
                  ><span
                    >{{ $t("agree")
                    }}<span style="color: #1890ff" @click.stop="toStatement">《个人信息授权声明》</span></span
                  ></a-checkbox
                >
              </a-checkbox-group></a-form-item
            >
            <a-form-item>
              <a-button style="width: 100%" type="primary" @click="onSubmit">提交申请</a-button></a-form-item
            >
          </div>
          <div class="QRcode">
            <img
              src="https://hexyun.oss-cn-beijing.aliyuncs.com/62c9626a1e35d95d493e1f19/etwrzghmwygaktmbb7djjcjmgy8kkkx2.jpg?t=1685695684500"
            />
            <span>扫码绑定微信号，接收平台重要通知</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="apply-status">已申请，等待审核中</div>
      </template>
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
const domains = ref([
  {
    key: "name",
    label: "姓名",
    type: "string",
  },
  {
    key: "phone",
    label: "手机号码",
    type: "string",
  },
  {
    key: "host",
    label: "你所在的企业/单位名称",
    type: "string",
  },
  {
    key: "host1",
    label: "请选择你的岗位",
    type: "select",
    options: [
      {
        label: "技术开发",
        value: "技术开发",
      },
      {
        label: "创意设计",
        value: "创意设计",
      },
      {
        label: "市场营销",
        value: "市场营销",
      },
      {
        label: "运营主管",
        value: "运营主管",
      },
      {
        label: "行政助理",
        value: "行政助理",
      },
      {
        label: "人力资源",
        value: "人力资源",
      },
      {
        label: "财务管理",
        value: "财务管理",
      },
      {
        label: "客户服务",
        value: "客户服务",
      },
      {
        label: "董事/高管",
        value: "董事/高管",
      },
      {
        label: "自由职业/学生",
        value: "自由职业/学生",
      },
      {
        label: "其它",
        value: "其它",
      },
    ],
  },
  {
    key: "host2",
    label: "你希望如何使用我们平台",
    type: "textarea",
    options: [
      {
        label: "办公助手",
        value: "办公助手",
      },
      {
        label: "客户服务",
        value: "客户服务",
      },
      {
        label: "营销创新",
        value: "营销创新",
      },
      {
        label: "智慧金融",
        value: "智慧金融",
      },
      {
        label: "媒体编辑",
        value: "媒体编辑",
      },
      {
        label: "智能汽车",
        value: "智能汽车",
      },
      {
        label: "在线教育",
        value: "在线教育",
      },
      {
        label: "智慧医疗",
        value: "智慧医疗",
      },
      {
        label: "其它",
        value: "其它",
      },
    ],
  },
  {
    key: "host3",
    label: "请描述你的需求场景",
    type: "textarea",
  },
]);
const formRef = ref();
const code = ref("");
const isAgree = ref("false");
const dynamicValidateForm = reactive({ name: "", phone: "", host: "", host1: null, host2: "", host3: "" });
const dynamicRules = ref({
  name: [
    {
      required: true,
      message: "请填写您的姓名",
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: "请填写您的手机号码",
      trigger: "blur",
    },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  host: [
    {
      required: true,
      message: "请填写真实企业/单位名称",
      trigger: "blur",
    },
  ],
  host1: [
    {
      required: true,
      message: "请选择您的岗位",
    },
  ],
  host2: [
    {
      required: true,
      message: "请输入你希望如何使用我们平台",
      trigger: "blur",
    },
  ],
});

// 申请状态
const applyStatus = ref(false);
const toStatement = () => {
  window.open("https://wudaima.yuque.com/wudaima/whx3gz/pdrmuhil6g46cgpe?singleDoc#");
};
const onSubmit = () => {
  //判断是否同意声明
  if (isAgree.value == "false" || isAgree.value[0] == undefined) {
    message.warning("请勾选同意《个人信息授权声明》");
    return;
  }
  formRef.value
    .validateFields()
    .then(() => {
      console.log("values", dynamicValidateForm.value);
      let enterpriseName = dynamicValidateForm["host"];
      let post = dynamicValidateForm["host1"];
      let purpose = dynamicValidateForm["host2"];
      //把purpose数组转字符串，分隔
      // purpose = purpose.join(",");
      let requirementScenario = dynamicValidateForm["host3"];
      let userName = dynamicValidateForm["name"];
      let phone = dynamicValidateForm["phone"];
      //调用接口
      services.user
        .userApplication(enterpriseName, post, purpose, requirementScenario, code, userName, phone)
        .then((res) => {
          if (res.code === 0) {
            message.success(t("success", { msg: t("submit") }));
            applyStatus.value = true;
          } else {
            message.warning(res.message);
          }
        });
    })
    .catch((error) => {
      console.log("error", error);
    });
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
  .login {
    width: 60%;
    min-width: 800px;
    height: 80%;
    overflow-y: auto;
    background: #fff;
    border-radius: 6px;
    padding: 40px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    :deep(.ant-form-item) {
      margin-bottom: 18px;
    }
    .maintitle {
      width: 100%;
      font-size: 24px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2b2b2b;
      line-height: 33px;
      text-align: center;
    }
    .subtitle {
      width: 100%;
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #2b2b2b;
      line-height: 25px;
      text-align: center;
    }
    .form {
      width: 50%;
      height: 100%;
      :deep(.ant-form) {
        height: calc(100% - 124px);
        overflow: auto;
      }
    }
    .QRcode {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 150px;
        height: 150px;
        margin-bottom: 20px;
      }
    }
    .apply-status {
      text-align: center;
      font-size: 24px;
      font-weight: 500;
      height: calc(100% - 124px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
<style lang="scss">
@media screen and (max-width: 767px) {
  .login {
    width: 100vw !important;
    padding: 24px !important;
    height: 100vh !important;
    overflow: hidden !important;
    min-width: fit-content !important;
    .form {
      width: 100% !important;
    }
    .QRcode {
      display: none !important;
    }
  }
}
</style>
