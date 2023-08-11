<template>
  <div class="re-guide">
    <div class="re-content">
      <div
        class="re-cbtn"
        :style="{
          height: copyDomRect.height + 'px',
          left: copyDomRect.left + 'px',
          top: copyDomRect.top + 'px',
          width: copyDomRect.width + 'px',
        }"
        @click="domClick"
      ></div>

      <transition name="fade" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
        <div class="ta-show">
          <div>
            <!-- :class="[step === 'two' ? 'two-line' :'']" -->
            <div class="job-line">
              <img class="item-icon" :src="icon" />
            </div>
            <div class="job-know" @click="close">我知道了，马上体验</div>
            <div class="j-tips">{{ `${step + 1 + "/" + steps.length} ${selectStep.title}` }}</div>
            <div class="ta-btn">
              <div class="btn-know" v-if="step > 0" @click="doLastFun">上一步</div>
              <div class="btn-know" v-if="step + 1 != steps.length" @click="doNextFun">下一步</div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { computed, defineComponent, watch, onMounted, reactive, ref } from "vue";

import html2canvas from "html2canvas";

const show = ref(true);
const step = ref(0);
const info = ref("");
const steps = ref([
  { dom: ".menus>.list div:nth-child(1)", title: "选择会话" },
  { dom: ".toolbar>.addBtn", title: "选择'+新会话'" },
  {
    dom: ".select-model>.select-input ",
    title:
      "选择Bot，“GPT-3.5”每一个Bot都代表不同的能力，在会话过程中，您可以切换Bot完成您的需求；如果您想要创建自己的Bot，可以选择左侧菜单的“Bot”去进行新建",
  },
  { dom: "#input-box", title: "输入您的问题，例如：你能帮我做什么？" },
  { dom: ".send-icon-container", title: "点击“发送”，进行提问'(每次提问都会消耗token用量)" },
]);
const selectStep = computed({ get: () => steps.value[step.value], set: (val) => (step.value = val) });

const copyDomRect = ref({});
const icon = computed(() => {
  return new URL("/src/assets/箭头.svg", import.meta.url).href;
});
onMounted(() => {
  copyDom();
});
watch(
  () => step.value,
  (val) => {
    copyDom();
  }
);
const beforeEnter = (el) => {
  el.style.transform = "translate(-400px, 238px)";
};
const enter = (el, done) => {
  el.offsetWidth; // 这句话，没有实际的作用，但是，如果不写，出不来动画效果；  // 可以认为 el.offsetWidth 会强制动画刷新
  // enter 表示动画 开始之后的样式，这里，可以设置小球完成动画之后的，结束状态
  el.style.transform = "translate(782px, 238px)";
  el.style.transition = "all 1.5s ease";
  //done()
};
const afterEnter = (el) => {
  // 动画完成之后，会调用 afterEnter
  //  el.style.transition = 'all 0.1s ease'
  show.value = false;
};
const domClick = () => {
  let dom = document.querySelector(selectStep.value.dom);
  dom.click();
  dom.focus();

  // e.stopPropagation()
  // e.preventDefault()
};
const doLastFun = () => {
  step.value--;
};
const doNextFun = () => {
  step.value++;
};
const emits = defineEmits(["close"]);
const close = () => {
  // show.value = false;
  emits("close");
};
//复制目标dom为canvas悬浮在原dom上
const copyDom = () => {
  let dom = document.querySelector(selectStep.value.dom);
  createdIMG(dom);
};
const createdIMG = (canvasValue) => {
  const box = document.querySelector(".re-cbtn");
  if (box.querySelector(".canvas-img")) {
    box.removeChild(box.querySelector(".canvas-img"));
  }
  const canvas = document.createElement("canvas");
  const canvasDom = canvasValue;
  const width = canvasDom.offsetWidth;
  const height = canvasDom.offsetHeight;
  console.log("获取指定的宽高", width, height);
  var scalue = 2; // 宽高扩大 2 倍 处理图片模糊
  canvas.width = width * scalue;
  canvas.height = height * scalue;
  const options = {
    backgroundColor: null,
    canvas: canvas,
    useCORS: true, // 配置允许跨域
    scale: scalue,
    width: width,
    height: height,
    allowTaint: true,
    /* eslint-disable no-dupe-keys */
    useCORS: true /* 使用跨域 */,
  };
  html2canvas(canvasDom, options)
    .then((canvas) => {
      try {
        // 生成图片地址
        console.log("canvas.toDataURL('image/jpeg')", canvas.toDataURL("image/jpeg"));
        //state.imgURL = canvas.toDataURL('image/jpeg')
        const img = document.createElement("img");
        img.src = canvas.toDataURL("image/jpeg");
        copyDomRect.value = canvasDom.getBoundingClientRect();
        console.log(copyDomRect.value, "copyDomRect");
        img.style.width = "100%";
        img.className = "canvas-img";
        img.style.position = "fixed";
        img.style.top = copyDomRect.value.top + "px";
        img.style.left = copyDomRect.value.left + "px";
        img.style.width = copyDomRect.value.width + "px";
        img.style.height = copyDomRect.value.height + "px";
        img.style.zIndex = "999";
        //将img悬浮在canvasDom上
        box.appendChild(img);
      } catch (e) {
        console.log("生成失败" + e);
      }
    })
    .catch((err) => {
      console.log("绘制失败", err);
    });
};
</script>

