<template>
  <template v-if="domain.control">
    <template v-if="domain.control.type == 'select'">
      <a-select
        v-model:value="domain.value"
        :filter-option="filterOption"
        :options="domain.control.options"
        show-search
        :placeholder="`${$t('pleaseEnter')}${domain.label}`"
        :disabled="disabled"
        style="width: 100%"
    /></template>
    <template v-else-if="domain.control.type == 'checkbox'">
      <a-checkbox-group v-model:value="domain.value" :options="domain.control.options" />
    </template>
    <template v-else-if="domain.control.type == 'upload'">
      <div class="upload-bottom">
        <div v-if="domain.value" class="file-list">
          <a-image :src="domain.value" alt="avatar" />
        </div>
        <div class="upload" @click="upload">
          <div>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <!-- <div class="ant-upload-text">图片上传</div> -->
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="domain.control.type == 'textarea'">
      <a-textarea
        v-model:value="domain.value"
        mode="multiple"
        :placeholder="`${$t('pleaseEnter')}${domain.label}`"
        show-count
        :maxlength="100"
      >
      </a-textarea>
    </template>
  </template>
  <template v-else>
    <a-input
      v-model:value="domain.value"
      :placeholder="`${$t('pleaseEnter')}${domain.label}`"
      style="width: 100%"
      :disabled="disabled || domain.disabled"
    />
  </template>
</template>
<script setup>
import { computed, ref, inject } from "vue";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import services from "@/services/index.js";
import { message } from "ant-design-vue";

const props = defineProps({
  domain: {
    type: Object,
    default: {},
  },
  formDisabled: {
    type: Boolean,
    default: false,
  },
});
const t = inject("$i18nT");
const loading = ref(false);
const disabled = computed(() => {
  return props.formDisabled;
});
const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const limitFileSize = (file) => {
  let maxFileSize = 1024 * 1024 * 30;
  return file.size >= maxFileSize;
};

// 上传文件
const upload = () => {
  if (loading.value) return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (limitFileSize(file)) {
        message.error("资源大小超出限制,最多上传30MB!");
        return;
      }
      uploadFile(file).then((res) => {
        if (res.code === 0) {
          message.success(t("success", { msg: t("library.upload") }));
          props.domain.value = res.data;
        } else {
          message.error(res.message);
        }
      });
    }
  };
  input.click();
};

//上传文件
const uploadFile = (file) => {
  // 获取当前时间
  // let nowTime = new Date().toLocaleString();
  // fileList.value.unshift({ name: file.name, createTime: nowTime });
  return new Promise((resolve, reject) => {
    const options = {
      file,
    };
    console.log(options, "options");
    const formData = new FormData();
    Object.keys(options).map((k) => {
      formData.append(k, options[k]);
    });
    console.log(formData);

    loading.value = true;
    services.bot
      .getFileOss(formData)
      .then((res) => {
        console.log(res);
        loading.value = false;
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const handleChange = (info) => {
  console.log("info", info);
  uploadFile(info.file)
    .then((res) => {
      console.log(res);
      fileList.value.unshift(res.data);
      message.success(t("success", { msg: t("library.upload") }));
    })
    .catch((err) => {
      message.error(t("fail", { msg: t("library.upload") }));
    });
};
</script>
<style lang="scss">
.upload {
  width: 128px;
  height: 128px;
  border: 1px dashed #d9d9d9;
  border-radius: 2px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.file-list {
  width: 128px;
  height: 128px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.upload-bottom {
  display: flex;
}
</style>
