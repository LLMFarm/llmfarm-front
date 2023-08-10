<template>
  <div class="prompt-container" @click="show">
    <span style="font-weight: 500;">
      提示词编排
    </span>

    <a-modal v-model:visible="visible" title="提示词编排" width="700px" :showCount="true">
      <div class="content">

        <div class="editor">
          <!-- <span style="padding: 0 12px;">提示词编排: </span> -->
          <a-textarea v-model:value="modelValue" :bordered="false" :placeholder="placeholder" :rows="8" />
        </div>

        <div class="footer">
          <p>模板说明: 可以使用提示词模板对 AI 的回复做出一系列指令和约束</p>
          <p>可插入变量，例如 {{ variable }}</p>
        </div>
      </div>

      <template #footer>
        <a-button type="primary" @click="handleOk">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { Modal as AModal, Textarea as ATextarea, Button as AButton } from "ant-design-vue"

const handleDynamic = inject('handleDynamic');

// import
const visible = ref(false);
const variable = ref(`{question} 表示用户输入文本内容, {context} 表示知识库上下文信息`)
const placeholder = `现在你是一个专业翻译人员，你的目标是把中文翻译成英文和西班牙语。
===
待翻译文本: {question}
result:
`
const emit = defineEmits('update:value');

const props = defineProps({
  value: {
    type: String,
    required: true,
    default: ''
  },
})
const handleOk = (e) => {
  handleDynamic();
  visible.value = false;
}

const show = () => {
  visible.value = true;
}

const modelValue = computed({
  get() {
    return props.value
  },
  set(val) {
    emit('update:value', val)
  }
})
</script>

<style lang="scss" scoped>
.prompt-container {
  background-color: rgb(235, 245, 255);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;

  span {
    color: #1c64f2
  }

}

.content {

  .editor {
    margin-top: 12px;
  }

  .footer {
    p {
      color: #6b7280;
      padding: 4px 12px;
      margin: 0;
    }
  }
}
</style>