<style scoped lang="scss">
.re-guide {
  height: 100%;
  position: relative;
  /*   height: 100vh;*/

  .re-content {
    position: relative;
    width: fit-content;
    margin: 0 auto;

    .re-cbtn {
      position: fixed;
      .btn-block {
        display: flex;
        width: 140px;
        height: 40px;
        background: #437fff;
        border-radius: 4px;
        align-items: center;
        color: #ffffff;
        justify-content: space-evenly;
        &:hover {
          cursor: pointer;
        }
        .btn-edit {
          display: inline-block;
          width: 16px;
          height: 16px;
          line-height: 16px;
        }
        .btn-word {
          display: inline-block;
        }
      }
    }

    .g-btn {
      width: 60px;
      height: 52px;
      /* background: #FFFFFF;*/
      position: absolute;
      left: 920px;
      top: 486px;
      display: flex;
      align-items: center;
      justify-content: center;
      .btn-tr {
        width: 96px;
        height: 32px;
        background: #ffffff;
        border-radius: 4px;
        line-height: 32px;
        color: #437fff;
        text-align: center;
      }
    }
    .ta-show {
      .tip-line {
        width: 150px;
        height: 120px;
        transform: rotateX(180deg);
        /* transform: rotate(45deg);*/
      }
      .job-line {
        width: 150px;
        height: 120px;
      }
      .two-line {
        transform: rotateX(180deg);
      }
      .job-know {
        width: fit-content;
        padding: 0 16px;
        height: 44px;
        text-align: center;
        color: #ffffff;
        border: 1px solid #ffffff;
        border-radius: 8px;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 0 20px -288px;
        &:hover {
          cursor: pointer;
        }
      }
      .ta-btn {
        margin: 0 0 20px -288px;
        display: flex;
        .btn-know {
          width: 120px;
          height: 44px;
          line-height: 54px;
          text-align: center;
          color: #ffffff;
          border: 1px solid #ffffff;
          border-radius: 8px;
          margin-right: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          &:hover {
            cursor: pointer;
          }
        }
        .btn-next {
          margin-left: 70px;
          /*width: 60px;*/
          width: 125px;
          height: 54px;
          line-height: 54px;
          text-align: center;
          color: #ffffff;
          &:hover {
            /* color: #437fff;*/
            cursor: pointer;
          }
        }
      }

      .t-tips {
        height: 34px;
        font-size: 22px;
        margin: 0 0 20px -326px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        font-weight: 500;
        color: #ffffff;
        line-height: 51px;
      }
      .j-tips {
        max-width: 700px;
        height: fit-content;
        font-size: 22px;
        font-family: SourceHanSansCN-Medium, SourceHanSansCN;
        color: #ffffff;
        line-height: 51px;
        margin: 0 0 20px -288px;
      }
    }
  }
}
</style>
