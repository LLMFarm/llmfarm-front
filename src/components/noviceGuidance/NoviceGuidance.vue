<template>
  <div class="outbox">
    <div class="text"></div>
    <div class="pos-bg">
      <my-dialog :visible="visible">
        <!-- <PositionGuide @close="close"></PositionGuide> -->
      </my-dialog>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { getCurrentInstance, ref, reactive } from "vue";
import MyDialog from "@/components/noviceGuidance/MyDialog/index";
import PositionGuide from "@/components/noviceGuidance/PositionGuide.vue";
const visible = ref(true);
const close = () => {
  visible.value = false;
};
</script>

<style lang="scss" scoped>
.pos-bg {
  width: 1100px;
  margin: 0 auto;
  height: 84vh;
  background-size: 100%;
}
</style>
