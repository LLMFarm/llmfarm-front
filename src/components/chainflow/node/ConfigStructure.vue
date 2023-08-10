<template>
  <div class="prompt-container" @click="show">
    <span style="font-weight: 500;">
      指令配置
    </span>

    <a-modal v-model:visible="visible" title="结构参数配置" width="500px" :before-close="handleClose" :showCount="true">
      <div class="content">

        <a-button type="primary" size="small" style="font-size: 12px;" @click="append">新增参数</a-button>
        <div class="editor">
          <div class="item" v-for="(item, index) in list" :key="index">
            <a-input placeholder="请输入参数名称" v-model:value="item.key" style="flex:1" />
            <a-input placeholder="请输入参数描述" v-model:value="item.label" style="flex:2" />
            <a-select v-model:value="item.type" style="width:100px" :options="typeOptions"></a-select>
            <a-button danger @click="remove(index)" size="small">X</a-button>
          </div>
        </div>

        <div class="footer">
          <p>说明: 用于生成结构化指令, 能够对 AI 的回复做出一系列指令和约束, 方便后续流程节点的标准化执行</p>
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
import { Modal as AModal, Select as ASelect, Button as AButton, Input as AInput } from "ant-design-vue"

// import
const visible = ref(false);

const emit = defineEmits('update:value');

const props = defineProps({
  value: {
    type: Array,
    required: true,
    default: () => [],
  },
})
const handleOk = (e) => {
  visible.value = false;
}

const show = () => {
  visible.value = true;
}

const list = computed({
  get() {
    return props.value || []
  },
  set(val) {
    emit('update:value', val)
  }
})

const typeOptions = ref([
  { value: 'number', label: '数字' },
  { value: 'string', label: '字符串' },
])

const append = () => {
  list.value.push({ key: '', label: '', type: 'string' })
  console.log('list.value', list.value);
}

const remove = (index) => {
  list.value.splice(index, 1)
}

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
    padding: 12px 0;

    .item {
      display: flex;
      column-gap: 20px;
      margin-top: 8px;

      input {
        font-size: 12px;
      }
    }
  }

  .footer {
    p {
      color: #6b7280;
      padding: 4px 8px;
      margin: 0;
    }
  }
}
</style>