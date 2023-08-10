<template>
  <a-form ref="formRef" name="dynamic_form_item" :model="dynamicValidateForm" layout="vertical" :rules="formRules">
    <a-form-item v-for="(domain, index) in domains" :key="domain.key" :label="domain.label" :name="domain.key">
      <FormItem :domain="domain" :formDisabled="disabled"></FormItem>
    </a-form-item>
  </a-form>
</template>
<script setup>
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { reactive, ref, computed, watch } from "vue";
import FormItem from "./FormItem.vue";
import { message } from "ant-design-vue";
const formRef = ref();
const props = defineProps({
  formDomains: {
    type: Array,
    default: [],
  },
  formDisabled: {
    type: Boolean,
    default: false,
  },
});

const disabled = computed(() => {
  return props.formDisabled;
});
const dynamicValidateForm = reactive({});
const domains = computed(() => {
  return props.formDomains;
});
const emits = defineEmits(["submit"]);

const formRules = computed(() => {
  let info = {};
  props.formDomains.forEach((item) => {
    if (item.required) {
      info[item.key] = [
        {
          required: true,
          message: `请填写${item.label}`,
          trigger: [],
        },
      ];
    }
  });
  return info;
});

defineExpose({
  formRef,
});
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}

.dynamic-delete-button:hover {
  color: #777;
}

.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}

.submit {
  margin-top: 20px;
}
</style>
