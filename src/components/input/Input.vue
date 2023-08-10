<template>
    <!-- <div>
        <input v-model="testValue" />
    </div> -->
    <a-input v-model:size="size" v-model:value="testValue" placeholder="请输入手机号" :class="{ 'is-invalid': testValue }" />
    <div class="error-seat"><a-alert show-icon class="invalid-feedback" :type="'error'" :message="errorInfo"
            v-if="errorInfo" />
    </div>
</template>
  
<script setup>

import {
    defineProps,
    defineEmits,
    computed,
    ref
} from 'vue'


const props = defineProps({
    value: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: 'large'
    },
    errorMessage: {
        type: String,
        default: ''
    }
})

const errorInfo = ref('');

let emits = defineEmits(["update:value", "update:size", "update:errorInfo"]);

const testValue = computed({
    get: () => props.value,
    set: (val) => {
        if (val == "") {
            console.log("props.errorMessage", props.errorMessage);
            errorInfo.value = props.errorMessage;
            console.log("errorInfo", errorInfo.value);
        }
        emits('update:value', val)
    }

});


const size = computed({
    get: () => props.size,
    set: (val) => {
        emits('update:size', val)
    }
});
// const errorMessage = computed({
//     get: () => props.errorMessage,
//     set: (val) => {
//         emits('update:errorMessage', val)
//     }
// });
</script>
  
<style lang="scss" scoped>
input {
    border-radius: 4px;
}

.error-seat {
    height: 30px
}

.invalid-feedback {
    background: #fff;
    color: #f5222d;
    font-size: 14px;
    line-height: 1.5;
    border: 0px;
    padding: 0px, 0px;
    display: flex;
}

.ant-alert {
    padding: 0px
}
</style>