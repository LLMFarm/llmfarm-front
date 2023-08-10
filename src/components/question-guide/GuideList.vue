<template>
  <div class="guide-list">
    <div :class="['guide-item', item.type == 'example' ? 'guide-item-hover' : '']" v-for="(item, index) in guideData"  :key="index"  @click="selectGuide(item)">
      {{ item.name }} <span v-if="item.type == 'example'">→</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  guideData: {
    type: Array,
    required: true
  }
})

const emits = defineEmits(['select'])

function selectGuide (item) {
  emits('listSelect', item)
}
</script>

<style lang="scss" scoped>
.guide-list {
  .guide-item {
    background-color: rgba(247, 247, 248, 0.6);
    color: #111111;
    font-weight: 400;
    padding: 14px;
    max-width: 250px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    border-radius: 0.375rem;
    margin-top: 16px;
    text-align: center;
  }
  .guide-item-hover {
    cursor: pointer;
    &:hover {
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
      background-color: #d9d9e3;
    }
  }
}
</style>
