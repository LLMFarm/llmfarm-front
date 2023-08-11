<template>
  <div class="prompt-container" @click="show">
    <span style="font-weight: 500;">
      公式配置
    </span>

    <a-modal v-model:visible="visible" title="代码编辑" width="700px" :showCount="true">
      <div class="content">

        <div class="editor">
          <a-textarea v-model:value="modelValue" :bordered="false" :placeholder="placeholder" :rows="16" />
        </div>

        <div class="footer">
        </div>
      </div>

      <template #footer>
        <a-button type="primary" @click="handleOK">确定</a-button>
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
const placeholder = `return a + b;`
const emit = defineEmits('update:value');

const props = defineProps({
  value: {
    type: String,
    required: true,
    default: ''
  },
})

const handleOK = (e) => {
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