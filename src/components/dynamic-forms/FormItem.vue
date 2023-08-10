<template>
  <template v-if="domain.control">
    <template v-if="domain.control.type == 'select'">
      <a-select
        v-model:value="domain.value"
        :filter-option="filterOption"
        :options="domain.control.options"
        show-search
        :placeholder="`${$t('pleaseEnter')}${domain.label}`"
        :disabled="disabled"
        style="width: 60%"
    /></template>
    <template v-else-if="domain.control.type == 'password'">
      <a-input-password
        v-model:value="domain.value"
        :placeholder="`${$t('pleaseEnter')}${domain.label}`"
        style="width: 60%"
        :disabled="disabled"
      />
    </template>
  </template>
  <template v-else>
    <a-input
      v-model:value="domain.value"
      :placeholder="`${$t('pleaseEnter')}${domain.label}`"
      style="width: 60%"
      :disabled="disabled"
    />
  </template>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({
  domain: {
    type: Object,
    default: {},
  },
  formDisabled: {
    type: Boolean,
    default: false,
  },
});

const disabled = computed(() => {
  return props.formDisabled;
});
const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
</script>
<style></style>
