// warterMark.js
'use strict'

let watermark = {}
let id = '1.23452384164.123412415'

let setWatermark = (str, str1) => {
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }
  // 获取主题
  let theme = localStorage.getItem('theme') || "light";
  let can = document.createElement('canvas')// 创建一个画布
  can.width = 150 // 设置宽度
  can.height = 150 // 高度

  let cans = can.getContext('2d')
  cans.rotate(-25 * Math.PI / 180) // 水印旋转角度    0 水平
  cans.font = '12px Vedana'  // 字体大小
  cans.fillStyle = `rgba(232, 235, 240, ${theme == 'light' ? 1 : 0.1})` // 水印的颜色
  cans.textAlign = 'center' // 设置文本内容的当前对齐方式
  cans.textBaseline = 'Middle' // 设置在绘制文本时使用的当前文本基线
  cans.globalAlpha = 1// 透明度
  // cans.fillText(str, can.width / 3, can.height / 2) // 在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
  cans.fillText(str1, can.width / 3, can.height / 2.5) // 根据需求可添加多行水印，在方法中添加str1

  let div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '0px'
  div.style.left = '0px'
  div.style.position = 'fixed'
  div.style.zIndex = '10'
  div.style.width = document.documentElement.clientWidth + 'px'
  div.style.height = document.documentElement.clientHeight + 'px'
  // document.querySelector(".chat-container").style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  div.className = "watermarks"
  document.body.appendChild(div)
  return id
}

let setWatermarkTryChain = (str, str1, className) => {
  // if (document.getElementById(id) !== null) {
  //   document.body.removeChild(document.getElementById(id))
  // }
  // 获取主题
  let theme = localStorage.getItem('theme') || "light";
  let can = document.createElement('canvas')// 创建一个画布
  can.width = 250 // 设置宽度
  can.height = 250 // 高度

  let cans = can.getContext('2d')
  cans.rotate(-25 * Math.PI / 180) // 水印旋转角度    0 水平
  cans.font = '12px Vedana'  // 字体大小
  cans.fillStyle = `rgba(232, 235, 240, ${theme == 'light' ? 1 : 0.1})` // 水印的颜色
  cans.textAlign = 'center' // 设置文本内容的当前对齐方式
  cans.textBaseline = 'Middle' // 设置在绘制文本时使用的当前文本基线
  cans.globalAlpha = 1// 透明度
  // cans.fillText(str, can.width * 4, can.height / 2) // 在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
  cans.fillText(str1, can.width / 3, can.height / 2.5) // 根据需求可添加多行水印，在方法中添加str1
  // document.createElement('div')
  let div = document.getElementsByClassName(className)[0]
  // div.id = id
  // div.style.pointerEvents = 'none'
  // div.style.top = '0px'
  // div.style.left = '0px'
  // div.style.position = 'fixed'
  // div.style.zIndex = '10'
  // div.style.width = document.documentElement.clientWidth + 'px'
  // div.style.height = document.documentElement.clientHeight + 'px'
  // document.querySelector(".chat-container").style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  //div.className = "watermarks"
  //document.body.appendChild(div)
  return id
}


// 该方法只允许调用一次
watermark.set = (str, str1) => {
  // let id = setWatermark(str, str1)
  // setInterval(() => {
  //   if (document.getElementById(id) === null) {
  //     id = setWatermark(str, str1)
  //   }
  // }, 500)
  setWatermark(str, str1)

  // window.onresize = () => {
  //   setWatermark(str, str1)
  // }
}

watermark.setTryChain = (str, str1, className) => {
  setWatermarkTryChain(str, str1, className)
}

watermark.remove = () => {
  var child = document.getElementById(id);
  document.body.removeChild(child);
}
export default watermark

