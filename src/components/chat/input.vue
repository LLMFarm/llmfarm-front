<template>
  <a-auto-complete
    ref="autoComplete"
    :open="openAutoComplete"
    :options="commandOptions"
    @select="selectOption"
    style="width: 100%"
  >
    <div class="dialog-input">
      <el-input
        id="input-box"
        v-model="question"
        ref="autoCompleteInput"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 8 }"
        :placeholder="inputPlaceholder"
        resize="none"
        :input-style="inputStyle"
        @keydown="askQuestion($event)"
        @blur="autoCompleteBlur"
        v-if="!disabledInput"
      />
      <div class="disabled-input" v-else>{{ inputPlaceholder }}<a @click="toUpgrade"> {{$t('upgrade.name')}}</a></div>
    </div>
    <template #option="item">
      <template v-if="item.options">
        <div class="category">
          {{ item.title }}
        </div>
      </template>

      <template v-if="item.type === 'command'">
        <div class="command">
          <div class="icon">/</div>
          {{ item.title }}
        </div>
      </template>

      <template v-if="item.type === 'bot'">
        <div style="display: flex; flex-direction: row; align-items: center">
          <img class="bot-icon" :src="item.icon" v-if="item.icon" />
          <img :src="llmFarmIcon" class="bot-icon" v-else />
          <div class="bot">{{ item.title }}</div>
        </div>
      </template>
    </template>
  </a-auto-complete>
</template>

<script setup>
import { ref, reactive, inject, computed, watch } from "vue";
import fuzzy from "fuzzy";
import llmFarmIcon from "@/assets/LLMFarm占位图.svg";

const t = inject("$i18nT");
const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  disabledInput: {
    type: Boolean,
    default: false,
  },
  disabledPlaceholder: {
    type: String,
    default: "当前用量已超出，请前往",
  },
});

const autoComplete = ref();
const autoCompleteInput = ref();
const openAutoComplete = ref();

const probation = inject("probation");

const emit = defineEmits(["update:value", "ask-question", "exec", "select", "upgrade"]);

const commandOptions = ref([]);

const toUpgrade = () => {
  emit("upgrade");
};

const question = computed({
  get: () => props.value,
  set: (val) => emit("update:value", val),
});
const inputPlaceholder = computed(() => {
  if (props.disabledInput) {
    return props.disabledPlaceholder;
  }
  return `${t("chat.enterContent")}${probation ? "" : `, ${t("chat.enterToSwitchBot")}`}`;
});
const matchFn = (item) => {
  const keyword = question.value.split("/")[1];
  return fuzzy.match(keyword, item.pinyin) || fuzzy.match(keyword, item.title);
};
const resolveMatches = () => {
  const list = JSON.parse(JSON.stringify(props.options));
  const matches = list.filter((item) => {
    item.options = item.options.filter(matchFn);
    return item.options.length;
  });
  return matches;
};

const handleCommand = () => {
  console.log("question.value", question.value);
  // const keyword = question.value.split('/')[1];
  const list = resolveMatches();
  commandOptions.value = list;
};

const selectOption = (value) => {
  console.log("select.value", value);
  if (value === "add-bot") {
    emit("exec", "add-bot");
  }
  if (typeof value === "number") {
    console.log("change bot", value);
    emit("select", value);
  }
  question.value = "";
};

watch(
  () => question.value,
  (val) => {
    if (val && val.startsWith("/") && !probation) {
      handleCommand();
    } else {
      commandOptions.value = [];
    }
  }
);

const askQuestion = (event) => {
  // console.log('key', event.key);
  if (event.key === "Enter" && question.value.startsWith("/")) {
    event.preventDefault();
    return;
  }

  emit("ask-question", event);
};

const inputStyle = reactive({
  fontSize: "16px",
  color: "#000000",
});
const autoCompleteBlur = () => {
  // console.log("autoCompleteBlur");
  openAutoComplete.value = undefined;
  if (question.value.startsWith("/")) {
    question.value = "";
  }
};

defineExpose({
  autoComplete,
  openAutoComplete,
  autoCompleteInput,
});
</script>

<style lang="scss" scoped>
.dialog-input {
  min-height: 50px;
  width: 100%;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  .disabled-input {
    width: 100%;
    padding: 0px 20px;
    height: 50px;
    background: rgba(245, 245, 245, 1);
    color: rgba(78, 79, 82, 1);
    display: flex;
    align-items: center;
    user-select: none;
    a {
      //下划线
      text-decoration: underline;
    }
  }
}

.bot-icon {
  width: 15px;
  height: 15px;
  margin-right: 5px;
}

.command {
  display: flex;
  align-items: center;
  padding: 5px 0;
  font-size: 14px;

  .icon {
    margin-right: 5px;
    color: #999;
  }
}

:deep(.ant-select-item-option-grouped) {
  padding-left: 0px !important;
}

:deep(.el-textarea__inner) {
  box-shadow: none;
  padding: 5px 20px;
}
</style>
