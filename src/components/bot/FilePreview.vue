<template>
  <a-spin :tip="$t('loading')" :spinning="spinning">
      <div ref="pdfContainer" style="height: 100vh; overflow: auto;">
        <div v-for="pageNum in numPages" :key="pageNum" class="page" :style="{ height: pageHeights[pageNum - 1] + 'px' }">
          <!-- <a-spin tip="Loading..." :spinning="spinnings[pageNum]"> -->
              <canvas class="pdf-canvas" :ref="`pdfCanvas${pageNum}`"></canvas>
          <!-- </a-spin> -->
        </div>
    </div>
  </a-spin>
</template>

<script setup>
import { ref, onMounted,computed,watch } from 'vue';
import pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/build/pdf';


const props = defineProps({
  pdfUrl: {
    type: String,
    default: true,
  },
  targetPage: {
    type: Number,
    default: 1,
  },
  search: {
    type: String,
    default: "",
  },
});


const pdfContainer = ref(null);
const spinning = ref(true);
const spinnings = ref({});
const numPages = ref(0);
const pageHeights = ref([]);
const canvasRefs = [];
const type = ref("pdf");
let PDFInfo = {}
let loadingTask = null;
let pdfDocument = null;


onMounted(async () => {
  try {
    // 加载PDF.js库
    GlobalWorkerOptions.workerSrc =
      '../../node_modules/pdfjs-dist/build/pdf.worker.js';
    await init()
  } catch (error) {
    console.error('加载 PDF 时出错：', error);
  }
});

const init = async () =>{
  type.value = props.pdfUrl.split(".").pop();
  loadingTask = getDocument(props.pdfUrl);
    pdfDocument = await loadingTask.promise;
    numPages.value = pdfDocument.numPages;
    PDFInfo = {
      "url":props.pdfUrl,
      "search":props.search,
      "targetPage":props.targetPage,
    }
    console.log("url",props.pdfUrl)
    for (let pageNum = 1; pageNum <= numPages.value; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      pageHeights.value.push(viewport.height);
      let pageDiv = document.querySelector(`.page:nth-child(${pageNum})`)
      const canvas =pageDiv.querySelector(".pdf-canvas"); // 使用jQuery选择canvas元素
      if (canvas) {
        canvasRefs[pageNum] = canvas;
      }
    }
    
    scrollToPage(props.targetPage);


    renderPagesFromTargetPage(pdfDocument, props.targetPage);
}

const renderPagesFromTargetPage = async (pdfDocument, targetPage) => {
  //const startPage = Math.max(1, targetPage); // Ensure startPage is not less than 1

  // Render the targetPage first
  renderPage(pdfDocument, targetPage).then(()=>{
    spinning.value = false;
    // try{
    //   let pageDiv = document.querySelector(`.page:nth-child(${targetPage})`)
    //   pageDiv.innerHTML = originalHTMLContent;
    // }catch(e){
    //   console.log("渲染失败",e)
    // }
    //设置高亮
    selectTextOnPage(pdfDocument,targetPage,props.search)
  });
  // Render pages before the targetPage
  for (let pageNum = targetPage - 1; pageNum >= 1; pageNum--) {
    await renderPage(pdfDocument, pageNum);
  }

  // Render pages after the targetPage
  for (let pageNum = targetPage + 1; pageNum <= numPages.value; pageNum++) {
    await renderPage(pdfDocument, pageNum);
  }
};

// Function to render a specific PDF page
const renderPage = async (pdfDocument, pageNum) => {
  const page = await pdfDocument.getPage(pageNum);
  const canvas = canvasRefs[pageNum];
  console.log("canvas",canvas);
  if (!canvas) return;

  const viewport = page.getViewport({ scale: 1 });
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };
  // spinnings.value[pageNum] = false; // 显示加载中
  await page.render(renderContext).promise;
 
};


