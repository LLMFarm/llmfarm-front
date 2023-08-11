<!-- TabItem.vue -->
<template>
  <div class="tab-item" :class="{ 'tab-item-active': isActive }" @click="selectTab(item)">
    <p class="title">{{ name }}</p>
    <p class="intro">{{ intro }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  name: String,
  intro: String,
  index: Number,
  activeIndex: Number,
  platformData: {
    type: Array,
    required: true
  }
})

const isActive = ref(props.index === props.activeIndex)
watch(() => props.activeIndex, () => {
  isActive.value = props.index === props.activeIndex
})
const emit = defineEmits(['update:activeIndex'])

function selectTab(item) {
  emit('update:activeIndex', props.index)
}

</script>


<style lang="scss" scoped>
.tab-item {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px;
  cursor: pointer;
  max-width: 300px;
  max-height: 96px;
  transition: all 0.3s;

  .title {
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 10px;
    margin-top: 0px;
    margin-bottom: 6px;
  }

  /*  修改悬停时的样式，使其具有阴影效果*/

  &:hover {
    box-shadow: 0 4px 16px rgba(123, 103, 238, 0.5);
  }

  &.tab-item-active {
    background-color: #7b67ee;
    color: #fff;
    box-shadow: 0 4px 16px rgba(123, 103, 238, 0.5);

    .title {
      color: #fff;
    }
  }
}

.intro {
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  max-width: 80%;
}

.price {
  font-size: 1.2em;
  font-weight: bold;
}
</style>
