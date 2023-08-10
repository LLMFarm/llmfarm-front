<template>
  <transition name="dialog-fade" @after-enter="afterEnter" @after-leave="afterLeave">
    <div v-show="visible">
      <!-- <div class="md-wapper"></div>
      <div class="md-content" @click.self="handleOut">
        <slot></slot>
      </div>
       -->
    </div>
  </transition>
</template>

<script>
export default {
  name: "MyDialog",
  data() {
    return {};
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    closeOnClickModal: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    afterEnter() {},
    afterLeave() {},
    handleOut() {
      // this.visible =false
      if (this.closeOnClickModal) {
        this.$emit("closeMyDialog");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.md-wapper {
  z-index: 32;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000;
}
.md-content {
  z-index: 33;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