const selectTextOnPage = async (pdfDocument,pageNumber,textToSelect) => {
  // spinnings.value[pageNumber] = true; // 显示加载中
  console.log("高亮文本",textToSelect)
      pdfDocument.getPage(pageNumber).then((page) => {
        const viewport = page.getViewport({ scale: 1 });
        const canvasSelect = canvasRefs[pageNumber];
        const context = canvasSelect.getContext('2d');

        // 获取页面的文本内容
        page.getTextContent().then((textContent) => {
          let arr = [] 
          textContent.items.forEach((textItem) => {
            arr.push(textItem.str)
          });
          console.log("arr=====",arr);
          const [startIndex, endIndex] = findText(arr, textToSelect);
          console.log("startIndex=====",startIndex);
          console.log("endIndex=====",endIndex);

          textContent.items.forEach((textItem,index) => {
            //console.log("textItem.str=====",textItem.str);
            if (index >= startIndex && index <= endIndex) {
              context.beginPath();
              context.rect(
                textItem.transform[4],
                viewport.height - textItem.transform[5] - 11,
                textItem.width,
                textItem.height + 0
              );
              context.fillStyle = 'yellow';
              context.globalAlpha = 0.5;
              context.fill();
              context.closePath();
            }
          });
        });
      });
    
      // spinnings.value[pageNumber] = false; // 隐藏加载中
};


const clearHighlightOnPage = async (pdfDocument, pageNumber) => {
  const canvasClear = canvasRefs[pageNumber];
  const context = canvasClear.getContext('2d');

  // 清除之前的高亮
  context.clearRect(0, 0, canvasClear.width, canvasClear.height);

  // 重新渲染页面，清除高亮
  const page = await pdfDocument.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1 });
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };
  await page.render(renderContext);
};

function findText(arr, targetText) {
    let startIndex = 0;
    let endIndex = 0;
    let temp = '';
    //循环arr
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '') {
            continue;
        }
        //先找到开头
        if (targetText.indexOf(arr[i]) === 0) {
          startIndex = i;
            temp = arr[i];
            //再找到结尾
            for (let j = i + 1; j < arr.length; j++) {
                temp += arr[j];
                if (targetText.indexOf(temp) === 0) {
                    endIndex = j;
                    continue;
                } else {
                    break;
                }
            }
            break;
        }else{
            continue
        }
    }
    return [startIndex, endIndex];
}

const scrollToPage = (pageNum) => {
  console.log("pageNum=====",pageNum);
  const targetDiv = document.querySelector(`.page:nth-child(${pageNum})`);
  if (!targetDiv || !pdfContainer.value) return;
  console.log("targetDiv=====",targetDiv.offsetTop);
  pdfContainer.value.scrollTop = targetDiv.offsetTop;
};


//监听 search
watch(
  () => props.search,
  (newVal, oldVal) => {
    searchChange()
  }
); 

//search改变事件
const searchChange = () => {
  //判断url是否改变
  if(PDFInfo.url != props.pdfUrl){
    console.log("url改变")
  }else if(PDFInfo.targetPage == props.targetPage){
    //页面不变
    console.log("页面不变")
    clearHighlightOnPage(pdfDocument,PDFInfo.targetPage).then(()=>{
      selectTextOnPage(pdfDocument,props.targetPage,props.search)
      PDFInfo.search = props.search
    })
  }else{
    console.log("search改变")
    //跳转到指定页
    console.log("search改变",props.targetPage)
    scrollToPage(props.targetPage);
    clearHighlightOnPage(pdfDocument,PDFInfo.targetPage).then(()=>{
      console.log("清除高亮")
    })
    //设置高亮
    selectTextOnPage(pdfDocument,props.targetPage,props.search)
    //设置PDFInfo
    PDFInfo.search = props.search
    PDFInfo.targetPage = props.targetPage
  }
}
</script>
<style>
  .highlight {
    position: absolute;
    background-color: yellow;
    opacity: 0.5;
  }

  .page {
    margin: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
</style>