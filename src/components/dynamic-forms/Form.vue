<template>
  <a-form ref="formRef" name="dynamic_form_item" :model="dynamicValidateForm" layout="vertical">
    <a-form-item v-for="(domain, index) in domains" :key="domain.key" :label="domain.label" :name="domain.key">
      <a-select v-model:value="tables" v-if="domain.type === 'array'" mode="multiple" show-search placeholder="选择数据库表"
        style="width: 60%" :options="tableOptions" :filter-option="filterOption">
      </a-select>

      <FormItem v-else :domain="domain" :formDisabled="disabled"></FormItem>
    </a-form-item>
    <!-- <a-form-item :key="tables" label="选择数据库表" :name="tables"> </a-form-item> -->
  </a-form>
  <div class="button-group">
    <a-button type="primary" style="margin-right: 12px;" v-if="setting.unique == 'SQL'" @click="testConnection"
      :loading="loading"> {{$t('bot.testConnection')}}
    </a-button>
    <a-button type="primary" class="submit" @click="submitForm" :disabled="disabled">  {{$t('bot.saveSetting')}} </a-button>
  </div>
</template>
<script setup>
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { reactive, ref, computed, watch } from "vue";
import FormItem from "./FormItem.vue";
import sql from "@/services/sql";
import { message } from "ant-design-vue";
const formRef = ref();
const props = defineProps({
  setting: {
    type: Object,
    default: {},
  },
  formDisabled: {
    type: Boolean,
    default: false,
  },
});

const sqlDisabled = ref(true);

const tables = ref([]);
const tableOptions = ref([]);

const filterOption = (input, option) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) !== -1;
};

const loading = ref(false);
const testConnection = async () => {
  loading.value = true;
  const allTables = await getTables().catch(err => {
    message.error(err)
  })
  if (allTables) {
    message.success('连接成功')
  }
  loading.value = false;
}

const getTables = async () => {
  const config = settingValue.value;
  const keys = ['host', 'port', 'dialect', 'username', 'password', 'database'];
  const canSubmit = keys.every(key => {
    return config[key];
  })
  if (!canSubmit) {
    return Promise.reject('请填写完整的数据库连接信息')
  }
  const allTables = await sql.getTables(config).then(res => {
    console.log('getTables.res', res);
    return res;
  }).catch(err => {
    return Promise.reject(err)
  })
  tableOptions.value = allTables.map((item) => {
    return {
      label: item.comment || item.name,
      value: item.name,
    };
  });
  return allTables;
}

const disabled = computed(() => {
  return props.formDisabled;
});
const dynamicValidateForm = reactive({});
const domains = computed(() => {
  return props.setting?.configs;
});
const emits = defineEmits(["submit"]);
const submitForm = () => {
  formRef.value
    .validate()
    .then(() => {
      console.log("values", domains.value);
      let value = {};
      domains.value.forEach((item) => {
        value[item.key] = item.value;
      });

      // 添加 mysql tables 存储
      if (props.setting.unique == 'SQL') {
        value.tables = tables.value;
      }
      emits("submit", value);
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const settingValue = computed(() => {
  let value = {};
  domains.value.forEach((item) => {
    value[item.key] = item.value;
  });
  return value;
})

watch(() => props.setting, () => {
  if (props.setting.unique == 'SQL') {
    getTables().then(res => {
      console.log('更新 settingValue',)
      tables.value = settingValue.value.tables || []
    }).catch(e => {
      console.log("重置");
      tables.value = [];
      tableOptions.value = [];
    })
  } else {
    sqlDisabled.value = false;
  }
}, { immediate: true });

const resetForm = () => {
  formRef.value.resetFields();
};

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
